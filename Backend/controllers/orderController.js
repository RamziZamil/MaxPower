const Order = require("../models/Order");
const Item = require("../models/Item");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
    } = req.body;

    // Verify items and update inventory
    for (const orderItem of items) {
      const item = await Item.findById(orderItem.item);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `Item not found: ${orderItem.item}`,
        });
      }

      // Check if enough stock is available
      if (item.stockQuantity < orderItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for: ${item.name}`,
        });
      }

      // Update stock
      item.stockQuantity -= orderItem.quantity;
      await item.save();
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
    });

    // Populate item details
    await order.populate("items.item");

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.item")
      .populate("user", "name email");

    // Check if order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if the order belongs to the current user or if user is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving order",
      error: error.message,
    });
  }
};

// Get current user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.item");

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving orders",
      error: error.message,
    });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    // If status is delivered, set delivered date
    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    // Save the updated order
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// Mark order as paid
exports.updateOrderToPaid = async (req, res) => {
  try {
    const { paymentResult } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = paymentResult || {
      id: "manual",
      status: "completed",
      update_time: Date.now(),
      email_address: req.user.email,
    };

    // Save the updated order
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating payment status",
      error: error.message,
    });
  }
};

// Handle Stripe webhook
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const order = await Order.findOne({ paymentIntentId: paymentIntent.id });

      if (order) {
        order.paymentStatus = "paid";
        order.orderStatus = "processing";
        await order.save();

        // Update item stock
        for (const item of order.items) {
          await Item.findByIdAndUpdate(item.item, {
            $inc: { stockQuantity: -item.quantity },
          });
        }
      }
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      const failedOrder = await Order.findOne({
        paymentIntentId: failedPayment.id,
      });

      if (failedOrder) {
        failedOrder.paymentStatus = "failed";
        await failedOrder.save();
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const query = Order.find()
      .populate("items.item")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (limit > 0) {
      query.limit(limit);
    }

    const orders = await query;

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
