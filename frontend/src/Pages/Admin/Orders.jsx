import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../Components/AdminLayout";
import { useAuth } from "../../AuthContext";
import { API_ENDPOINTS } from "../../config/api";
import { motion } from "framer-motion";
import {
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiCheck,
  FiX,
  FiClock,
  FiTruck,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [updateNote, setUpdateNote] = useState("");

  const ordersPerPage = 8;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.ORDERS, {
        withCredentials: true,
      });
      setOrders(response.data.data);
    } catch (err) {
      setError("Failed to fetch orders");
      toast.error("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await axios.put(
        API_ENDPOINTS.ORDER_BY_ID(orderId),
        {
          status: newStatus,
          note: updateNote || `Status updated to ${newStatus}`,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      // Update selected order if it's the one being modified
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      // Close dropdown and reset note
      setIsStatusDropdownOpen(false);
      setUpdateNote("");

      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error(
        "Error updating status:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to update order status");
      toast.error(
        err.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FiCheck className="w-4 h-4" />;
      case "pending":
        return <FiClock className="w-4 h-4" />;
      case "processing":
        return <FiTruck className="w-4 h-4" />;
      case "shipped":
        return <FiTruck className="w-4 h-4" />;
      case "cancelled":
        return <FiX className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter and search orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name || "Guest")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 md:mb-0 text-center md:text-left">
              Orders Dashboard
            </h1>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
              {/* Search bar */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm sm:text-base"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              {/* Filter dropdown */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full appearance-none text-sm sm:text-base"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <FiFilter className="absolute left-3 top-3 text-gray-400" />
              </div>

              {/* Refresh button */}
              <button
                onClick={fetchOrders}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 text-sm sm:text-base"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-start">
              <svg
                className="w-5 h-5 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                title: "Total Orders",
                value: orders.length,
                color: "bg-blue-500",
              },
              {
                title: "Completed",
                value: orders.filter((o) => o.status === "delivered").length,
                color: "bg-green-500",
              },
              {
                title: "Pending",
                value: orders.filter((o) => o.status === "pending").length,
                color: "bg-yellow-500",
              },
              {
                title: "Cancelled",
                value: orders.filter((o) => o.status === "cancelled").length,
                color: "bg-red-500",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-4 border-l-4 border-r-0 border-t-0 border-b-0"
                style={{ borderLeftColor: stat.color }}
              >
                <h3 className="text-gray-500 text-sm font-medium">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            {loading && !orders.length ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Order ID
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Customer
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Date
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">
                            #{order._id.slice(-6)}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500">
                            {order._id}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {order.user?.name || "Guest"}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500">
                            {order.user?.email || "No email"}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span
                              className={`px-2 sm:px-3 py-1 inline-flex text-[10px] sm:text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              <span className="flex items-center">
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{order.status}</span>
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewDetails(order)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <FiEye />
                            </motion.button>
                            <div className="relative">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  setIsStatusDropdownOpen(order._id)
                                }
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              >
                                Update Status
                              </motion.button>
                              {isStatusDropdownOpen === order._id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="absolute z-10 right-0 mt-2 w-64 max-w-[90vw] bg-white rounded-lg shadow-xl py-2"
                                >
                                  <div className="px-4 py-2">
                                    <textarea
                                      placeholder="Add a note (optional)"
                                      value={updateNote}
                                      onChange={(e) =>
                                        setUpdateNote(e.target.value)
                                      }
                                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                      rows="2"
                                    />
                                  </div>
                                  {[
                                    "pending",
                                    "processing",
                                    "shipped",
                                    "delivered",
                                    "cancelled",
                                  ].map((status) => (
                                    <motion.button
                                      key={status}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className={`w-full px-4 py-2 text-sm text-left flex items-center ${
                                        order.status === status
                                          ? "bg-gray-100"
                                          : "hover:bg-gray-50"
                                      }`}
                                      onClick={() =>
                                        handleUpdateStatus(order._id, status)
                                      }
                                    >
                                      <span className="flex items-center">
                                        {getStatusIcon(status)}
                                        <span className="ml-2">
                                          {status.charAt(0).toUpperCase() +
                                            status.slice(1)}
                                        </span>
                                      </span>
                                    </motion.button>
                                  ))}
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!loading && !currentOrders.length && (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No orders found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center px-4 py-3 bg-gray-50 mt-4 rounded-lg">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-medium">
                            {indexOfFirstOrder + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(indexOfLastOrder, filteredOrders.length)}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {filteredOrders.length}
                          </span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                              currentPage === 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <span className="sr-only">Previous</span>
                            &larr;
                          </button>

                          {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNumber
                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}

                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                              currentPage === totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <span className="sr-only">Next</span>
                            &rarr;
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {isModalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">
                    Order Details - #{selectedOrder._id.slice(-6)}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      Customer Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="mb-2">
                        <span className="font-medium">Name:</span>{" "}
                        {selectedOrder.user?.name || "Guest"}
                      </p>
                      <p className="mb-2">
                        <span className="font-medium">Email:</span>{" "}
                        {selectedOrder.user?.email || "N/A"}
                      </p>
                      <p className="mb-2">
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedOrder.user?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      Order Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="mb-2">
                        <span className="font-medium">Order ID:</span>{" "}
                        {selectedOrder._id}
                      </p>
                      <p className="mb-2">
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                      <p className="mb-2">
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            selectedOrder.status
                          )}`}
                        >
                          {selectedOrder.status}
                        </span>
                      </p>
                      <p className="mb-2">
                        <span className="font-medium">Payment Method:</span>{" "}
                        {selectedOrder.paymentMethod || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-4">Order Items</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Product
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {(selectedOrder.items || []).map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {item.item?.name || "Unknown Product"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              JOD {item.price}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              JOD {item.quantity * item.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-3 text-right font-medium"
                          >
                            Subtotal:
                          </td>
                          <td className="px-4 py-3">
                            JOD {selectedOrder.subtotal || selectedOrder.total}
                          </td>
                        </tr>
                        {selectedOrder.tax && (
                          <tr>
                            <td
                              colSpan="3"
                              className="px-4 py-3 text-right font-medium"
                            >
                              Tax:
                            </td>
                            <td className="px-4 py-3">
                              JOD {selectedOrder.tax}
                            </td>
                          </tr>
                        )}
                        {selectedOrder.shippingFee && (
                          <tr>
                            <td
                              colSpan="3"
                              className="px-4 py-3 text-right font-medium"
                            >
                              Shipping:
                            </td>
                            <td className="px-4 py-3">
                              JOD {selectedOrder.shippingFee}
                            </td>
                          </tr>
                        )}
                        <tr className="bg-gray-100">
                          <td
                            colSpan="3"
                            className="px-4 py-3 text-right font-bold"
                          >
                            Total:
                          </td>
                          <td className="px-4 py-3 font-bold">
                            JOD {selectedOrder.total}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-4">Shipping Address</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedOrder.shippingAddress ? (
                      <>
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>
                          {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.state}{" "}
                          {selectedOrder.shippingAddress.zipCode}
                        </p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                      </>
                    ) : (
                      <p>No shipping address provided</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </motion.button>
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsStatusDropdownOpen("modal-dropdown")}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Update Status
                    </motion.button>
                    {isStatusDropdownOpen === "modal-dropdown" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2"
                      >
                        <div className="px-4 py-2">
                          <textarea
                            placeholder="Add a note (optional)"
                            value={updateNote}
                            onChange={(e) => setUpdateNote(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows="2"
                          />
                        </div>
                        {[
                          "pending",
                          "processing",
                          "shipped",
                          "delivered",
                          "cancelled",
                        ].map((status) => (
                          <motion.button
                            key={status}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full px-4 py-2 text-sm text-left flex items-center ${
                              selectedOrder.status === status
                                ? "bg-gray-100"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => {
                              handleUpdateStatus(selectedOrder._id, status);
                              setSelectedOrder({ ...selectedOrder, status });
                            }}
                          >
                            <span className="flex items-center">
                              {getStatusIcon(status)}
                              <span className="ml-2">
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </span>
                            </span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default Orders;
