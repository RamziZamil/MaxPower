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
import heroImage from "../assets/heroImage.jpeg";
import gypsumDesign from "../assets/gypsumDesign.jpeg";
import gypsumboardInstallation from "../assets/gypsumboardInstallation.jpg";
import gypsumboardMaterial from "../assets/gypsumboardMaterial.jpeg";

function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

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
        years: 10,
        facilities: 5,
        team: 50,
        projects: 200,
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

  return (
    <div className="font-sans text-[#706D54] bg-[#DBDBDB]">
      {/* Updated Header Section with Animation */}
      <section className="bg-gradient-to-br from-indigo-900 to-purple-800 text-white overflow-hidden">
        <div className="container mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              className="md:w-1/2 mb-12 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Transform Your Space With Exceptional Design
              </h1>
              <p className="text-lg md:text-xl mb-8 text-indigo-100">
                We bring your vision to life with premium materials and expert
                craftsmanship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="bg-white text-indigo-900 hover:bg-indigo-100 px-8 py-3 rounded-lg font-medium transition duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Services
                </motion.button>
                <motion.button
                  className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Our Projects
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              className="md:w-1/2 md:pl-12"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-indigo-200/20 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/10">
                <img
                  src={heroImage}
                  alt="Modern Interior"
                  className="rounded-lg w-full h-[400px] object-cover"
                />
              </div>
            </motion.div>
          </div>
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
                className="p-6 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-indigo-50 border border-gray-100"
                variants={statsItem}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Bolt className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {Math.round(counts.years)}+
                </h3>
                <p className="text-gray-600">Years Experience</p>
              </motion.div>

              <motion.div
                className="p-6 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-indigo-50 border border-gray-100"
                variants={statsItem}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Building className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {Math.round(counts.facilities)}
                </h3>
                <p className="text-gray-600">Facilities Nationwide</p>
              </motion.div>

              <motion.div
                className="p-6 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-indigo-50 border border-gray-100"
                variants={statsItem}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {Math.round(counts.team)}+
                </h3>
                <p className="text-gray-600">Expert Team Members</p>
              </motion.div>

              <motion.div
                className="p-6 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-indigo-50 border border-gray-100"
                variants={statsItem}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Award className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {Math.round(counts.projects)}+
                </h3>
                <p className="text-gray-600">Projects Completed</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services Section with Animation */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Our Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive design and installation solutions to transform
                your space
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service Card 1 */}
              <motion.div
                className="group rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={gypsumDesign}
                    alt="Design Service"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6">
                      <span className="bg-indigo-600 text-white text-sm font-medium py-1 px-3 rounded-full">
                        Design
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors">
                    Premium Design
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Personalized interior design solutions tailored to your
                    preferences and lifestyle. Our expert designers create
                    spaces that reflect your unique style.
                  </p>
                  <motion.a
                    className="inline-flex items-center text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Explore design services{" "}
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>

              {/* Service Card 2 */}
              <motion.div
                className="group rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={gypsumboardMaterial}
                    alt="Materials Service"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6">
                      <span className="bg-purple-600 text-white text-sm font-medium py-1 px-3 rounded-full">
                        Materials
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors">
                    Quality Materials
                  </h3>
                  <p className="mb-4 text-gray-600">
                    High-end materials sourced from sustainable suppliers for
                    durability and aesthetics. We never compromise on quality.
                  </p>
                  <motion.a
                    className="inline-flex items-center text-purple-600 font-medium group-hover:text-purple-800 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Browse our materials{" "}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </motion.a>
                </div>
              </motion.div>

              {/* Service Card 3 */}
              <motion.div
                className="group rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={gypsumboardInstallation}
                    alt="Installation Service"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6">
                      <span className="bg-indigo-600 text-white text-sm font-medium py-1 px-3 rounded-full">
                        Installation
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors">
                    Expert Installation
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Professional team of craftsmen ensuring flawless execution
                    of your project. We pride ourselves on attention to detail.
                  </p>
                  <motion.a
                    className="inline-flex items-center text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Learn about our process{" "}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Products Section with Animation */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our selection of premium materials for your next
                project
              </p>
            </motion.div>

            {loadingProducts ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8 bg-red-50 rounded-lg text-red-600">
                {error}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    className="group rounded-xl overflow-hidden bg-gray-50 shadow-md hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="h-56 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-800">
                        {product.name}
                      </h3>
                      <p className="mb-4 text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-indigo-600">
                          JOD {product.price || product.pricePerUnit}
                          {product.pricePerUnit && (
                            <span className="text-sm font-normal text-gray-600">
                              /unit
                            </span>
                          )}
                        </span>
                        <motion.button
                          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg transition-colors flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Details <ArrowRight className="ml-1 w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500">
                No products available at this time.
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section with Animation */}
        <section className="py-24 bg-gradient-to-b from-indigo-50 to-white">
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
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-indigo-50 transition-colors"
                  aria-label="Previous testimonial"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6 text-indigo-600"
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
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-indigo-50 transition-colors"
                  aria-label="Next testimonial"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6 text-indigo-600"
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
                          ? "bg-indigo-600"
                          : "bg-gray-300 hover:bg-indigo-300"
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
        <section className="py-16 bg-indigo-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Transform Your Space?
            </motion.h2>
            <motion.p
              className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Contact us today to start your project with our expert team.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.button
                className="bg-white text-indigo-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-indigo-100 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Now
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
