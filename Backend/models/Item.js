const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  size: {
    type: String,
    required: [true, "Please provide a size"],
  },
  thickness: {
    type: Number,
    required: [true, "Please provide a thickness"],
  },
  weight: {
    type: Number,
    required: [true, "Please provide a weight"],
  },
  materialType: {
    type: String,
    required: [true, "Please provide a material type"],
  },
  pricePerUnit: {
    type: Number,
    required: [true, "Please provide a price per unit"],
  },
  stockQuantity: {
    type: Number,
    required: [true, "Please provide a stock quantity"],
  },
  description: {
    type: String,
    trim: true,
  },
  supplier: {
    type: String,
    default: "Freedom Road",
  },
  category: {
    type: String,
    required: [true, "Please provide a category"],
  },
  availability: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    default: 'default.jpg'
  }
});

module.exports = mongoose.model("Item", itemSchema);
