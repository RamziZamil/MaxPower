import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";

import aboutGypsum from "../assets/aboutGypsum.jpg";
import developerAbout from "../assets/developerAbout.jpg";
import headProductAbout from "../assets/headProductAbout.jpg";
import gypsumboardInstallation from "../assets/gypsumboardInstallation.jpg";
import gypsumDesignAbout from "../assets/gypsumDesignAbout.jpg";
import gypsumProductsAbout from "../assets/gypsumProductsAbout.jpg";
import ceoAbout from "../assets/ceoAbout.png";
import SaeedFwaz from "../assets/SaeedFwaz.jpeg";

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
  return (
    <div className="min-h-screen bg-white text-gray-800 py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            About FreedomRoad
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            We transform interior spaces with premium designs and exceptional
            craftsmanship.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-16 items-center mb-32"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              At FreedomRoad, we're dedicated to revolutionizing interior spaces
              with high-quality premium materials and innovative designs. Our
              mission is to provide designers, decorators, and homeowners with
              beautiful, durable, and thoughtfully curated products tailored to
              their unique needs.
            </p>
            <p className="text-lg text-gray-700">
              We prioritize sustainable sourcing, exceptional craftsmanship, and
              customer satisfaction in every product we offer and every project
              we undertake.
            </p>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={aboutGypsum}
              alt="Modern interior design"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-3 text-purple-600">
                  Vision 2025
                </h3>
                <p className="text-lg text-gray-800">
                  Transforming 1000+ spaces with premium design solutions
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section with Counting Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32"
        >
          <motion.div
            className="bg-gray-50 rounded-xl p-6 text-center shadow-md"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-4xl font-bold mb-2 text-blue-600">
              <Counter end={10} />+
            </div>
            <div className="text-sm text-gray-600">Years Experience</div>
          </motion.div>
          <motion.div
            className="bg-gray-50 rounded-xl p-6 text-center shadow-md"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-4xl font-bold mb-2 text-blue-600">
              <Counter end={5} />
            </div>
            <div className="text-sm text-gray-600">Facilities Nationwide</div>
          </motion.div>
          <motion.div
            className="bg-gray-50 rounded-xl p-6 text-center shadow-md"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-4xl font-bold mb-2 text-blue-600">
              <Counter end={50} />+
            </div>
            <div className="text-sm text-gray-600">Expert Team Members</div>
          </motion.div>
          <motion.div
            className="bg-gray-50 rounded-xl p-6 text-center shadow-md"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-4xl font-bold mb-2 text-blue-600">
              <Counter end={200} />+
            </div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </motion.div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-600">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Ahmad Hammoudeh",
                role: "Founder & CEO",
                bio: "5+ years in interior design and business innovation.",
                image: ceoAbout,
              },
              {
                name: "Saaed Fawaz ",
                role: "Head of Product",
                bio: "Expert in premium material curation and quality assurance.",
                image: SaeedFwaz,
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
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="mb-4 rounded-full overflow-hidden w-32 h-32 mx-auto border-2 border-purple-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center text-gray-800">
                  {member.name}
                </h3>
                <p className="text-purple-600 mb-3 text-center">
                  {member.role}
                </p>
                <p className="text-gray-600 text-center">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-600">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Quality",
                description:
                  "We curate only the finest materials and products that meet the highest standards of craftsmanship and durability.",
              },
              {
                title: "Innovation",
                description:
                  "We continuously seek new design trends and innovative solutions to elevate interior spaces.",
              },
              {
                title: "Sustainability",
                description:
                  "We prioritize eco-friendly materials and ethical sourcing practices to minimize our environmental impact.",
              },
              {
                title: "Customer Focus",
                description:
                  "We work closely with clients to understand their vision and deliver experiences that exceed expectations.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl shadow-md border-l-4 border-purple-500"
              >
                <h3 className="text-2xl font-bold mb-4 text-blue-600">
                  {value.title}
                </h3>
                <p className="text-gray-700 text-lg">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-600">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Design Consultation",
                description:
                  "Expert guidance to transform your interior spaces",
                image: gypsumDesignAbout,
              },
              {
                title: "Premium Products",
                description:
                  "Carefully curated selection of high-quality materials",
                image: gypsumProductsAbout,
              },
              {
                title: "Installation",
                description: "Professional setup and placement services",
                image: gypsumboardInstallation,
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-600">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Want to enhance your space with our premium products and design
            services? Contact us today!
          </p>
          <div className="flex justify-center gap-6 mb-12">
            <a
              href="#"
              className="text-3xl text-blue-500 hover:text-purple-600 transition-colors duration-300"
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              className="text-3xl text-blue-500 hover:text-purple-600 transition-colors duration-300"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-3xl text-blue-500 hover:text-purple-600 transition-colors duration-300"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-3xl text-blue-500 hover:text-purple-600 transition-colors duration-300"
            >
              <FaEnvelope />
            </a>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-full text-lg font-bold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
