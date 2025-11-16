import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Trash,
  Plus,
  Share2,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = async (item) => {
    if (!isAuthenticated) {
      toast.warning("Please log in to add items to cart", {
        position: "top-right",
        autoClose: 2000,
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
        });
      } else {
        toast.error(result.message || "Failed to add item to cart", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong when adding to cart", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="text-purple-600 mr-3" size={28} />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>

          <div className="flex items-center space-x-4">
            {wishlistItems.length > 0 && (
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                {wishlistItems.length} item
                {wishlistItems.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-12 text-center">
              <div className="inline-flex p-6 bg-purple-50 rounded-full mb-6">
                <Heart className="text-purple-500" size={48} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Your wishlist is waiting to be filled
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Save your favorite items to keep track of products you love and
                want to purchase later.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center bg-purple-600 text-white py-3 px-6 rounded-full hover:bg-purple-700 transition-all duration-200 font-medium shadow-md"
              >
                <ShoppingCart className="mr-2" size={20} />
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-md mb-8 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-semibold text-gray-700">Saved Items</h2>
                <button
                  onClick={() =>
                    wishlistItems.forEach((item) => removeFromWishlist(item.id))
                  }
                  className="text-gray-500 hover:text-red-600 flex items-center text-sm font-medium"
                >
                  <Trash size={16} className="mr-1" />
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 flex flex-col sm:flex-row hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 transition-all border border-gray-100"
                        aria-label="Remove from wishlist"
                      >
                        <Trash className="text-red-500" size={14} />
                      </button>
                    </div>

                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {item.name}
                        </h3>
                        <div className="flex items-center text-amber-500">
                          <Star size={16} fill="currentColor" />
                          <span className="ml-1 text-sm font-medium">4.5</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                        <span className="text-lg font-bold text-purple-600">
                          JOD {item.price}
                        </span>

                        <div className="flex space-x-3">
                          <button
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Share"
                          >
                            <Share2 size={18} />
                          </button>

                          <Link
                            to={`/products/${item.id}`}
                            className="px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-full font-medium text-sm flex items-center"
                          >
                            Details
                            <ChevronRight size={16} className="ml-1" />
                          </Link>

                          <button
                            onClick={() => handleBuyNow(item)}
                            className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-full font-medium text-sm flex items-center"
                          >
                            <ShoppingCart size={16} className="mr-1" />
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
