const express = require("express");
const router = express.Router();
const {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getItemsByCategory,
} = require("../controllers/itemController");
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

// Public routes
router.get("/", getAllItems);
router.get("/category", getItemsByCategory);
router.get("/:id", getItem);

// Protected routes (Admin only)
router.use(protect);
router.post("/", authorize("admin"), upload.single("image"), createItem);
router.put("/:id", authorize("admin"), upload.single("image"), updateItem);
router.delete("/:id", authorize("admin"), deleteItem);

module.exports = router;
