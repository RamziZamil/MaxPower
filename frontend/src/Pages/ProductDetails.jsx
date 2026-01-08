import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHeart, FaShoppingCart, FaArrowLeft, FaStar, FaTruck, FaShieldAlt, FaUndo, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../AuthContext";
import SEO from "../Components/SEO";
import StructuredData from "../Components/StructuredData";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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
    const isAlreadyInWishlist = isInWishlist(product._id);
    
    if (isAlreadyInWishlist) {
      toast.info(`${product.name} is already in your wishlist`, {
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
      id: product._id,
      name: product.name,
      price: product.pricePerUnit,
      image: product.image,
      description: product.description,
    });
    toast.success(`${product.name} has been added to your wishlist`, {
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
      });
      navigate("/login");
      return;
    }

    try {
      const result = await addToCart(product._id, quantity);
      if (result.success) {
        toast.success(`${product.name} has been added to your cart`, {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#f46c00] border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate("/products")}
            className="px-5 py-2.5 bg-[#f46c00] text-white rounded-xl hover:bg-[#d85f00] transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {product && (
        <>
          <SEO
            title={`${product.name} - Premium Cable | MaxPower`}
            description={
              product.description ||
              `Buy ${product.name} at MaxPower. Premium quality cable with fast charging and durable design.`
            }
            keywords={`${product.name}, ${product.category}, premium cable, fast charging, MaxPower`}
            image={product.image}
            type="product"
          />
          <StructuredData product={product} />
        </>
      )}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Static Navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#f46c00] transition-colors"
            whileHover={{ x: -3 }}
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
          <button
            onClick={handleAddToWishlist}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaHeart
              className={`w-5 h-5 transition-colors ${
                isInWishlist(product._id) ? "text-red-500 fill-current" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Product Header Section */}
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#f46c00]/10 to-[#ff8c42]/10 rounded-full mb-3">
            <span className="text-xs font-semibold text-[#f46c00]">{product.category}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-xs text-gray-500">4.8 (120 reviews)</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Image + Gallery */}
          <div className="lg:col-span-2">
            <motion.div
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-96 bg-gradient-to-br from-gray-50 to-white">
                {images.length > 0 && (
                  <img
                    src={images[activeImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain p-6"
                  />
                )}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative h-20 w-20 rounded-xl border-2 overflow-hidden flex-shrink-0 ${
                      index === activeImageIndex
                        ? "border-[#f46c00]"
                        : "border-gray-200 hover:border-[#f46c00]/60"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Purchase Card - Right Side - Smaller */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-5">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  JOD {product.pricePerUnit}
                </div>
                <p className="text-xs text-gray-500">per unit</p>
              </div>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center border-2 border-gray-200 rounded-lg hover:border-[#f46c00] hover:text-[#f46c00] transition-colors font-bold text-sm"
                    >
                      −
                    </button>
                    <div className="flex-1 text-center py-1.5 border-2 border-gray-200 rounded-lg font-bold text-sm">
                      {quantity}
                    </div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center border-2 border-gray-200 rounded-lg hover:border-[#f46c00] hover:text-[#f46c00] transition-colors font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-[#f46c00] to-[#ff8c42] text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaShoppingCart className="w-4 h-4" />
                  Add to Cart
                </motion.button>
              </div>

              {/* Benefits - Smaller */}
              <div className="pt-4 border-t border-gray-200 space-y-2.5">
                {[
                  { icon: FaTruck, text: "Free Shipping", subtext: "On orders over JOD 50" },
                  { icon: FaShieldAlt, text: "Warranty", subtext: "1-year guarantee" },
                  { icon: FaUndo, text: "Easy Returns", subtext: "30-day policy" },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f46c00]/10 to-[#ff8c42]/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-[#f46c00]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">{benefit.text}</p>
                      <p className="text-xs text-gray-500">{benefit.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Description Section - Smaller */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description || "This premium product combines cutting-edge technology with exceptional craftsmanship. Designed to deliver outstanding performance and reliability, it's the perfect choice for those who demand the best. With attention to detail and quality materials, this product is built to last."}
          </p>
        </div>

        {/* Specifications Grid - Smaller */}
        {(product.size || product.materialType || product.thickness || product.weight) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {product.size && (
              <div className="bg-gradient-to-br from-[#f46c00]/5 to-white rounded-xl p-4 border border-[#f46c00]/10">
                <span className="text-xs font-semibold text-[#f46c00] uppercase tracking-wide block mb-1">Size</span>
                <p className="text-base font-bold text-gray-900">{product.size}</p>
              </div>
            )}
            {product.materialType && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Material</span>
                <p className="text-base font-bold text-gray-900">{product.materialType}</p>
              </div>
            )}
            {product.thickness && (
              <div className="bg-gradient-to-br from-[#f46c00]/5 to-white rounded-xl p-4 border border-[#f46c00]/10">
                <span className="text-xs font-semibold text-[#f46c00] uppercase tracking-wide block mb-1">Thickness</span>
                <p className="text-base font-bold text-gray-900">{product.thickness}mm</p>
              </div>
            )}
            {product.weight && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Weight</span>
                <p className="text-base font-bold text-gray-900">{product.weight}g</p>
              </div>
            )}
          </div>
        )}

        {/* Related Products */}
        {featuredProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              You May Also <span className="text-[#f46c00]">Like</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((featuredProduct) => (
                <Link
                  key={featuredProduct._id}
                  to={`/products/${featuredProduct._id}`}
                  className="group"
                >
                  <motion.div
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                    whileHover={{ y: -3 }}
                  >
                    <div className="h-36 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
                      <img
                        src={featuredProduct.image}
                        alt={featuredProduct.name}
                        className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-gray-900 mb-1.5 text-xs line-clamp-2 min-h-[2rem]">
                        {featuredProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-[#f46c00]">
                          JOD {featuredProduct.pricePerUnit}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-[#f46c00]/10 flex items-center justify-center group-hover:bg-[#f46c00] transition-colors">
                          <FaShoppingCart className="w-3.5 h-3.5 text-[#f46c00] group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
