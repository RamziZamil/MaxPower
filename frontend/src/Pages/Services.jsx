import React, { useEffect } from "react";
import { motion } from "framer-motion";

import gypsumDesingService from "../assets/gypsumDesingService.jpg";
import gypsumboardInstallation from "../assets/gypsumboardInstallation.jpg";
import gypsumInstall from "../assets/gypsumInstall.jpg";

function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animations variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-blue-500 to-purple-600 py-20 px-4 sm:px-6 lg:px-8 text-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-center"
          >
            Transform Your Space With Exceptional Gypsum Design
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-center max-w-3xl mx-auto"
          >
            We bring your vision to life with premium materials and expert
            craftsmanship.
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-12 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <motion.div
              variants={cardVariant}
              className="p-6 rounded-lg bg-blue-50"
            >
              <h3 className="text-blue-600 text-3xl font-bold">10+</h3>
              <p className="text-gray-600">Years Experience</p>
            </motion.div>
            <motion.div
              variants={cardVariant}
              className="p-6 rounded-lg bg-blue-50"
            >
              <h3 className="text-blue-600 text-3xl font-bold">5</h3>
              <p className="text-gray-600">Facilities Nationwide</p>
            </motion.div>
            <motion.div
              variants={cardVariant}
              className="p-6 rounded-lg bg-blue-50"
            >
              <h3 className="text-blue-600 text-3xl font-bold">50+</h3>
              <p className="text-gray-600">Expert Team Members</p>
            </motion.div>
            <motion.div
              variants={cardVariant}
              className="p-6 rounded-lg bg-blue-50"
            >
              <h3 className="text-blue-600 text-3xl font-bold">200+</h3>
              <p className="text-gray-600">Projects Completed</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Services Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-600"
          >
            Our Gypsum Board Services
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Installation Service Card */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="h-56 bg-blue-100 relative overflow-hidden">
                <img
                  src={gypsumInstall}
                  alt="Gypsum Board Installation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 text-blue-700">
                  Installation Services
                </h3>
                <p className="text-gray-600">
                  Professional installation of gypsum boards for walls and
                  ceilings with meticulous attention to detail. Our expert team
                  ensures perfect finish and durability for every project.
                </p>
              </div>
            </motion.div>

            {/* Repair Service Card */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="h-56 bg-purple-100 relative overflow-hidden">
                <img
                  src={gypsumboardInstallation}
                  alt="Gypsum Board Repair"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 text-purple-700">
                  Repair & Maintenance
                </h3>
                <p className="text-gray-600">
                  Expert repair services for damaged gypsum boards, including
                  crack fixing, panel replacement, and structural reinforcement
                  to ensure longevity.
                </p>
              </div>
            </motion.div>

            {/* Custom Design Card */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="h-56 bg-indigo-100 relative overflow-hidden">
                <img
                  src={gypsumDesingService}
                  alt="Custom Designs"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 text-indigo-700">
                  Custom Designs
                </h3>
                <p className="text-gray-600">
                  Creative gypsum board designs for false ceilings, partitions,
                  and decorative elements that transform ordinary spaces into
                  stunning environments.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Process Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-600"
          >
            Our Process
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div variants={cardVariant} className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Consultation</h3>
              <p className="text-gray-600">
                We discuss your vision and requirements
              </p>
            </motion.div>

            <motion.div variants={cardVariant} className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Design</h3>
              <p className="text-gray-600">
                Our experts create a detailed plan
              </p>
            </motion.div>

            <motion.div variants={cardVariant} className="text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Installation</h3>
              <p className="text-gray-600">
                Professional execution with premium materials
              </p>
            </motion.div>

            <motion.div variants={cardVariant} className="text-center">
              <div className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Final Review</h3>
              <p className="text-gray-600">
                Quality check and client satisfaction confirmation
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-600"
          >
            Why Choose Our Gypsum Board Services?
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={cardVariant}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500"
            >
              <h3 className="text-xl font-semibold mb-3 text-blue-700">
                Quality Materials
              </h3>
              <p className="text-gray-600">
                We use only high-grade gypsum boards from trusted manufacturers
                to ensure durability and premium finish.
              </p>
            </motion.div>

            <motion.div
              variants={cardVariant}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500"
            >
              <h3 className="text-xl font-semibold mb-3 text-purple-700">
                Expert Team
              </h3>
              <p className="text-gray-600">
                Our skilled professionals have years of experience in gypsum
                board installation and design implementation.
              </p>
            </motion.div>

            <motion.div
              variants={cardVariant}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500"
            >
              <h3 className="text-xl font-semibold mb-3 text-indigo-700">
                Timely Completion
              </h3>
              <p className="text-gray-600">
                We ensure projects are completed within the agreed timeframe
                without compromising on quality.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8">
            Contact us today for a free consultation and quote on your gypsum
            board project.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg"
          >
            Get In Touch
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Services;
