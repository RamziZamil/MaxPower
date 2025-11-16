import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHeart, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/items/${id}`
        );
        setProduct(response.data.data);

        // Fetch featured products from the same category
        if (response.data.data.category) {
          const featuredResponse = await axios.get(
            `http://localhost:5000/api/items/category?category=${response.data.data.category}&limit=4`
          );
          setFeaturedProducts(
            featuredResponse.data.data.filter((p) => p._id !== id)
          );
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product._id,
      name: product.name,
      price: product.pricePerUnit,
      image: product.image,
      description: product.description,
    });

    toast.success(`${product.name} has been added to your wishlist`);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.warning("Please log in to add items to cart");
      navigate("/login");
      return;
    }

    try {
      const result = await addToCart(product._id, 1);
      if (result.success) {
        toast.success(`${product.name} has been added to your cart`);
      } else {
        toast.error(result.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong when adding to cart");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-purple-600 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <motion.div
              className="relative h-96 rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-3">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <span className="text-2xl font-bold text-blue-600">
                  JOD {product.pricePerUnit}
                </span>
              </div>

              {product.color && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Color:</span>
                  <span
                    className="inline-block h-6 w-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: product.color.toLowerCase() }}
                    title={product.color}
                  ></span>
                  <span className="text-gray-800">{product.color}</span>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  onClick={handleAddToWishlist}
                  className="flex items-center space-x-2 px-6 py-3 bg-white border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaHeart
                    className={`h-5 w-5 ${
                      isInWishlist(product._id) ? "text-red-500" : ""
                    }`}
                  />
                  <span>Add to Wishlist</span>
                </motion.button>

                <motion.button
                  onClick={handleAddToCart}
                  className="flex items-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              More from {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((featuredProduct) => (
                <motion.div
                  key={featuredProduct._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/products/${featuredProduct._id}`}>
                    <div className="h-48 overflow-hidden">
                      <img
                        src={featuredProduct.image}
                        alt={featuredProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 truncate">
                        {featuredProduct.name}
                      </h3>
                      <span className="text-xl font-bold text-blue-600">
                        JOD {featuredProduct.pricePerUnit}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
