import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Star,
  Trash,
  Share2,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { FaHeart, FaShoppingCart, FaTrash, FaShare } from "react-icons/fa";

function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = async (item) => {
    if (!isAuthenticated) {
      toast.warning("Please log in to add items to cart", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/login");
      return;
    }

    try {
      const result = await addToCart(item.id, 1);
      if (result.success) {
        toast.success(`${item.name} has been added to your cart`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(result.message || "Failed to add item to cart", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
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
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-[#f46c00]/10 rounded-xl flex items-center justify-center mr-4">
              <FaHeart className="text-[#f46c00] text-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">My Wishlist</h1>
              <p className="text-[#b5b3b3] mt-1">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {wishlistItems.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => {
                clearWishlist();
                toast.success("All items removed from wishlist", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTrash className="w-4 h-4" />
              Clear All
            </motion.button>
          )}
        </motion.div>

        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-16 text-center">
              <div className="inline-flex p-6 bg-[#f46c00]/10 rounded-full mb-6">
                <FaHeart className="text-[#f46c00] text-5xl" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Your wishlist is empty
              </h2>
              <p className="text-[#b5b3b3] mb-8 max-w-md mx-auto text-lg">
                Save your favorite items to keep track of products you love and
                want to purchase later.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#f46c00] text-white py-3 px-8 rounded-xl hover:bg-[#d85f00] transition-colors font-semibold shadow-lg"
              >
                <FaShoppingCart className="w-5 h-5" />
                Explore Products
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="p-6 flex flex-col sm:flex-row gap-6">
                  {/* Image */}
                  <div className="relative w-full sm:w-40 h-40 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <motion.button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-all border border-gray-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Remove from wishlist"
                    >
                      <FaTrash className="text-red-500 w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Content */}
                  <div className="flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                          </div>
                          <span className="text-sm text-[#b5b3b3]">4.8</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[#b5b3b3] text-sm mb-4 line-clamp-2 flex-1">
                      {item.description || "Premium quality product designed to meet your needs."}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <span className="text-2xl font-bold text-[#f46c00]">
                        JOD {item.price}
                      </span>

                      <div className="flex items-center gap-3">
                        <motion.button
                          className="p-2.5 text-[#b5b3b3] hover:text-[#f46c00] hover:bg-[#f46c00]/10 rounded-lg transition-colors"
                          aria-label="Share"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaShare className="w-5 h-5" />
                        </motion.button>

                        <Link
                          to={`/products/${item.id}`}
                          className="px-5 py-2.5 border-2 border-[#f46c00] text-[#f46c00] hover:bg-[#f46c00] hover:text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
                        >
                          View Details
                          <ChevronRight size={16} />
                        </Link>

                        <motion.button
                          onClick={() => handleBuyNow(item)}
                          className="px-5 py-2.5 bg-[#f46c00] text-white hover:bg-[#d85f00] rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors shadow-md"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
