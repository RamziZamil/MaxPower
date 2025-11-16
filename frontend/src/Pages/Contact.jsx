import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact-messages",
        formData
      );
      toast.success("Your message has been sent! We'll get back to you soon.");
      setFormData({
        name: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -10,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  };

  const formItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Header Banner */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-4xl font-bold text-white mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-xl text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            We'd love to hear from you
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Contact Info Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white rounded-lg shadow-md p-6 text-center"
            variants={itemVariants}
            whileHover={cardHoverVariants.hover}
          >
            <div className="flex items-center justify-center h-14 w-14 bg-blue-100 rounded-full mb-4 mx-auto">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600">+962 796981362</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-6 text-center"
            variants={itemVariants}
            whileHover={cardHoverVariants.hover}
          >
            <div className="flex items-center justify-center h-14 w-14 bg-blue-100 rounded-full mb-4 mx-auto">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">info@freedomroad.com</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-6 text-center"
            variants={itemVariants}
            whileHover={cardHoverVariants.hover}
          >
            <div className="flex items-center justify-center h-14 w-14 bg-blue-100 rounded-full mb-4 mx-auto">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600">Amman, Jordan</p>
          </motion.div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          className="bg-white rounded-lg shadow-lg overflow-hidden mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left Side */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
              <motion.h2
                className="text-2xl font-bold mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Get in Touch
              </motion.h2>
              <motion.p
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Have questions about our products or services? Fill out the form
                and our team will get back to you as soon as possible.
              </motion.p>

              <motion.div
                className="space-y-4 mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.7 }}
              >
                <motion.div
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <Phone className="mt-1 mr-3" size={18} />
                  <div>
                    <h3 className="font-medium">Call Us</h3>
                    <p className="text-blue-100">+962 796981362</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <Mail className="mt-1 mr-3" size={18} />
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-blue-100">info@freedomroad.com</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <MapPin className="mt-1 mr-3" size={18} />
                  <div>
                    <h3 className="font-medium">Visit Us</h3>
                    <p className="text-blue-100">Amman, Jordan</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <h3 className="font-medium mb-3">Follow Us</h3>
                <div className="flex space-x-4">
                  <motion.a
                    href="#"
                    className="text-white hover:text-blue-200 transition"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Facebook size={20} />
                  </motion.a>
                  <motion.a
                    href="#"
                    className="text-white hover:text-blue-200 transition"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Twitter size={20} />
                  </motion.a>
                  <motion.a
                    href="#"
                    className="text-white hover:text-blue-200 transition"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Instagram size={20} />
                  </motion.a>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3 p-8">
              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Send us a Message
              </motion.h2>

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={formItemVariants}>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </motion.div>

                  <motion.div className="mb-4" variants={formItemVariants}>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                      required
                    />
                  </motion.div>
                </div>

                <motion.div variants={formItemVariants}>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What is this regarding?"
                    required
                  />
                </motion.div>

                <motion.div variants={formItemVariants}>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your message here..."
                    required
                  />
                </motion.div>

                <motion.div variants={formItemVariants}>
                  <motion.button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md transition flex items-center justify-center space-x-2 cursor-pointer"
                    whileHover={buttonVariants.hover}
                    whileTap={buttonVariants.tap}
                  >
                    <Send size={16} />
                    <span>Send Message</span>
                  </motion.button>
                </motion.div>
              </motion.form>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section - Updated with animations */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl font-bold text-center text-blue-600 mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1 }}
          >
            {/* FAQ Card 1 */}
            <motion.div
              className="flex bg-white rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
              whileHover={cardHoverVariants.hover}
            >
              <div className="w-2 bg-purple-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  What are your business hours?
                </h3>
                <p className="text-gray-700">
                  We are open Monday through Friday from 9am to 5pm, and
                  Saturday from 10am to 3pm. We are closed on Sundays and major
                  holidays.
                </p>
              </div>
            </motion.div>

            {/* FAQ Card 2 */}
            <motion.div
              className="flex bg-white rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
              whileHover={cardHoverVariants.hover}
            >
              <div className="w-2 bg-purple-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  How quickly will I receive a response?
                </h3>
                <p className="text-gray-700">
                  We strive to respond to all inquiries within 24 hours during
                  business days. For urgent matters, please contact us by phone.
                </p>
              </div>
            </motion.div>

            {/* FAQ Card 3 */}
            <motion.div
              className="flex bg-white rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
              whileHover={cardHoverVariants.hover}
            >
              <div className="w-2 bg-purple-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  Do you offer consultations?
                </h3>
                <p className="text-gray-700">
                  Yes, we offer free initial consultations to discuss your
                  project needs and how we can help you achieve your vision.
                </p>
              </div>
            </motion.div>

            {/* FAQ Card 4 */}
            <motion.div
              className="flex bg-white rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
              whileHover={cardHoverVariants.hover}
            >
              <div className="w-2 bg-purple-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  What areas do you serve?
                </h3>
                <p className="text-gray-700">
                  We currently serve all major cities across the country with
                  our 5 strategically located facilities.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;
