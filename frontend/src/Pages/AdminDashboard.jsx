import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import AdminLayout from "../Components/AdminLayout";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaShoppingBag,
  FaBox,
  FaEnvelope,
  FaChevronRight,
  FaUserPlus,
  FaChartLine,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalMessages: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);

  // Preview data states
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loadingPreviews, setLoadingPreviews] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        navigate("/");
      } else {
        fetchStats();
        fetchPreviews();
      }
    }
  }, [user, loading, navigate]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const [
        usersResponse,
        ordersResponse,
        productsResponse,
        messagesResponse,
      ] = await Promise.all([
        axios.get(API_ENDPOINTS.USERS, {
          withCredentials: true,
        }),
        axios.get(API_ENDPOINTS.ORDERS, {
          withCredentials: true,
        }),
        axios.get(API_ENDPOINTS.ITEMS, {
          withCredentials: true,
        }),
        axios.get(API_ENDPOINTS.CONTACT_MESSAGES, {
          withCredentials: true,
        }),
      ]);

      setStats({
        totalUsers: usersResponse.data.count,
        totalOrders: ordersResponse.data.count,
        totalProducts: productsResponse.data.count,
        totalMessages: messagesResponse.data.length,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchPreviews = async () => {
    try {
      setLoadingPreviews(true);
      const [
        usersResponse,
        productsResponse,
        ordersResponse,
        messagesResponse,
      ] = await Promise.all([
        axios.get(`${API_ENDPOINTS.USERS}?limit=7`, {
          withCredentials: true,
        }),
        axios.get(`${API_ENDPOINTS.ITEMS}?limit=7`, {
          withCredentials: true,
        }),
        axios.get(`${API_ENDPOINTS.ORDERS}?limit=7`, {
          withCredentials: true,
        }),
        axios.get(`${API_ENDPOINTS.CONTACT_MESSAGES}?limit=7`, {
          withCredentials: true,
        }),
      ]);

      setRecentUsers(usersResponse.data.data || []);
      setRecentProducts(productsResponse.data.data || []);
      setRecentOrders(ordersResponse.data.data || []);
      setRecentMessages(messagesResponse.data || []);
    } catch (err) {
      console.error("Error fetching previews:", err);
    } finally {
      setLoadingPreviews(false);
    }
  };

  const handleUpdateMessageStatus = async (messageId, status) => {
    try {
      await axios.put(
        API_ENDPOINTS.CONTACT_MESSAGE_STATUS(messageId),
        { status },
        { withCredentials: true }
      );
      fetchPreviews();
    } catch (err) {
      console.error("Error updating message status:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleManageUsers = () => {
    navigate("/admin/users");
  };

  const handleManageProducts = () => {
    navigate("/admin/products");
  };

  const handleViewOrders = () => {
    navigate("/admin/orders");
  };

  const handleViewMessages = () => {
    navigate("/admin/messages");
  };

  // Prepare data for charts
  const getOrderStatusDistribution = () => {
    const statusCounts = {
      pending: recentOrders.filter((o) => o.status === "pending").length,
      processing: recentOrders.filter((o) => o.status === "processing").length,
      shipped: recentOrders.filter((o) => o.status === "shipped").length,
      cancelled: recentOrders.filter((o) => o.status === "cancelled").length,
      delivered: recentOrders.filter((o) => o.status === "delivered").length,
    };

    return {
      labels: ["Pending", "Processing", "Shipped", "Cancelled", "Delivered"],
      datasets: [
        {
          label: "Order Status Distribution",
          data: [
            statusCounts.pending,
            statusCounts.processing,
            statusCounts.shipped,
            statusCounts.cancelled,
            statusCounts.delivered,
          ],
          backgroundColor: [
            "#FEF9C3", // pending (yellow-100)
            "#DBEAFE", // processing (blue-100)
            "#F3E8FF", // shipped (purple-100)
            "#FEE2E2", // cancelled (red-100)
            "#D1FADF", // delivered (green-100)
          ],
          borderColor: [
            "#FACC15", // pending (yellow-400)
            "#60A5FA", // processing (blue-400)
            "#A78BFA", // shipped (purple-400)
            "#F87171", // cancelled (red-400)
            "#34D399", // delivered (green-400)
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const getMessageStatusDistribution = () => {
    const statusCounts = {
      new: recentMessages.filter((m) => m.status === "new").length,
      read: recentMessages.filter((m) => m.status === "read").length,
      replied: recentMessages.filter((m) => m.status === "replied").length,
    };

    return {
      labels: ["New", "Read", "Replied"],
      datasets: [
        {
          label: "Message Status Distribution",
          data: [statusCounts.new, statusCounts.read, statusCounts.replied],
          backgroundColor: [
            "rgba(14, 165, 233, 0.7)", // sky-500
            "rgba(245, 158, 11, 0.7)", // amber-500
            "rgba(16, 185, 129, 0.7)", // emerald-500
          ],
          borderColor: [
            "rgb(14, 165, 233)",
            "rgb(245, 158, 11)",
            "rgb(16, 185, 129)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getDailyActivity = () => {
    const dates = [
      ...new Set([
        ...recentOrders.map((o) => new Date(o.createdAt).toLocaleDateString()),
        ...recentMessages.map((m) =>
          new Date(m.createdAt).toLocaleDateString()
        ),
      ]),
    ].sort();

    const activityData = {
      orders: Array(dates.length).fill(0),
      messages: Array(dates.length).fill(0),
    };

    recentOrders.forEach((order) => {
      const dateIndex = dates.indexOf(
        new Date(order.createdAt).toLocaleDateString()
      );
      activityData.orders[dateIndex]++;
    });

    recentMessages.forEach((message) => {
      const dateIndex = dates.indexOf(
        new Date(message.createdAt).toLocaleDateString()
      );
      activityData.messages[dateIndex]++;
    });

    return {
      labels: dates,
      datasets: [
        {
          label: "Orders",
          data: activityData.orders,
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 2,
        },
        {
          label: "Messages",
          data: activityData.messages,
          backgroundColor: "rgba(16, 185, 129, 0.5)",
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 2,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // Calculate growth rates (mock data for demonstration)
  const userGrowth = "+12%";
  const orderGrowth = "+8%";
  const productGrowth = "+5%";
  const messageGrowth = "+15%";

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50/50">
        <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Welcome back, {user.name}
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Here's what's happening with your store today.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-white text-sm font-medium transition-colors duration-200 cursor-pointer w-full sm:w-auto"
              >
                <span>Logout</span>
              </motion.button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg"
              >
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </motion.div>
            )}

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 sm:p-8 text-white cursor-pointer"
                onClick={handleManageUsers}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <FaUserPlus className="h-8 w-8 sm:h-10 sm:w-10 opacity-80" />
                    <h3 className="text-xl sm:text-2xl font-bold mt-3">
                      Manage Users
                    </h3>
                    <p className="opacity-80 mt-2 text-base sm:text-lg">
                      Add, edit, or remove users
                    </p>
                  </div>
                  <FaChevronRight className="h-5 w-5 sm:h-6 sm:w-6 opacity-70" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg p-6 sm:p-8 text-white cursor-pointer"
                onClick={handleManageProducts}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <FaBox className="h-8 w-8 sm:h-10 sm:w-10 opacity-80" />
                    <h3 className="text-xl sm:text-2xl font-bold mt-3">
                      Manage Products
                    </h3>
                    <p className="opacity-80 mt-2 text-base sm:text-lg">
                      Inventory and product details
                    </p>
                  </div>
                  <FaChevronRight className="h-5 w-5 sm:h-6 sm:w-6 opacity-70" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg p-6 sm:p-8 text-white cursor-pointer"
                onClick={handleViewOrders}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <FaShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 opacity-80" />
                    <h3 className="text-xl sm:text-2xl font-bold mt-3">
                      Track Orders
                    </h3>
                    <p className="opacity-80 mt-2 text-base sm:text-lg">
                      View and manage customer orders
                    </p>
                  </div>
                  <FaChevronRight className="h-5 w-5 sm:h-6 sm:w-6 opacity-70" />
                </div>
              </motion.div>
            </div>

            {/* Stats Cards */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">
              Store Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-500">
                      Total Users
                    </h3>
                    <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                      <FaUsers className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                    </div>
                  </div>
                  {loadingStats ? (
                    <div className="animate-pulse h-8 sm:h-10 bg-gray-200 rounded w-24 sm:w-28 mb-3"></div>
                  ) : (
                    <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                      {stats.totalUsers}
                    </p>
                  )}
                </div>
                <div className="h-1.5 w-full bg-blue-600"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-500">
                      Total Orders
                    </h3>
                    <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                      <FaShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                    </div>
                  </div>
                  {loadingStats ? (
                    <div className="animate-pulse h-8 sm:h-10 bg-gray-200 rounded w-24 sm:w-28 mb-3"></div>
                  ) : (
                    <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                      {stats.totalOrders}
                    </p>
                  )}
                </div>
                <div className="h-1.5 w-full bg-purple-600"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-500">
                      Total Products
                    </h3>
                    <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                      <FaBox className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                    </div>
                  </div>
                  {loadingStats ? (
                    <div className="animate-pulse h-8 sm:h-10 bg-gray-200 rounded w-24 sm:w-28 mb-3"></div>
                  ) : (
                    <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                      {stats.totalProducts}
                    </p>
                  )}
                </div>
                <div className="h-1.5 w-full bg-green-600"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-500">
                      Total Messages
                    </h3>
                    <div className="p-2 sm:p-3 bg-amber-50 rounded-lg">
                      <FaEnvelope className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                    </div>
                  </div>
                  {loadingStats ? (
                    <div className="animate-pulse h-8 sm:h-10 bg-gray-200 rounded w-24 sm:w-28 mb-3"></div>
                  ) : (
                    <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                      {stats.totalMessages}
                    </p>
                  )}
                </div>
                <div className="h-1.5 w-full bg-amber-600"></div>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Order Status Distribution Pie Chart */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <FaChartPie className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Order Status Distribution
                  </h2>
                </div>
                <div className="h-60 sm:h-80">
                  <Pie
                    data={getOrderStatusDistribution()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: {
                              size: 12,
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Message Status Distribution Pie Chart */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <FaChartPie className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Message Status Distribution
                  </h2>
                </div>
                <div className="h-60 sm:h-80">
                  <Pie
                    data={getMessageStatusDistribution()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: {
                              size: 12,
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Recent Users */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Recent Users
                  </h2>
                  <button
                    onClick={handleManageUsers}
                    className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    View All
                    <FaChevronRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
                <div className="px-4 sm:px-8 py-4 sm:py-5">
                  {loadingPreviews ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-14 sm:h-16 bg-gray-100 rounded animate-pulse"
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentUsers.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between py-3 sm:py-4"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-base sm:text-lg">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <p className="font-medium text-gray-800 text-base sm:text-lg">
                                {user.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Recent Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Recent Products
                  </h2>
                  <button
                    onClick={handleManageProducts}
                    className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    View All
                    <FaChevronRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
                <div className="px-4 sm:px-8 py-4 sm:py-5">
                  {loadingPreviews ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-14 sm:h-16 bg-gray-100 rounded animate-pulse"
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentProducts.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center justify-between py-3 sm:py-4"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-green-100 flex items-center justify-center text-green-600">
                              <FaBox className="h-6 w-6" />
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <p className="font-medium text-gray-800 text-base sm:text-lg">
                                {product.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                In stock: {product.stock || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-base sm:text-lg">
                              {product.pricePerUnit && product.pricePerUnit > 0
                                ? `JOD ${product.pricePerUnit}`
                                : "N/A"}
                            </p>
                            <span className="text-xs text-gray-500">
                              {product.createdAt &&
                              !isNaN(new Date(product.createdAt))
                                ? new Date(
                                    product.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Recent Orders
                  </h2>
                  <button
                    onClick={handleViewOrders}
                    className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    View All
                    <FaChevronRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
                <div className="px-4 sm:px-8 py-4 sm:py-5">
                  {loadingPreviews ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-14 sm:h-16 bg-gray-100 rounded animate-pulse"
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentOrders.map((order) => (
                        <div
                          key={order._id}
                          className="flex items-center justify-between py-3 sm:py-4"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-purple-100 flex items-center justify-center text-purple-600">
                              <FaShoppingBag className="h-6 w-6" />
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <p className="font-medium text-gray-800 text-base sm:text-lg">
                                Order #{order._id.slice(-6)}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                {order.status || "Processing"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-base sm:text-lg">
                              {order.total && order.total > 0
                                ? `JOD ${order.total}`
                                : "N/A"}
                            </p>
                            <span className="text-xs text-gray-500">
                              {order.createdAt &&
                              !isNaN(new Date(order.createdAt))
                                ? new Date(order.createdAt).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Recent Messages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Recent Messages
                  </h2>
                  <button
                    onClick={handleViewMessages}
                    className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    View All
                    <FaChevronRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
                <div className="px-4 sm:px-8 py-4 sm:py-5">
                  {loadingPreviews ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-14 sm:h-16 bg-gray-100 rounded animate-pulse"
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentMessages.map((message) => (
                        <div
                          key={message._id}
                          className="flex items-center justify-between py-3 sm:py-4"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-amber-100 flex items-center justify-center text-amber-600">
                              <FaEnvelope className="h-6 w-6" />
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <p className="font-medium text-gray-800 text-base sm:text-lg">
                                {message.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 truncate max-w-xs">
                                {message.subject}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span
                              className={`text-xs px-3 py-1.5 rounded-full ${
                                message.status === "read"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {message.status || "unread"}
                            </span>
                            <span className="text-xs text-gray-500 mt-1.5">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
