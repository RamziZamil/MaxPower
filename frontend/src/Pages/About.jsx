import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaBolt,
  FaShieldAlt,
  FaAward,
  FaUsers,
  FaRocket,
  FaHeart,
  FaCode,
  FaLaptopCode,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import aboutGypsum from "../assets/UgreenHomeImg.webp";
import developerAbout from "../assets/developerAbout.jpg";
import laithCeo from "../assets/laithCeo.jpeg";
import maxPowerLogo from "../assets/logoMaxPower.png";

// Counter component to handle the counting animation
const Counter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 60); // 60 FPS
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}</span>;
};

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section - New Design */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(to right, #f46c00 1px, transparent 1px),
                             linear-gradient(to bottom, #f46c00 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>

          {/* Animated Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-[#f46c00]/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-80 h-80 bg-[#b5b3b3]/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, -40, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-[#f46c00]/10 border border-[#f46c00]/20 rounded-full px-4 py-1.5 mb-6"
              >
                <span className="w-2 h-2 bg-[#f46c00] rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-[#f46c00]">
                  About MaxPower
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="block text-gray-900">Powering Your</span>
                <span className="block bg-gradient-to-r from-[#f46c00] via-[#ff8c42] to-[#ffa366] bg-clip-text text-transparent">
                  Digital World
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#b5b3b3] mb-8 leading-relaxed">
                Your trusted source for premium cables, chargers, and power
                solutions. Quality products that keep your devices connected and
                charged, every single day.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  "Premium Quality",
                  "Fast Charging",
                  "Wide Selection",
                  "24/7 Support",
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-[#f46c00] hover:text-white transition-colors cursor-default"
                    whileHover={{ scale: 1.05 }}
                  >
                    {feature}
                  </motion.div>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                onClick={() => navigate("/products")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-[#f46c00] hover:bg-[#d85f00] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-colors"
              >
                Explore Our Products
                <FaRocket className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Right Side - Visual Element */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-8 flex items-center justify-center">
                <img
                  src={maxPowerLogo}
                  alt="MaxPower Logo"
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              </div>

              {/* Floating Stats Cards */}
              <motion.div
                className="absolute -top-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl border border-gray-100"
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center">
                    <FaUsers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#f46c00]">
                      <Counter end={10000} />+
                    </div>
                    <div className="text-xs text-[#b5b3b3] font-medium">
                      Happy Customers
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl border border-gray-100"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center">
                    <FaBolt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#f46c00]">
                      <Counter end={500} />+
                    </div>
                    <div className="text-xs text-[#b5b3b3] font-medium">
                      Products Available
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section - New Design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#f46c00]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#b5b3b3]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#f46c00]/10 border border-[#f46c00]/20 rounded-full px-4 py-1.5 mb-4">
              <FaRocket className="w-4 h-4 text-[#f46c00]" />
              <span className="text-xs font-semibold text-[#f46c00]">
                Our Mission
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Empowering Your <span className="text-[#f46c00]">Devices</span>
            </h2>
            <p className="text-lg text-[#b5b3b3] max-w-2xl mx-auto">
              Delivering reliable, durable, and innovative power solutions for
              all your digital needs
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Mission Card 1 */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center mb-6">
                <FaBolt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Quality First
              </h3>
              <p className="text-[#b5b3b3] leading-relaxed">
                We're dedicated to providing high-quality charging cables, USB-C
                cables, Lightning cables, and wireless chargers that keep your
                devices powered and connected.
              </p>
            </motion.div>

            {/* Mission Card 2 */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center mb-6">
                <FaShieldAlt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Reliable Solutions
              </h3>
              <p className="text-[#b5b3b3] leading-relaxed">
                Our mission is to deliver reliable, durable, and innovative
                power solutions for all your digital needs, from smartphones to
                laptops.
              </p>
            </motion.div>

            {/* Mission Card 3 */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center mb-6">
                <FaHeart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Customer Focus
              </h3>
              <p className="text-[#b5b3b3] leading-relaxed">
                We prioritize quality manufacturing, fast charging technology,
                and customer satisfaction in every product we offer.
              </p>
            </motion.div>
          </div>

          {/* Image Section with Vision */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={aboutGypsum}
              alt="Premium cables and chargers"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-[#f46c00]/20 backdrop-blur-md border border-[#f46c00]/30 rounded-full px-4 py-1.5 mb-4">
                  <span className="w-1.5 h-1.5 bg-[#f46c00] rounded-full animate-pulse"></span>
                  <span className="text-xs font-medium text-white">
                    Vision 2025
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Powering 100,000+ Devices
                </h3>
                <p className="text-lg text-gray-200 leading-relaxed">
                  With premium charging solutions that keep your devices
                  connected and charged, every single day. Join thousands of
                  satisfied customers who trust MaxPower.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Meet Our <span className="text-[#f46c00]">Team</span>
              </h2>
              <p className="text-lg text-[#b5b3b3] max-w-2xl mx-auto">
                The passionate people behind MaxPower, dedicated to bringing you
                the best charging solutions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  name: "Laith AbuHani",
                  role: "Founder & CEO",
                  bio: "2+ years in technology and business innovation.",
                  image: laithCeo,
                },
                {
                  name: "Ramzi Ahmad Zamil",
                  role: "Developer",
                  bio: "Specialist in Full Stack development.",
                  image: developerAbout,
                },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                  whileHover={{ y: -5 }}
                >
                  <div className="mb-4 rounded-full overflow-hidden w-32 h-32 mx-auto border-4 border-[#f46c00]/20 group-hover:border-[#f46c00] transition-colors">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-[#f46c00] mb-3 text-center font-semibold">
                    {member.role}
                  </p>
                  <p className="text-[#b5b3b3] text-center">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section - Modern Design */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                Our <span className="text-[#f46c00]">Values</span>
              </h2>
              <p className="text-[#b5b3b3]">
                The principles that guide everything we do
              </p>
            </div>

            {/* Values Grid - Modern Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: FaShieldAlt,
                  title: "Quality",
                  description:
                    "We source only the finest cables and chargers that meet the highest standards of durability and performance. Every product is tested for reliability.",
                  color: "from-[#f46c00] to-[#ff8c42]",
                },
                {
                  icon: FaBolt,
                  title: "Innovation",
                  description:
                    "We stay ahead of technology trends, offering the latest fast-charging solutions and cutting-edge power delivery technologies.",
                  color: "from-[#b5b3b3] to-[#9a9898]",
                },
                {
                  icon: FaHeart,
                  title: "Sustainability",
                  description:
                    "We prioritize eco-friendly manufacturing and packaging practices to minimize our environmental impact while delivering quality products.",
                  color: "from-[#f46c00] to-[#ff8c42]",
                },
                {
                  icon: FaUsers,
                  title: "Customer Focus",
                  description:
                    "We work closely with our customers to understand their needs and deliver charging solutions that exceed expectations.",
                  color: "from-[#b5b3b3] to-[#9a9898]",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#f46c00] transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">
                        {value.title}
                      </h3>
                      <p className="text-[#b5b3b3] text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section - New Design */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                What We <span className="text-[#f46c00]">Offer</span>
              </h2>
              <p className="text-[#b5b3b3] max-w-2xl mx-auto">
                Comprehensive solutions for your devices and digital needs
              </p>
            </div>

            {/* Services Grid - Icon-Based Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: FaBolt,
                  title: "USB-C Cables",
                  description:
                    "High-speed USB-C cables for fast charging and data transfer",
                  color: "from-[#f46c00] to-[#ff8c42]",
                },
                {
                  icon: FaRocket,
                  title: "Lightning Cables",
                  description:
                    "Apple-certified Lightning cables for iPhone and iPad",
                  color: "from-[#b5b3b3] to-[#9a9898]",
                },
                {
                  icon: FaShieldAlt,
                  title: "Wireless Chargers",
                  description:
                    "Qi-compatible wireless charging pads and stands",
                  color: "from-[#f46c00] to-[#ff8c42]",
                },
                {
                  icon: FaLaptopCode,
                  title: "Website Development",
                  description:
                    "Professional web development services for businesses and individuals",
                  color: "from-[#b5b3b3] to-[#9a9898]",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group text-center"
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#b5b3b3] leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get In <span className="text-[#f46c00]">Touch</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Have questions about our products? Want to learn more about our
              charging solutions? Contact us today!
            </p>
            <div className="flex justify-center gap-6 mb-10">
              <motion.a
                href="#"
                className="text-3xl text-gray-300 hover:text-[#f46c00] transition-colors duration-300"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                href="#"
                className="text-3xl text-gray-300 hover:text-[#f46c00] transition-colors duration-300"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter />
              </motion.a>
              <motion.a
                href="#"
                className="text-3xl text-gray-300 hover:text-[#f46c00] transition-colors duration-300"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram />
              </motion.a>
              <motion.a
                href="#"
                className="text-3xl text-gray-300 hover:text-[#f46c00] transition-colors duration-300"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaEnvelope />
              </motion.a>
            </div>
            <motion.button
              onClick={() => navigate("/contact")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#f46c00] hover:bg-[#d85f00] text-white py-4 px-10 rounded-xl text-lg font-bold shadow-lg transition-colors"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
