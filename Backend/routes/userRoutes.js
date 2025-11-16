const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

// Protect all routes
router.use(protect);

// Routes
router.get("/profile", getProfile);
router.get("/", authorize("admin"), getAllUsers);
router.get("/:id", getUser);
router.put("/:id", upload.single("image"), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);
router.put("/profile", upload.single("image"), updateProfile);

module.exports = router;
