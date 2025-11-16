const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  handleSuccessfulPayment,
  getPaymentHistory,
  refundPayment,
  confirmPayment,
  createCheckoutSession,
  handleWebhook,
  getOrderStatus,
  getUserOrders,
} = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");

// All payment routes require authentication
router.use(protect);

// Payment routes
router.post("/create-payment-intent", createPaymentIntent);
router.post("/success", handleSuccessfulPayment);
router.get("/history", getPaymentHistory);

// Admin only routes
router.post("/refund/:paymentIntentId", authorize("admin"), refundPayment);

// New routes
router.post("/confirm-payment", confirmPayment);

// Create a checkout session
router.post("/create-checkout-session", createCheckoutSession);

// Stripe webhook (no auth required as it's called by Stripe)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

// Get user's orders
router.get("/orders", getUserOrders);

// Get specific order status
router.get("/orders/:orderId", getOrderStatus);

module.exports = router;
