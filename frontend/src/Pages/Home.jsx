import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Bolt,
  Building,
  Users,
  Award,
  ArrowRight,
  Github,
  Linkedin,
} from "lucide-react";
// Using placeholder images - you can replace these with actual cable/charger images
const heroImageUrl =
  "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1920&auto=format&fit=crop";
const usbCableImage =
  "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop";
// Wireless charger image - Qi charging pad
const wirelessChargerImage =
  "https://images.unsplash.com/photo-1609091839311-d5365f5f07d0?w=800&auto=format&fit=crop&q=80";
// Power adapter image - wall charger with multiple ports
const powerAdapterImage =
  "https://images.unsplash.com/photo-1609091839311-d5365f5f07d0?w=800&auto=format&fit=crop&q=80";

function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [heroCounts, setHeroCounts] = useState({
    years: 0,
    projects: 0,
    team: 0,
    clients: 0,
  });

  useEffect(() => {
    if (!loading && user && user.role === "admin") {
      navigate("/admin");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items", {
          withCredentials: true,
        });

        if (response.data && response.data.data) {
          const featured = response.data.data.slice(0, 4);
          console.log("Featured products:", featured);
          setFeaturedProducts(featured);
        } else {
          console.log("No data in response");
          setError("No data received from server");
        }
        setLoadingProducts(false);
      } catch (err) {
        console.error("Detailed error:", {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError(err.response?.data?.message || "Failed to load products");
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/testimonials",
          {
            withCredentials: true,
          }
        );

        if (response.data && response.data.data) {
          setTestimonials(response.data.data);
        } else {
          console.log("No testimonials data in response");
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };

    fetchTestimonials();
  }, []);

  // Handle testimonial navigation
  const nextTestimonial = () => {
    setActiveTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const statsItem = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.5,
      },
    },
  };

  // Stats counter
  const [counts, setCounts] = useState({
    years: 0,
    facilities: 0,
    team: 0,
    projects: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.getElementById("stats-section");
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && !statsVisible) {
          setStatsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [statsVisible]);

  useEffect(() => {
    if (statsVisible) {
      const duration = 2000; // 2 seconds for the animation
      const interval = 50; // Update every 50ms for smoother animation

      const targetValues = {
        years: 500,
        facilities: 50,
        team: 10000,
        projects: 50000,
      };

      const increments = {
        years: targetValues.years / (duration / interval),
        facilities: targetValues.facilities / (duration / interval),
        team: targetValues.team / (duration / interval),
        projects: targetValues.projects / (duration / interval),
      };

      const timer = setInterval(() => {
        setCounts((prevCounts) => {
          const newCounts = { ...prevCounts };
          let completed = true;

          Object.keys(targetValues).forEach((key) => {
            if (newCounts[key] < targetValues[key]) {
              newCounts[key] = Math.min(
                newCounts[key] + increments[key],
                targetValues[key]
              );
              completed = false;
            }
          });

          if (completed) {
            clearInterval(timer);
          }

          return newCounts;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [statsVisible]);

  // Hero stats counter animation
  useEffect(() => {
    const duration = 2000; // 2 seconds for the animation
    const interval = 50; // Update every 50ms for smoother animation

    const targetValues = {
      years: 500,
      projects: 50000,
      team: 10000,
      clients: 50,
    };

    const increments = {
      years: targetValues.years / (duration / interval),
      projects: targetValues.projects / (duration / interval),
      team: targetValues.team / (duration / interval),
      clients: targetValues.clients / (duration / interval),
    };

    let timer = null;

    // Start animation after a short delay to allow hero section to render
    const startDelay = setTimeout(() => {
      timer = setInterval(() => {
        setHeroCounts((prevCounts) => {
          const newCounts = { ...prevCounts };
          let completed = true;

          Object.keys(targetValues).forEach((key) => {
            if (newCounts[key] < targetValues[key]) {
              newCounts[key] = Math.min(
                newCounts[key] + increments[key],
                targetValues[key]
              );
              completed = false;
            }
          });

          if (completed && timer) {
            clearInterval(timer);
          }

          return newCounts;
        });
      }, interval);
    }, 1000); // Start after 1 second

    return () => {
      clearTimeout(startDelay);
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  return (
    <div className="font-sans text-[#706D54] bg-[#DBDBDB]">
      {/* Modern Hero Section */}
      <section className="relative h-[90vh] max-h-[750px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImageUrl}
            alt="Premium Cables and Chargers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-[#f46c00]/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(244,108,0,0.3),transparent_50%)]"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute top-10 left-10 w-48 h-48 bg-[#f46c00]/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-64 h-64 bg-[#b5b3b3]/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 py-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[#f46c00]/20 backdrop-blur-md border border-[#f46c00]/30 rounded-full px-4 py-1.5 mb-4"
            >
              <span className="w-1.5 h-1.5 bg-[#f46c00] rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-gray-200">
                Premium Cables & Chargers
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight"
            >
              <span className="block text-gray-200">Power Up Your</span>
              <span className="block bg-gradient-to-r from-[#f46c00] via-[#ff8c42] to-[#ffa366] bg-clip-text text-transparent">
                Devices
              </span>
              <span className="block text-gray-200">With Premium Cables</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed"
            >
              Discover our wide selection of high-quality charging cables, USB-C
              cables, Lightning cables, and wireless chargers. Fast charging,
              durable design, and reliable performance for all your devices.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <motion.button
                onClick={() => navigate("/products")}
                className="group relative px-8 py-3 bg-gradient-to-r from-[#f46c00] to-[#ff8c42] text-white font-semibold rounded-xl shadow-2xl overflow-hidden text-sm md:text-base"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(244, 108, 0, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#ff8c42] to-[#f46c00]"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                onClick={() => navigate("/products")}
                className="group px-8 py-3 bg-[#f46c00]/20 backdrop-blur-md border-2 border-[#f46c00]/40 text-gray-200 font-semibold rounded-xl hover:bg-[#f46c00]/30 transition-all duration-300 text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  Browse All Products
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>

            {/* Stats Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {[
                {
                  label: "Products Available",
                  value: heroCounts.years,
                  suffix: "+",
                },
                {
                  label: "Orders Delivered",
                  value: heroCounts.projects,
                  suffix: "+",
                },
                {
                  label: "Happy Customers",
                  value: heroCounts.team,
                  suffix: "+",
                },
                {
                  label: "Countries Served",
                  value: heroCounts.clients,
                  suffix: "+",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-gray-200 mb-1">
                    {Math.round(stat.value)}
                    {stat.suffix}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        {/* Stats Section with Animation and Counter Effect */}
        <section id="stats-section" className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
              variants={staggerChildren}
              initial="hidden"
              animate={statsVisible ? "visible" : "hidden"}
            >
              <motion.div
                className="p-6 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-[#f46c00]/10 border border-[#b5b3b3]/30"
                variants={statsItem}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#f46c00]/10 rounded-full">
                    <Bolt className="w-6 h-6 text-[#f46c00]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {Math.round(counts.years)}+
                </h3>
                <p className="text-[#b5b3b3]">Products Available</p>
              </motion.div>

              <motion.div
                className="p-6 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-[#f46c00]/10 border border-[#b5b3b3]/30"
                variants={statsItem}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#f46c00]/10 rounded-full">
                    <Building className="w-6 h-6 text-[#f46c00]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {Math.round(counts.facilities)}+
                </h3>
                <p className="text-[#b5b3b3]">Product Categories</p>
              </motion.div>

              <motion.div
                className="p-6 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-[#f46c00]/10 border border-[#b5b3b3]/30"
                variants={statsItem}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#f46c00]/10 rounded-full">
                    <Users className="w-6 h-6 text-[#f46c00]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {Math.round(counts.team).toLocaleString()}+
                </h3>
                <p className="text-[#b5b3b3]">Happy Customers</p>
              </motion.div>

              <motion.div
                className="p-6 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-[#f46c00]/10 border border-[#b5b3b3]/30"
                variants={statsItem}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#f46c00]/10 rounded-full">
                    <Award className="w-6 h-6 text-[#f46c00]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {Math.round(counts.projects).toLocaleString()}+
                </h3>
                <p className="text-[#b5b3b3]">Orders Delivered</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services Section with Creative Design */}
        <section className="py-12 bg-white relative overflow-hidden">
          {/* Creative background elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-48 h-48 bg-[#f46c00]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#b5b3b3]/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              className="text-center mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                Our <span className="text-[#f46c00]">Product Categories</span>
              </h2>
              <p className="text-[#b5b3b3] max-w-2xl mx-auto text-base">
                Explore our wide range of premium cables and charging solutions
                for all your devices
              </p>
            </motion.div>

            <div className="relative">
              {/* Creative diagonal layout */}
              <div className="space-y-6">
                {/* Category 1 - USB-C Cables - Left aligned with image on right */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="order-2 md:order-1">
                      <div className="inline-flex items-center gap-2 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center shadow-lg transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-300">
                          <Bolt className="w-6 h-6 text-white" />
                        </div>
                        <span className="px-3 py-1.5 bg-[#f46c00]/10 text-[#f46c00] font-bold rounded-lg text-sm">
                          01
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                        USB-C <span className="text-[#f46c00]">Cables</span>
                      </h3>
                      <p className="text-[#b5b3b3] mb-4 text-base leading-relaxed">
                        High-speed USB-C cables for fast charging and data
                        transfer. Compatible with smartphones, tablets, laptops,
                        and more. Durable construction with fast charging
                        support up to 100W.
                      </p>
                      <motion.button
                        onClick={() => navigate("/products")}
                        className="px-5 py-2.5 bg-[#f46c00] text-white font-semibold rounded-lg hover:bg-[#d85f00] transition-colors flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Shop USB-C Cables
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="order-1 md:order-2 relative">
                      <div className="relative rounded-xl overflow-hidden shadow-xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                        <img
                          src={usbCableImage}
                          alt="USB-C Cables"
                          className="w-full h-56 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#f46c00]/20 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Category 2 - Lightning Cables - Right aligned with image on left */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="relative order-1 md:order-1">
                      <div className="relative rounded-xl overflow-hidden shadow-xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                        <img
                          src={usbCableImage}
                          alt="Lightning Cables"
                          className="w-full h-56 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#b5b3b3]/20 to-transparent"></div>
                      </div>
                    </div>
                    <div className="order-2 md:order-2 text-right md:text-left">
                      <div className="inline-flex items-center gap-2 mb-3 md:justify-start justify-end">
                        <span className="px-3 py-1.5 bg-[#b5b3b3]/10 text-[#b5b3b3] font-bold rounded-lg text-sm">
                          02
                        </span>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center shadow-lg transform rotate-[5deg] group-hover:rotate-0 transition-transform duration-300">
                          <Bolt className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                        Lightning <span className="text-[#b5b3b3]">Cables</span>
                      </h3>
                      <p className="text-[#b5b3b3] mb-4 text-base leading-relaxed">
                        Apple-certified Lightning cables for iPhone and iPad.
                        MFi certified for guaranteed compatibility and fast
                        charging. Available in various lengths and colors.
                      </p>
                      <motion.button
                        onClick={() => navigate("/products")}
                        className="px-5 py-2.5 bg-[#b5b3b3] text-white font-semibold rounded-lg hover:bg-[#9a9898] transition-colors flex items-center gap-2 md:inline-flex text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Shop Lightning Cables
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Category 3 - Wireless Chargers - Left aligned with image on right */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="order-2 md:order-1">
                      <div className="inline-flex items-center gap-2 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center shadow-lg transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-300">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <span className="px-3 py-1.5 bg-[#f46c00]/10 text-[#f46c00] font-bold rounded-lg text-sm">
                          03
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                        Wireless{" "}
                        <span className="text-[#f46c00]">Chargers</span>
                      </h3>
                      <p className="text-[#b5b3b3] mb-4 text-base leading-relaxed">
                        Qi-compatible wireless charging pads and stands. Fast
                        wireless charging for smartphones, earbuds, and
                        smartwatches. Sleek design with LED indicators and
                        safety features.
                      </p>
                      <motion.button
                        onClick={() => navigate("/products")}
                        className="px-5 py-2.5 bg-[#f46c00] text-white font-semibold rounded-lg hover:bg-[#d85f00] transition-colors flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Shop Wireless Chargers
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="order-1 md:order-2 relative">
                      <div className="relative rounded-xl overflow-hidden shadow-xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                        <img
                          src={wirelessChargerImage}
                          alt="Wireless Chargers"
                          className="w-full h-56 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#f46c00]/20 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Category 4 - Power Adapters - Right aligned with image on left */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="relative order-1 md:order-1">
                      <div className="relative rounded-xl overflow-hidden shadow-xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                        <img
                          src={powerAdapterImage}
                          alt="Power Adapters"
                          className="w-full h-56 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#b5b3b3]/20 to-transparent"></div>
                      </div>
                    </div>
                    <div className="order-2 md:order-2 text-right md:text-left">
                      <div className="inline-flex items-center gap-2 mb-3 md:justify-start justify-end">
                        <span className="px-3 py-1.5 bg-[#b5b3b3]/10 text-[#b5b3b3] font-bold rounded-lg text-sm">
                          04
                        </span>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center shadow-lg transform rotate-[5deg] group-hover:rotate-0 transition-transform duration-300">
                          <Bolt className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                        Power <span className="text-[#b5b3b3]">Adapters</span>
                      </h3>
                      <p className="text-[#b5b3b3] mb-4 text-base leading-relaxed">
                        Fast-charging wall adapters and car chargers. Multiple
                        ports, compact design, and safety-certified. Perfect for
                        home, office, and travel use.
                      </p>
                      <motion.button
                        onClick={() => navigate("/products")}
                        className="px-5 py-2.5 bg-[#b5b3b3] text-white font-semibold rounded-lg hover:bg-[#9a9898] transition-colors flex items-center gap-2 md:inline-flex text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Shop Power Adapters
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section - Asymmetric Layout */}
        <section className="py-16 bg-white relative">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                Featured <span className="text-[#f46c00]">Products</span>
              </h2>
              <p className="text-[#b5b3b3] text-base max-w-2xl mx-auto">
                Discover our selection of premium cables and chargers for all
                your devices
              </p>
            </motion.div>

            {loadingProducts ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f46c00]"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8 bg-red-50 rounded-lg text-red-600">
                {error}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Featured Product - Takes 7 columns */}
                {featuredProducts[0] && (
                  <motion.div
                    className="lg:col-span-7 group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="relative h-full bg-gradient-to-br from-[#f46c00]/10 via-white to-gray-50 rounded-2xl overflow-hidden border border-[#f46c00]/20 hover:border-[#f46c00] transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="absolute top-5 left-5 z-10">
                        <span className="px-4 py-2 bg-[#f46c00] text-white font-bold rounded-lg text-sm">
                          Featured
                        </span>
                      </div>

                      <div className="p-6 lg:p-8">
                        <div className="grid md:grid-cols-2 gap-6 items-center">
                          <div className="relative h-56 md:h-64 rounded-xl overflow-hidden bg-white shadow-md">
                            <img
                              src={featuredProducts[0].image}
                              alt={featuredProducts[0].name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>

                          <div className="flex flex-col justify-center">
                            <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-gray-900 group-hover:text-[#f46c00] transition-colors">
                              {featuredProducts[0].name}
                            </h3>
                            <p className="text-[#b5b3b3] mb-4 text-sm md:text-base line-clamp-3">
                              {featuredProducts[0].description}
                            </p>
                            <div className="mb-5">
                              <span className="text-3xl font-bold text-[#f46c00]">
                                JOD{" "}
                                {featuredProducts[0].price ||
                                  featuredProducts[0].pricePerUnit}
                              </span>
                              {featuredProducts[0].pricePerUnit && (
                                <span className="text-[#b5b3b3] ml-2 text-sm">
                                  /unit
                                </span>
                              )}
                            </div>
                            <motion.button
                              className="px-5 py-2.5 bg-[#f46c00] text-white font-semibold rounded-lg hover:bg-[#d85f00] transition-colors flex items-center gap-2 w-fit"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                navigate(`/products/${featuredProducts[0]._id}`)
                              }
                            >
                              Shop Now
                              <ArrowRight className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Other Products - Takes 5 columns */}
                {featuredProducts.length > 1 && (
                  <div className="lg:col-span-5 space-y-4">
                    {featuredProducts.slice(1, 4).map((product, index) => (
                      <motion.div
                        key={product._id}
                        className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#f46c00]"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(`/products/${product._id}`)}
                      >
                        <div className="flex gap-4 p-4">
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold mb-1 text-gray-900 group-hover:text-[#f46c00] transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-xs text-[#b5b3b3] mb-2 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-[#f46c00]">
                                JOD {product.price || product.pricePerUnit}
                              </span>
                              <ArrowRight className="w-4 h-4 text-[#b5b3b3] group-hover:text-[#f46c00] transition-colors" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* View All Button if more products */}
                    {featuredProducts.length > 4 && (
                      <motion.button
                        className="w-full py-3 bg-gray-100 hover:bg-[#f46c00] text-gray-700 hover:text-white font-semibold rounded-xl transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/products")}
                      >
                        View All Products
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-12 bg-gray-50 rounded-2xl">
                <p className="text-[#b5b3b3] text-lg">
                  No products available at this time.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section with Animation */}
        <section className="py-24 bg-gradient-to-b from-[#f46c00]/5 to-white">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                What Our Clients Say
              </h2>
              <p className="text-lg text-[#b5b3b3] max-w-2xl mx-auto">
                Read testimonials from our satisfied customers
              </p>
            </motion.div>

            {testimonials.length > 0 ? (
              <div className="relative max-w-4xl mx-auto">
                <motion.div
                  className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={activeTestimonial} // Re-animate when testimonial changes
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[activeTestimonial].rating)].map(
                      (_, index) => (
                        <motion.svg
                          key={index}
                          className="w-6 h-6 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      )
                    )}
                  </div>

                  <motion.p
                    className="text-xl text-gray-700 text-center mb-8 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    "{testimonials[activeTestimonial].message}"
                  </motion.p>

                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <h4 className="font-bold text-lg">
                      {testimonials[activeTestimonial].user?.name ||
                        "Anonymous"}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {new Date(
                        testimonials[activeTestimonial].createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </motion.div>
                </motion.div>

                {/* Navigation buttons */}
                <motion.button
                  onClick={prevTestimonial}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-[#f46c00]/10 transition-colors"
                  aria-label="Previous testimonial"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6 text-[#f46c00]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  onClick={nextTestimonial}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-[#f46c00]/10 transition-colors"
                  aria-label="Next testimonial"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6 text-[#f46c00]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>

                {/* Dots indicator */}
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === activeTestimonial
                          ? "bg-[#f46c00]"
                          : "bg-[#b5b3b3] hover:bg-[#f46c00]/50"
                      }`}
                      whileHover={{ scale: 1.2 }}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-white rounded-lg shadow text-gray-500">
                No testimonials available at this time.
              </div>
            )}
          </div>
        </section>

        {/* Call to Action with Animation */}
        <section className="py-16 bg-[#f46c00] text-white">
          <div className="container mx-auto px-6 text-center">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Power Up Your Devices?
            </motion.h2>
            <motion.p
              className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Browse our collection of premium cables and chargers. Fast
              shipping, quality guarantee, and excellent customer support.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.button
                onClick={() => navigate("/products")}
                className="bg-white text-[#f46c00] px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
