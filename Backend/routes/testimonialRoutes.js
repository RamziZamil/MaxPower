const express = require("express");
const router = express.Router();
const {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const { protect } = require("../middleware/auth");

// Public route to get all testimonials
router.get("/", getAllTestimonials);

// Protected routes - need to be logged in
router.post("/", protect, createTestimonial);
router.put("/:id", protect, updateTestimonial);
router.delete("/:id", protect, deleteTestimonial);

module.exports = router;
