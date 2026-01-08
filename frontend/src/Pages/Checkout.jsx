import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { motion } from "framer-motion";
import { FaShoppingBag, FaCreditCard, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";

const Checkout = () => {
  const { cart, loading, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: user?.address || "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cliq");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please log in to proceed to checkout", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        fullName: user.name || prevState.fullName,
        email: user.email || prevState.email,
        phone: user.phoneNumber || prevState.phone,
        address: user.address || prevState.address,
      }));
    }
  }, [user]);

  const calculateSubtotal = () => {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce(
      (total, item) => total + item.item.pricePerUnit * item.quantity,
      0
    );
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.07;
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 15;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart?.items?.length) {
      toast.error("Your cart is empty", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: cart.items.map((item) => ({
          item: item.item._id,
          quantity: item.quantity,
          price: item.item.pricePerUnit,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        paymentMethod,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shipping: calculateShipping(),
        total: calculateTotal(),
      };

      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };

      const response = await axios.post(
        API_ENDPOINTS.CREATE_ORDER,
        orderData,
        config
      );

      await clearCart();

      toast.success("Order placed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate(`/order-confirmation/${response.data.data._id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Failed to place order", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#f46c00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <FaShoppingBag className="w-16 h-16 text-[#f46c00] mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Checkout</h1>
          <p className="text-gray-600 mb-6">
            Your cart is empty. Add some products before checkout.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-[#f46c00] text-white rounded-xl hover:bg-[#d85f00] transition-colors font-semibold"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Checkout</h1>
          <p className="text-[#b5b3b3]">Complete your order below</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* Cliq Payment */}
                  <div
                    onClick={() => setPaymentMethod("cliq")}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "cliq"
                        ? "border-[#f46c00] bg-[#f46c00]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cliq"
                        name="paymentMethod"
                        value="cliq"
                        checked={paymentMethod === "cliq"}
                        onChange={() => setPaymentMethod("cliq")}
                        className="h-5 w-5 text-[#f46c00] mr-3"
                      />
                      <label htmlFor="cliq" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#f46c00]/10 rounded-lg flex items-center justify-center">
                              <FaCreditCard className="text-[#f46c00]" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Cliq</p>
                              <p className="text-sm text-[#b5b3b3]">Pay using Cliq</p>
                            </div>
                          </div>
                          {paymentMethod === "cliq" && (
                            <FaCheckCircle className="text-[#f46c00] text-xl" />
                          )}
                        </div>
                      </label>
                    </div>
                    {paymentMethod === "cliq" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="bg-gray-50 rounded-xl p-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Cliq Name
                          </label>
                          <div className="bg-white border-2 border-[#f46c00] rounded-lg p-3">
                            <p className="text-lg font-bold text-[#f46c00]">RamziZamil</p>
                          </div>
                          <p className="text-xs text-[#b5b3b3] mt-2">
                            Please use this Cliq name when making your payment
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Cash Payment */}
                  <div
                    onClick={() => setPaymentMethod("cash")}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "cash"
                        ? "border-[#f46c00] bg-[#f46c00]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                        className="h-5 w-5 text-[#f46c00] mr-3"
                      />
                      <label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#f46c00]/10 rounded-lg flex items-center justify-center">
                              <FaMoneyBillWave className="text-[#f46c00]" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Cash on Delivery</p>
                              <p className="text-sm text-[#b5b3b3]">Pay when you receive</p>
                            </div>
                          </div>
                          {paymentMethod === "cash" && (
                            <FaCheckCircle className="text-[#f46c00] text-xl" />
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mobile Order Summary Toggle */}
              <div className="lg:hidden">
                <button
                  type="button"
                  className="w-full bg-white py-4 px-6 rounded-xl text-gray-700 font-semibold mb-4 flex justify-between items-center shadow-md border border-gray-200"
                  onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
                >
                  <span>Order Summary ({cart.items.length} items)</span>
                  <span className="text-[#f46c00] font-bold">
                    JOD {calculateTotal().toFixed(2)}
                  </span>
                </button>

                {orderSummaryOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                  >
                    <div className="max-h-60 overflow-y-auto mb-4">
                      {cart.items.map((item) => (
                        <div
                          key={item.item._id}
                          className="flex items-center py-3 border-b border-gray-200"
                        >
                          <img
                            src={item.item.image}
                            alt={item.item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {item.item.name}
                            </h4>
                            <p className="text-[#b5b3b3] text-xs">
                              JOD {item.item.pricePerUnit} x {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-gray-900">
                            JOD {(item.item.pricePerUnit * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-[#b5b3b3]">Subtotal</span>
                        <span className="font-semibold">JOD {calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b5b3b3]">Tax (7%)</span>
                        <span className="font-semibold">JOD {calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b5b3b3]">Shipping</span>
                        <span className="font-semibold">JOD {calculateShipping().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-[#f46c00]">
                          JOD {calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-[#f46c00] to-[#ff8c42] text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Complete Order - JOD ${calculateTotal().toFixed(2)}`
                )}
              </motion.button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>

              <div className="max-h-80 overflow-y-auto mb-6 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.item._id}
                    className="flex items-center gap-4 pb-4 border-b border-gray-200"
                  >
                    <img
                      src={item.item.image}
                      alt={item.item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {item.item.name}
                      </h4>
                      <p className="text-[#b5b3b3] text-xs">
                        JOD {item.item.pricePerUnit} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      JOD {(item.item.pricePerUnit * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-[#b5b3b3]">Subtotal</span>
                  <span className="font-semibold">JOD {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#b5b3b3]">Shipping</span>
                  <span className="font-semibold">JOD {calculateShipping().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#b5b3b3]">Tax (7%)</span>
                  <span className="font-semibold">JOD {calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#f46c00]">JOD {calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {calculateShipping() === 0 ? (
                <div className="mt-6 bg-[#f46c00]/10 p-4 rounded-xl border border-[#f46c00]/20">
                  <div className="flex items-start gap-2">
                    <FaCheckCircle className="text-[#f46c00] mt-0.5" />
                    <p className="text-sm text-[#f46c00] font-semibold">
                      Your order qualifies for free shipping!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-[#b5b3b3]">
                    Add JOD {(100 - calculateSubtotal()).toFixed(2)} more to get free shipping.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
