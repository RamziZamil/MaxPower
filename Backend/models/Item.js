const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  size: {
    type: String,
  },
  thickness: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  materialType: {
    type: String,
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
    default: "Max Power",
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
    default: "default.jpg",
  },
  images: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Item", itemSchema);
