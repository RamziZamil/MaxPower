import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBolt,
  FaShieldAlt,
  FaAward,
  FaUsers,
  FaRocket,
  FaTools,
  FaPaintBrush,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import gypsumDesingService from "../assets/UgreenHomeImg.webp";
import gypsumboardInstallation from "../assets/UgreenHomeImgLightining.webp";
import gypsumInstall from "../assets/UgreenAdapterHome.webp";

function Services() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section - Split Layout */}
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
                  Professional Services
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="block text-gray-900">Transform Your</span>
                <span className="block bg-gradient-to-r from-[#f46c00] via-[#ff8c42] to-[#ffa366] bg-clip-text text-transparent">
                  Space Today
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#b5b3b3] mb-8 leading-relaxed">
                Expert gypsum board services with premium quality and professional
                craftsmanship. We bring your vision to life with precision and
                excellence.
              </p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                onClick={() => navigate("/contact")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-[#f46c00] hover:bg-[#d85f00] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-colors"
              >
                Get Started
                <FaArrowRight className="w-5 h-5" />
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
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={gypsumDesingService}
                  alt="Professional services"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="py-8 bg-[#f46c00] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "10+", label: "Years Experience" },
              { number: "200+", label: "Projects Done" },
              { number: "50+", label: "Expert Team" },
              { number: "5", label: "Locations" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-white/90">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid - Modern Card Layout */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our <span className="text-[#f46c00]">Services</span>
            </h2>
            <p className="text-lg text-[#b5b3b3] max-w-2xl mx-auto">
              Comprehensive gypsum board solutions for every need
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 - Installation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={gypsumInstall}
                  alt="Installation"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f46c00]/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <FaTools className="w-6 h-6 text-[#f46c00]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Installation</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#b5b3b3] leading-relaxed mb-4">
                  Professional installation of gypsum boards for walls and
                  ceilings with meticulous attention to detail.
                </p>
                <button
                  onClick={() => navigate("/contact")}
                  className="flex items-center gap-2 text-[#f46c00] font-semibold hover:gap-3 transition-all"
                >
                  Learn More
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Service 2 - Repair */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={gypsumboardInstallation}
                  alt="Repair"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#b5b3b3]/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <FaShieldAlt className="w-6 h-6 text-[#b5b3b3]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Repair & Maintenance
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#b5b3b3] leading-relaxed mb-4">
                  Expert repair services for damaged gypsum boards, including
                  crack fixing and panel replacement.
                </p>
                <button
                  onClick={() => navigate("/contact")}
                  className="flex items-center gap-2 text-[#b5b3b3] font-semibold hover:gap-3 transition-all"
                >
                  Learn More
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Service 3 - Custom Design */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={gypsumDesingService}
                  alt="Custom Design"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f46c00]/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <FaPaintBrush className="w-6 h-6 text-[#f46c00]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Custom Design</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#b5b3b3] leading-relaxed mb-4">
                  Creative gypsum board designs for false ceilings, partitions,
                  and decorative elements.
                </p>
                <button
                  onClick={() => navigate("/contact")}
                  className="flex items-center gap-2 text-[#f46c00] font-semibold hover:gap-3 transition-all"
                >
                  Learn More
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our <span className="text-[#f46c00]">Process</span>
            </h2>
            <p className="text-lg text-[#b5b3b3]">
              Simple steps to transform your space
            </p>
          </motion.div>

          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#f46c00] via-[#ff8c42] to-[#b5b3b3]"></div>

            <div className="space-y-16 md:space-y-20">
              {[
                {
                  step: "01",
                  title: "Consultation",
                  description: "We discuss your vision and requirements in detail",
                  icon: FaUsers,
                  color: "from-[#f46c00] to-[#ff8c42]",
                },
                {
                  step: "02",
                  title: "Design",
                  description: "Our experts create a detailed plan tailored to you",
                  icon: FaPaintBrush,
                  color: "from-[#b5b3b3] to-[#9a9898]",
                },
                {
                  step: "03",
                  title: "Installation",
                  description: "Professional execution with premium materials",
                  icon: FaTools,
                  color: "from-[#f46c00] to-[#ff8c42]",
                },
                {
                  step: "04",
                  title: "Final Review",
                  description: "Quality check and client satisfaction confirmation",
                  icon: FaCheckCircle,
                  color: "from-[#b5b3b3] to-[#9a9898]",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative flex items-start gap-6 md:gap-8"
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-xl border-4 border-white`}
                    >
                      <item.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl md:text-5xl font-bold text-gray-200">
                        {item.step}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[#b5b3b3] text-base md:text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Feature Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose <span className="text-[#f46c00]">Us</span>
            </h2>
            <p className="text-lg text-[#b5b3b3]">
              What makes us the best choice for your project
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaShieldAlt,
                title: "Quality Materials",
                description:
                  "We use only high-grade gypsum boards from trusted manufacturers",
                color: "from-[#f46c00] to-[#ff8c42]",
              },
              {
                icon: FaUsers,
                title: "Expert Team",
                description:
                  "Our skilled professionals have years of experience in the field",
                color: "from-[#b5b3b3] to-[#9a9898]",
              },
              {
                icon: FaCheckCircle,
                title: "Timely Completion",
                description:
                  "Projects completed on time without compromising quality",
                color: "from-[#f46c00] to-[#ff8c42]",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-[#b5b3b3] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#f46c00] to-[#ff8c42] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us today for a free consultation and quote on your gypsum
              board project.
            </p>
            <motion.button
              onClick={() => navigate("/contact")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#f46c00] font-bold py-4 px-10 rounded-xl text-lg shadow-2xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              Contact Us Now
              <FaArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Services;
