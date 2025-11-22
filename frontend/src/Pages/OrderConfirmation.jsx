import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaCheckCircle, FaShoppingBag, FaMapMarkerAlt, FaCreditCard, FaCalendar, FaPhone, FaEnvelope } from "react-icons/fa";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated || !orderId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setOrder(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.response?.data?.message || "Error fetching order details");
        toast.error("Failed to load order details", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, isAuthenticated]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#f46c00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Order Not Found</h1>
          <p className="text-[#b5b3b3] mb-8">
            {error || "We couldn't find the order details you're looking for."}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#f46c00] text-white rounded-xl hover:bg-[#d85f00] transition-colors font-semibold"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Order Confirmed!
          </h1>
          <p className="text-xl text-[#b5b3b3] mb-4">
            Thank you for your order. We've received it and will process it soon.
          </p>
          <div className="inline-block bg-[#f46c00]/10 px-6 py-3 rounded-xl border border-[#f46c00]/20">
            <span className="text-sm font-semibold text-[#b5b3b3]">Order ID: </span>
            <span className="text-[#f46c00] font-mono font-bold">{order._id.slice(-8)}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <FaShoppingBag className="text-[#f46c00]" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {item.item.image && (
                      <img
                        src={item.item.image}
                        alt={item.item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {item.item.name}
                      </h3>
                      <p className="text-sm text-[#b5b3b3]">
                        Quantity: {item.quantity} × JOD {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#f46c00] text-lg">
                        JOD {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#f46c00]" />
                Shipping Address
              </h2>
              <div className="bg-gray-50 rounded-xl p-5 space-y-2">
                <p className="font-semibold text-gray-900 text-lg">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-[#b5b3b3]">
                  {order.shippingAddress.address}
                </p>
                <p className="text-[#b5b3b3]">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <div className="flex items-center gap-2 text-[#b5b3b3] pt-2 border-t border-gray-200">
                  <FaPhone className="w-4 h-4" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#b5b3b3]">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    JOD {order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#b5b3b3]">Tax (7%)</span>
                  <span className="font-semibold text-gray-900">
                    JOD {order.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#b5b3b3]">Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {order.shipping === 0 ? (
                      <span className="text-green-500">Free</span>
                    ) : (
                      `JOD ${order.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#f46c00]">
                    JOD {order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <FaCreditCard className="text-[#f46c00]" />
                Payment
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#b5b3b3] mb-1">Payment Method</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {order.paymentMethod === "cliq" ? "Cliq" : order.paymentMethod}
                  </p>
                </div>
                {order.paymentMethod === "cliq" && (
                  <div className="bg-[#f46c00]/10 rounded-xl p-4 border border-[#f46c00]/20">
                    <p className="text-xs text-[#b5b3b3] mb-2">Cliq Name</p>
                    <p className="font-bold text-[#f46c00] text-lg">RamziZamil</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-[#b5b3b3] mb-1">Status</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    Paid
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Order Date */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f46c00]/10 rounded-lg flex items-center justify-center">
                  <FaCalendar className="text-[#f46c00]" />
                </div>
                <div>
                  <p className="text-sm text-[#b5b3b3]">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#f46c00] text-white rounded-xl hover:bg-[#d85f00] transition-colors font-semibold shadow-lg"
          >
            <FaShoppingBag />
            Continue Shopping
          </Link>
          <Link
            to="/userprofile"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold border-2 border-gray-200"
          >
            View All Orders
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
