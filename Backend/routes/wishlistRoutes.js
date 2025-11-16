const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/auth");

// All wishlist routes require authentication
router.use(protect);

// Wishlist routes
router.get("/", getWishlist);
router.post("/add", addToWishlist);
router.delete("/remove/:itemId", removeFromWishlist);
router.delete("/clear", clearWishlist);

module.exports = router;
