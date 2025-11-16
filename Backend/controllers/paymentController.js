const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/Cart");
const Item = require("../models/Item");
const Order = require("../models/Order");

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amounts in cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Handle successful payment
const handleSuccessfulPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }

    // Get cart and update stock
    const cart = await Cart.findById(paymentIntent.metadata.cartId).populate(
      "items.item"
    );

    // Update stock quantities
    for (const cartItem of cart.items) {
      const item = cartItem.item;
      item.stockQuantity -= cartItem.quantity;
      await item.save();
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Payment successful and order processed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing payment",
      error: error.message,
    });
  }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Retrieve payment intents for the user
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      metadata: { userId: userId.toString() },
    });

    res.status(200).json({
      success: true,
      data: paymentIntents.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving payment history",
      error: error.message,
    });
  }
};

// Refund payment
const refundPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform refund",
      });
    }

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    res.status(200).json({
      success: true,
      data: refund,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing refund",
      error: error.message,
    });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      paymentIntent: paymentIntent,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's cart with populated items
    const cart = await Cart.findOne({ user: userId }).populate("items.item");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Create line items from cart
    const lineItems = cart.items.map((cartItem) => {
      // Ensure price is a number and convert to cents
      const priceInCents = Math.round(Number(cartItem.item.pricePerUnit) * 100);

      if (isNaN(priceInCents)) {
        throw new Error(`Invalid price for item: ${cartItem.item.name}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: cartItem.item.name,
            description: cartItem.item.description || "",
          },
          unit_amount: priceInCents,
        },
        quantity: cartItem.quantity,
      };
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.protocol}://${req.get(
        "host"
      )}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get("host")}/api/payment/cancel`,
      metadata: {
        userId: userId.toString(),
        cartId: cart._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // Get cart with populated items
      const cart = await Cart.findOne({
        _id: session.metadata.cartId,
      }).populate("items.item");

      // Calculate total amount
      const totalAmount = cart.items.reduce((total, item) => {
        return total + item.item.pricePerUnit * item.quantity;
      }, 0);

      // Create order
      await Order.create({
        user: session.metadata.userId,
        items: cart.items.map((item) => ({
          item: item.item._id,
          quantity: item.quantity,
          price: item.item.pricePerUnit,
        })),
        totalAmount,
        paymentStatus: "paid",
        paymentIntentId: session.payment_intent,
        status: "processing",
      });

      // Clear the user's cart
      await Cart.findOneAndUpdate(
        { _id: session.metadata.cartId },
        { $set: { items: [] } }
      );

      console.log("Payment successful for session:", session.id);
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful:", paymentIntent.id);
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      // Update order status to failed
      await Order.findOneAndUpdate(
        { paymentIntentId: failedPayment.id },
        { paymentStatus: "failed" }
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Add new function to get order status
const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).populate("items.item");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving order status",
      error: error.message,
    });
  }
};

// Add new function to get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      status,
      paymentStatus,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query = { user: userId };

    // Add filters if provided
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    // Get orders with populated items and pagination
    const orders = await Order.find(query)
      .populate("items.item", "name description pricePerUnit")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Calculate summary statistics
    const stats = await Order.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
          ordersByStatus: {
            $push: {
              status: "$status",
              amount: "$totalAmount",
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
        statistics: stats[0] || {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          ordersByStatus: [],
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving orders",
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentIntent,
  handleSuccessfulPayment,
  getPaymentHistory,
  refundPayment,
  confirmPayment,
  createCheckoutSession,
  handleWebhook,
  getOrderStatus,
  getUserOrders,
};
