import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminLayout from "../../Components/AdminLayout";
import Swal from "sweetalert2";
import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCheck,
  FaReply,
  FaTrash,
  FaSearch,
  FaChartBar,
  FaChartPie,
  FaChartLine,
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

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/contact-messages",
        {
          withCredentials: true,
        }
      );
      setMessages(response.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (messageId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/contact-messages/${messageId}/status`,
        { status },
        { withCredentials: true }
      );
      fetchMessages();
    } catch (err) {
      console.error("Error updating message status:", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/contact-messages/${messageId}`,
          { withCredentials: true }
        );

        if (response.data.message === "Message deleted successfully") {
          // Update the messages state by filtering out the deleted message
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg._id !== messageId)
          );

          await Swal.fire({
            title: "Deleted!",
            text: "The message has been deleted.",
            icon: "success",
            confirmButtonColor: "#3085d6",
            customClass: {
              popup: "rounded-xl",
              confirmButton: "rounded-lg",
            },
          });
          setSelectedMessage(null);
        }
      } catch (err) {
        console.error("Error deleting message:", err);
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete the message.",
          icon: "error",
          confirmButtonColor: "#3085d6",
          customClass: {
            popup: "rounded-xl",
            confirmButton: "rounded-lg",
          },
        });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-sky-500/10 text-sky-600 border-sky-500/20";
      case "read":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "replied":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <FaEnvelope className="w-4 h-4" />;
      case "read":
        return <FaCheck className="w-4 h-4" />;
      case "replied":
        return <FaReply className="w-4 h-4" />;
      default:
        return <FaEnvelope className="w-4 h-4" />;
    }
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare data for charts
  const getStatusDistribution = () => {
    const statusCounts = {
      new: messages.filter((m) => m.status === "new").length,
      read: messages.filter((m) => m.status === "read").length,
      replied: messages.filter((m) => m.status === "replied").length,
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

  const getDailyMessageCount = () => {
    const dailyCounts = {};
    messages.forEach((message) => {
      const date = new Date(message.createdAt).toLocaleDateString();
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    const sortedDates = Object.keys(dailyCounts).sort();

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Messages per Day",
          data: sortedDates.map((date) => dailyCounts[date]),
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    };
  };

  const getStatusTrend = () => {
    const dates = [
      ...new Set(
        messages.map((m) => new Date(m.createdAt).toLocaleDateString())
      ),
    ].sort();

    const statusData = {
      new: Array(dates.length).fill(0),
      read: Array(dates.length).fill(0),
      replied: Array(dates.length).fill(0),
    };

    messages.forEach((message) => {
      const dateIndex = dates.indexOf(
        new Date(message.createdAt).toLocaleDateString()
      );
      statusData[message.status][dateIndex]++;
    });

    return {
      labels: dates,
      datasets: [
        {
          label: "New Messages",
          data: statusData.new,
          backgroundColor: "rgba(14, 165, 233, 0.5)",
          borderColor: "rgb(14, 165, 233)",
          borderWidth: 2,
        },
        {
          label: "Read Messages",
          data: statusData.read,
          backgroundColor: "rgba(245, 158, 11, 0.5)",
          borderColor: "rgb(245, 158, 11)",
          borderWidth: 2,
        },
        {
          label: "Replied Messages",
          data: statusData.replied,
          backgroundColor: "rgba(16, 185, 129, 0.5)",
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50/50">
        <div className="w-full max-w-[95%] mx-auto px-8 py-12">
          <div className="flex flex-col space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Contact Messages
                </h1>
                <p className="mt-2 text-base text-gray-500">
                  Manage and respond to customer inquiries
                </p>
              </div>
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-sky-500/10 rounded-xl p-4">
                    <FaEnvelope className="h-8 w-8 text-sky-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-base font-medium text-gray-500 truncate">
                        Total Messages
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {messages.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-500/10 rounded-xl p-4">
                    <FaEnvelope className="h-8 w-8 text-amber-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-base font-medium text-gray-500 truncate">
                        New Messages
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {messages.filter((m) => m.status === "new").length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-emerald-500/10 rounded-xl p-4">
                    <FaCheck className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-base font-medium text-gray-500 truncate">
                        Read Messages
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {messages.filter((m) => m.status === "read").length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500/10 rounded-xl p-4">
                    <FaReply className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-base font-medium text-gray-500 truncate">
                        Replied Messages
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {messages.filter((m) => m.status === "replied").length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-8 space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="mt-4 h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="mx-auto h-16 w-16 text-gray-400">
                      <FaEnvelope className="h-full w-full" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No messages
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {searchQuery
                        ? "No messages match your search."
                        : "Get started by creating a new message."}
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-8 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedMessage?._id === message._id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xl font-medium text-blue-600">
                                {message.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {message.name}
                            </h3>
                            <p className="text-base text-gray-500">
                              {message.subject}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              message.status
                            )}`}
                          >
                            {getStatusIcon(message.status)}
                            <span className="ml-2 capitalize">
                              {message.status}
                            </span>
                          </span>
                          <span className="text-base text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-base text-gray-600 line-clamp-2">
                          {message.message}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Message Details Modal */}
            {selectedMessage && (
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>
                  <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-8 pt-6 pb-6 sm:p-8">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl leading-6 font-medium text-gray-900">
                              {selectedMessage.subject}
                            </h3>
                            <select
                              value={selectedMessage.status}
                              onChange={(e) =>
                                handleUpdateStatus(
                                  selectedMessage._id,
                                  e.target.value
                                )
                              }
                              className={`mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg ${getStatusColor(
                                selectedMessage.status
                              )}`}
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                            </select>
                          </div>
                          <div className="mt-6">
                            <div className="flex items-center text-base text-gray-500">
                              <FaPhone className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                              {selectedMessage.phone}
                            </div>
                            <div className="mt-2 flex items-center text-base text-gray-500">
                              <FaCalendarAlt className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                              {new Date(
                                selectedMessage.createdAt
                              ).toLocaleString()}
                            </div>
                          </div>
                          <div className="mt-6">
                            <p className="text-base font-medium text-gray-500">
                              Message
                            </p>
                            <div className="mt-3 bg-gray-50 p-6 rounded-xl">
                              <p className="text-base text-gray-700 whitespace-pre-wrap">
                                {selectedMessage.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-8 py-6 sm:px-8 sm:flex sm:flex-row-reverse">
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStatus(selectedMessage._id, "replied")
                          }
                          className="inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Mark as Replied
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteMessage(selectedMessage._id)
                          }
                          className="inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Delete Message
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedMessage(null)}
                          className="inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ContactMessages;
