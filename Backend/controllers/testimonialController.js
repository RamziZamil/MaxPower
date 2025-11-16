const Testimonial = require("../models/Testimonial");
const User = require("../models/User");

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    // Add user id to request body
    req.body.user = req.user.id;

    // Check if user already has a testimonial
    const existingTestimonial = await Testimonial.findOne({
      user: req.user.id,
    });
    if (existingTestimonial) {
      return res.status(400).json({
        success: false,
        message: "User already has a testimonial",
      });
    }

    const testimonial = await Testimonial.create(req.body);

    // Populate user data
    await testimonial.populate("user", "name image");

    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate("user", "name image")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    let testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Make sure user owns testimonial
    if (testimonial.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this testimonial",
      });
    }

    testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("user", "name image");

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Make sure user owns testimonial
    if (testimonial.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this testimonial",
      });
    }

    await testimonial.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
