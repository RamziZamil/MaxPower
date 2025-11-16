import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

function Products() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ];

  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/items");
        if (Array.isArray(response.data.data)) {
          setItems(response.data.data);
          setFilteredItems(response.data.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    let result = [...items];

    if (searchQuery) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (priceRange.min !== "") {
      result = result.filter(
        (item) => item.pricePerUnit >= Number(priceRange.min)
      );
    }
    if (priceRange.max !== "") {
      result = result.filter(
        (item) => item.pricePerUnit <= Number(priceRange.max)
      );
    }

    if (selectedCategory) {
      result = result.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(result);
  }, [searchQuery, priceRange, selectedCategory, items]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / productsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, selectedCategory, items]);

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    setSelectedCategory("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header
        className="b text-black"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.2 }}
            >
              <h1 className="text-4xl font-bold tracking-tight">Products</h1>
              <p className="mt-2 text-black/80">
                Premium products curated just for you
              </p>
            </motion.div>

            <motion.div
              className="w-full md:w-auto flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <div className="relative flex-grow">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 text-purple-600 placeholder-purple border border-white/30 focus:ring-2 focus:ring-white/30 focus:border-transparent shadow-md hover:bg-purple-50"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-purple-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                onClick={() => setShowFilters(!showFilters)}
                className="py-3 px-6 bg-white text-purple-600 rounded-lg flex items-center justify-center transition-colors shadow-md hover:bg-purple-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
                <span className="ml-2 bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                  {filteredItems.length}
                </span>
              </motion.button>
            </motion.div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="mt-6 bg-white rounded-lg p-6 border border-white/20 shadow-lg"
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05, duration: 0.15 }}
                  >
                    <h3 className="text-sm font-semibold text-purple-700">
                      Price Range
                    </h3>
                    <div className="flex space-x-3">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-blue-500 ml-1">JOD</span>
                        </div>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.1 }}
                          type="number"
                          className="w-full pl-12 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-blue-400 focus:border-blue-400 text-gray-800 placeholder-gray-400"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              min: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-blue-500 ml-1">JOD</span>
                        </div>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.1 }}
                          type="number"
                          className="w-full pl-12 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 text-gray-800 placeholder-gray-400"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              max: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.07, duration: 0.15 }}
                  >
                    <h3 className="text-sm font-semibold text-purple-700 mb-3">
                      Category
                    </h3>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.1 }}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-blue-400 focus:border-blue-400 text-gray-800"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </motion.select>
                  </motion.div>

                  <motion.div
                    className="flex items-end"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.09, duration: 0.15 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.1 }}
                      onClick={resetFilters}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white rounded-lg transition-colors font-medium shadow-md"
                    >
                      Reset All Filters
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <motion.main
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.2 }}
      >
        <section>
          <motion.div
            className="flex flex-col md:flex-row justify-between items-baseline mb-8 pb-4 border-b border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-800">Our Collection</h2>
            <div className="text-sm text-gray-600 mt-2 md:mt-0">
              Showing{" "}
              <span className="font-medium text-purple-600">
                {filteredItems.length}
              </span>{" "}
              of <span className="font-medium">{items.length}</span> products
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * index, duration: 0.2 }}
                >
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              className="bg-white p-10 rounded-lg shadow-md text-center max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  className="h-10 w-10 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z"
                  />
                </svg>
              </motion.div>
              <h3 className="mt-6 text-xl font-semibold text-gray-800">
                No products found
              </h3>
              <p className="mt-3 text-gray-600">
                Try adjusting your filters or search criteria.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.1 }}
                onClick={resetFilters}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg hover:from-blue-500 hover:to-purple-600 transition-colors shadow-md font-medium"
              >
                Reset Filters
              </motion.button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedItems.map((item, index) => (
                  <ProductCard key={item._id} item={item} index={index} />
                ))}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10 space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
                          currentPage === page
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </motion.main>
    </div>
  );
}

function ProductCard({ item, index }) {
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isWishlisted = isInWishlist(item._id);

  const handleAddToWishlist = () => {
    addToWishlist({
      id: item._id,
      name: item.name,
      price: item.pricePerUnit,
      image: item.image,
      description: item.description,
    });

    toast.success(`${item.name} has been added to your wishlist`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        background: "#fff5f5",
        color: "#d23669",
        border: "1px solid #ffcad4",
        borderRadius: "8px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 2px 8px rgba(210, 54, 105, 0.15)",
      },
      icon: isWishlisted ? "❤️" : "💝",
      className: "wishlist-toast",
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      toast.warning("Please log in to add items to cart", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/login");
      return;
    }

    console.log("Adding item to cart:", item._id);

    try {
      const result = await addToCart(item._id, 1);
      console.log("Add to cart result:", result);

      if (result.success) {
        toast.success(`${item.name} has been added to your cart`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(result.message || "Failed to add item to cart", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong when adding to cart", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.03,
        duration: 0.2,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{ y: -3 }}
    >
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="absolute top-3 left-3"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.05 + index * 0.02, duration: 0.15 }}
        >
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
            Premium
          </span>
        </motion.div>

        <motion.div
          className="absolute top-3 right-3 bg-white text-purple-600 font-bold px-3 py-1 rounded-full shadow-md"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.07 + index * 0.02, duration: 0.15 }}
        >
          <span className="text-blue-500">JOD</span> {item.pricePerUnit}
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <motion.button
            className="p-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
            onClick={() => navigate(`/products/${item._id}`)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </motion.button>

          <motion.button
            onClick={handleAddToWishlist}
            className="p-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
          >
            <FaHeart
              className={`h-5 w-5 ${
                isWishlisted ? "text-red-500" : "text-white"
              }`}
            />
          </motion.button>

          <motion.button
            onClick={handleAddToCart}
            className="p-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
          >
            <FaShoppingCart className="h-5 w-5 text-white" />
          </motion.button>
        </motion.div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-1">
            {item.name}
          </h3>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-12">
          {item.description}
        </p>

        <motion.button
          onClick={handleAddToCart}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center font-medium shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={{ y: 0 }}
            animate={{ y: [0, -2, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 1.5,
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </motion.svg>
          Add to cart
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Products;
