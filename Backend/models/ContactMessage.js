const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["new", "read", "replied"],
    default: "new",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
