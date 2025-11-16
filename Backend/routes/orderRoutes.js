const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  updateOrderToPaid,
  handleStripeWebhook,
  getAllOrders,
} = require("../controllers/orderController");

// Stripe webhook route (no auth required)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Protected routes
router.use(protect);

// User routes
router.post("/", createOrder);
router.get("/myorders", getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id/pay", updateOrderToPaid);

// Admin only routes
router.get("/", authorize("admin"), getAllOrders);
// Support both PUT and PATCH methods for status updates
router.put("/:id", authorize("admin"), updateOrderStatus);
router.patch("/:id", authorize("admin"), updateOrderStatus);
router.put("/:id/status", authorize("admin"), updateOrderStatus);
router.patch("/:id/status", authorize("admin"), updateOrderStatus);

module.exports = router;
