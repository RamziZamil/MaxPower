const express = require("express");
const router = express.Router();
const contactMessageController = require("../controllers/contactMessageController");
const { isAdmin, protect } = require("../middleware/auth");

// Public route for creating messages
router.post("/", contactMessageController.createMessage);

// Admin routes
router.get("/", protect, isAdmin, contactMessageController.getAllMessages);
router.put(
  "/:id/status",
  protect,
  isAdmin,
  contactMessageController.updateMessageStatus
);
router.delete(
  "/:id",
  protect,
  isAdmin,
  contactMessageController.softDeleteMessage
);

module.exports = router;
