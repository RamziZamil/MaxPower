const User = require("../models/User");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: "./uploads/profiles/",
  filename: function (req, file, cb) {
    cb(null, "profile-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profilePicture");

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const query = User.find().select("-password").sort({ createdAt: -1 });

    if (limit > 0) {
      query.limit(limit);
    }

    const users = await query;

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get single user (Admin or Same User)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is admin or the same user
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this user data",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update user (Admin or Same User)
exports.updateUser = async (req, res) => {
  try {
    // First check if the user exists
    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is authorized to update
    // Only admin or the same user can update the profile
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    // If user is not admin, they can't update role
    if (req.body.role && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to change role",
      });
    }

    // If updating password, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Handle image upload
    if (req.file) {
      req.body.image = req.file.path;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
        select: "-password",
      }
    );

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get user profile (Current logged in user)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update user profile

exports.updateProfile = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    // Get the authenticated user from the request (set by the protect middleware)
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found for ID:", req.user.id);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update fields if they are provided in the request
    if (req.body.name) user.name = req.body.name;
    if (req.body.address) user.address = req.body.address;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
    if (req.file) {
      console.log("Updating image with path:", req.file.path);
      user.image = req.file.path; // Set the image URL from Cloudinary
    } else {
      console.log("No image uploaded");
    }

    // Validate the updated user data
    try {
      await user.validate();
    } catch (validationError) {
      console.log("Validation error:", validationError);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: validationError.message,
      });
    }

    // Save the updated user
    await user.save();

    // Remove password from the response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Add other controller methods as needed
