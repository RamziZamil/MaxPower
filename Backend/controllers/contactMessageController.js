const ContactMessage = require("../models/ContactMessage");

// Create a new contact message
exports.createMessage = async (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;
    const newMessage = new ContactMessage({
      name,
      phone,
      subject,
      message,
    });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get all contact messages (excluding deleted ones)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({ deleted: false }).sort({
      createdAt: -1,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Update message status
exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to update message status" });
  }
};

// Soft delete a message
exports.softDeleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};
