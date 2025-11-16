import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Tab } from "@headlessui/react";
import {
  User,
  Package,
  Edit3,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";

const EditModal = ({
  formData,
  formErrors,
  handleInputChange,
  handleImageChange,
  handleSubmit,
  loading,
  onClose,
}) => (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl m-4"
    >
      {/* Modal header */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-3 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Edit Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg ${
              formErrors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            placeholder="Enter your name"
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {formErrors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Enter your address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg ${
              formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            placeholder="Enter your phone number"
          />
          {formErrors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {formErrors.phoneNumber}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture
          </label>
          <div className="mt-1 flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-upload"
              />
              <label
                htmlFor="profile-upload"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer inline-flex items-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Choose File
              </label>
              <span className="text-sm text-gray-500 truncate max-w-xs">
                {formData.image ? formData.image.name : "No file chosen"}
              </span>
            </div>
            {formData.image && (
              <div className="bg-gray-100 p-2 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Selected file:</div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium truncate">
                    {formData.image.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 font-medium shadow-md disabled:shadow-none relative overflow-hidden"
          >
            <span className={`${loading ? "opacity-0" : "opacity-100"}`}>
              Save Changes
            </span>
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  </div>
);

// Order Card Component
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

const OrderCard = ({ order }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
  >
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-1">
            Order #{order._id.slice(-6)}
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-gray-600 flex items-center gap-2">
          <Package className="w-4 h-4" />
          {order.items?.length || 0} items
        </p>
        {order.estimatedDelivery && (
          <p className="text-gray-600 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Estimated delivery:{" "}
            {new Date(order.estimatedDelivery).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-lg font-bold text-gray-900">
          JOD {order.total?.toFixed(2) || "0.00"}
        </p>
      </div>
    </div>
  </motion.div>
);

const UserProfile = () => {
  const { user, login } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    image: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      fetchUserProfile();
    } else {
      setLoading(false);
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/orders/myorders",
        {
          withCredentials: true,
        }
      );

      console.log("Orders response:", response.data); // Debug log

      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error("Unexpected orders data format:", response.data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
      setError("Failed to load orders. Please try again later.");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          withCredentials: true,
        }
      );

      console.log("Profile API response:", response.data);
      const userData = response.data.user || response.data;
      const token = localStorage.getItem("token");
      if (token) {
        await login(token);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError(error.response?.data?.message || "Failed to load user profile");
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please check all required fields",
      });
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      if (formData.name && formData.name !== user.name) {
        formDataToSend.append("name", formData.name.trim());
      }
      if (formData.address && formData.address !== user.address) {
        formDataToSend.append("address", formData.address.trim());
      }
      if (formData.phoneNumber && formData.phoneNumber !== user.phoneNumber) {
        formDataToSend.append("phoneNumber", formData.phoneNumber.trim());
      }
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if ([...formDataToSend.entries()].length > 0) {
        const response = await axios.put(
          `http://localhost:5000/api/users/${user._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        // Get the updated user data
        const updatedUser = response.data.user;

        // Update the auth context with the new user data
        const token = localStorage.getItem("token");
        if (token) {
          await login(token);
        }

        setIsModalOpen(false);

        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Profile updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        setIsModalOpen(false);
        await Swal.fire({
          icon: "info",
          title: "No Changes",
          text: "No changes were made to your profile",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Update error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        serverError: error.response?.data?.error,
      });

      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "An error occurred while updating your profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 mt-10 bg-white rounded-lg shadow-lg">
        <div className="bg-red-50 p-6 rounded-lg border border-red-100 mb-6">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-700">
              Error Loading Profile
            </h3>
          </div>
          <p className="text-red-600 ml-11 mb-4">{error}</p>
          <div className="flex justify-center mt-2">
            <button
              onClick={fetchUserProfile}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8 mt-10 bg-white rounded-lg shadow-lg">
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100 mb-6">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-500 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-yellow-700">
              No Profile Data
            </h3>
          </div>
          <p className="text-yellow-600 ml-11 mb-4">
            No user data is currently available
          </p>
          <div className="flex justify-center mt-2">
            <button
              onClick={fetchUserProfile}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry Fetching Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                <img
                  src={user?.image || "https://via.placeholder.com/200"}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
              <div className="flex flex-col md:flex-row gap-4 text-indigo-100">
                {user?.email && (
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                )}
                {user?.phoneNumber && (
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {user.phoneNumber}
                  </span>
                )}
                {user?.address && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {user.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow-md mb-8">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-3 text-sm font-medium leading-5 transition-colors
                ${
                  selected
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-600 hover:bg-indigo-50"
                }`
              }
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-3 text-sm font-medium leading-5 transition-colors
                ${
                  selected
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-600 hover:bg-indigo-50"
                }`
              }
            >
              <div className="flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                Orders
              </div>
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* Profile Panel */}
            <Tab.Panel>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <p className="text-gray-900">
                      {user?.phoneNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <p className="text-gray-900">
                      {user?.address || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </Tab.Panel>

            {/* Orders Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                {ordersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                    <div className="text-red-500 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Error Loading Orders
                    </h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                      onClick={fetchUserOrders}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {orders.map((order) => (
                      <OrderCard key={order._id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Orders Yet
                    </h3>
                    <p className="text-gray-600">
                      When you make your first order, it will appear here.
                    </p>
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <EditModal
            formData={formData}
            formErrors={formErrors}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            handleSubmit={handleSubmit}
            loading={loading}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
