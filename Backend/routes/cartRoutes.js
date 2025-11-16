const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require("../controllers/cartController");

// All routes require authentication
router.use(protect);

// Get user's cart
router.get("/", getCart);

// Add item to cart
router.post("/add", addToCart);

// Update cart item quantity
router.put("/update-quantity", updateCartItem);

// Remove item from cart
router.delete("/remove/:itemId", removeFromCart);

// Clear cart
router.delete("/clear", clearCart);

module.exports = router;
