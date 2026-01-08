import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
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
        API_ENDPOINTS.CONTACT_MESSAGES,
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <ToastContainer position="top-center" autoClose={3000} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white py-20 px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-[#f46c00]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#f46c00]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[#f46c00]/20 backdrop-blur-md border border-[#f46c00]/30 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-1.5 h-1.5 bg-[#f46c00] rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-gray-200">
                Get In Touch
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="block text-gray-200">Contact</span>
              <span className="block bg-gradient-to-r from-[#f46c00] via-[#ff8c42] to-[#ffa366] bg-clip-text text-transparent">
                MaxPower
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Contact Info Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center group"
            whileHover={{ y: -5 }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Phone className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Phone</h3>
            <p className="text-[#b5b3b3]">+962 790816631</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center group"
            whileHover={{ y: -5 }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-[#b5b3b3]">info@maxpower.com</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center group"
            whileHover={{ y: -5 }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Address</h3>
            <p className="text-[#b5b3b3]">Amman, Jordan</p>
          </motion.div>
        </motion.div>

        {/* Form Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Form */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Send us a <span className="text-[#f46c00]">Message</span>
            </h2>
            <p className="text-[#b5b3b3] mb-8">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all"
                    placeholder="Your phone"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all"
                  placeholder="What is this regarding?"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all resize-none"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-[#f46c00] hover:bg-[#d85f00] text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-5 h-5" />
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Right Side - Info & Social */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Info Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-white">
                Why Contact Us?
              </h3>
              <ul className="space-y-4">
                {[
                  "Get expert advice on the right cables for your devices",
                  "Learn about our latest products and promotions",
                  "Request custom solutions for your business",
                  "Get support for your existing products",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#f46c00] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Follow Us
              </h3>
              <p className="text-[#b5b3b3] mb-6">
                Stay connected with us on social media for updates and news.
              </p>
              <div className="flex gap-4">
                <motion.a
                  href="#"
                  className="w-12 h-12 rounded-lg bg-gray-100 hover:bg-[#f46c00] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Facebook className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-12 h-12 rounded-lg bg-gray-100 hover:bg-[#f46c00] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Twitter className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-12 h-12 rounded-lg bg-gray-100 hover:bg-[#f46c00] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram className="w-6 h-6" />
                </motion.a>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-gradient-to-br from-[#f46c00]/10 to-gray-50 rounded-2xl p-8 border border-[#f46c00]/20">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Quick Contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#f46c00]" />
                  <span className="text-[#b5b3b3]">+962 790816631</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#f46c00]" />
                  <span className="text-[#b5b3b3]">info@maxpower.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#f46c00]" />
                  <span className="text-[#b5b3b3]">Amman, Jordan</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked <span className="text-[#f46c00]">Questions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "What are your business hours?",
                answer:
                  "We are open Monday through Friday from 9am to 5pm, and Saturday from 10am to 3pm. We are closed on Sundays and major holidays.",
              },
              {
                question: "How quickly will I receive a response?",
                answer:
                  "We strive to respond to all inquiries within 24 hours during business days. For urgent matters, please contact us by phone.",
              },
              {
                question: "Do you offer consultations?",
                answer:
                  "Yes, we offer free initial consultations to discuss your project needs and how we can help you achieve your vision.",
              },
              {
                question: "What areas do you serve?",
                answer:
                  "We currently serve all major cities across the country with our strategically located facilities.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -3 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-[#b5b3b3] leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;
