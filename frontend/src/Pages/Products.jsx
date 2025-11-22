import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaShoppingCart, FaFilter, FaTimes } from "react-icons/fa";
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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Section */}
      <motion.section
        className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white py-16 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Our <span className="text-[#f46c00]">Products</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover our wide selection of premium cables and chargers for all your devices
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f46c00] focus:border-transparent"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-[#f46c00] hover:bg-[#d85f00] text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <FaFilter className="h-5 w-5" />
                Filters
                {filteredItems.length !== items.length && (
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                    {filteredItems.length}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="bg-white border-b border-gray-200 shadow-md"
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filter Products</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Price Range</h4>
                  <div className="flex space-x-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b5b3b3] text-sm">
                        JOD
                      </span>
                      <input
                        type="number"
                        className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46c00] focus:border-transparent"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, min: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b5b3b3] text-sm">
                        JOD
                      </span>
                      <input
                        type="number"
                        className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46c00] focus:border-transparent"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, max: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46c00] focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Section */}
      <motion.main
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
            Products
          </h2>
          <div className="text-sm text-[#b5b3b3]">
            Showing{" "}
            <span className="font-semibold text-[#f46c00]">
              {filteredItems.length}
            </span>{" "}
            of <span className="font-semibold text-gray-800">{items.length}</span> products
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <div className="h-64 bg-gray-200 animate-pulse"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          // Empty State
          <motion.div
            className="bg-white p-12 rounded-xl shadow-md text-center max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 bg-[#f46c00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="h-10 w-10 text-[#f46c00]"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              No products found
            </h3>
            <p className="text-[#b5b3b3] mb-6">
              Try adjusting your filters or search criteria.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetFilters}
              className="px-8 py-3 bg-[#f46c00] hover:bg-[#d85f00] text-white rounded-lg transition-colors font-semibold shadow-lg"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedItems.map((item, index) => (
                <ProductCard key={item._id} item={item} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#f46c00] hover:bg-[#f46c00] hover:text-white border border-[#f46c00]"
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#f46c00] text-white"
                          : "bg-white text-[#f46c00] hover:bg-[#f46c00] hover:text-white border border-[#f46c00]"
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
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#f46c00] hover:bg-[#f46c00] hover:text-white border border-[#f46c00]"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
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
    if (isWishlisted) {
      toast.info(`${item.name} is already in your wishlist`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

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
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
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

    try {
      const result = await addToCart(item._id, 1);

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
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{ y: -5 }}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#f46c00] text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
            Premium
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 font-bold px-3 py-1.5 rounded-lg shadow-md">
          <span className="text-[#f46c00]">JOD</span> {item.pricePerUnit}
        </div>

        {/* Hover Overlay with Actions */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.button
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/products/${item._id}`)}
            title="View Details"
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
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Add to Wishlist"
          >
            <FaHeart
              className={`h-5 w-5 ${
                isWishlisted ? "text-red-500" : "text-white"
              }`}
            />
          </motion.button>

          <motion.button
            onClick={handleAddToCart}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Add to Cart"
          >
            <FaShoppingCart className="h-5 w-5 text-white" />
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 text-lg">
          {item.name}
        </h3>

        <p className="text-sm text-[#b5b3b3] line-clamp-2 mb-4 min-h-12">
          {item.description}
        </p>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          className="w-full bg-[#f46c00] hover:bg-[#d85f00] text-white py-3 rounded-lg transition-colors flex items-center justify-center font-semibold shadow-md gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
        >
          <FaShoppingCart className="h-4 w-4" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Products;
