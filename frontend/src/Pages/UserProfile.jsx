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
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const EditModal = ({
  formData,
  formErrors,
  handleInputChange,
  handleImageChange,
  handleSubmit,
  loading,
  onClose,
}) => (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaEdit className="text-[#f46c00]" />
          Edit Profile
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-xl ${
              formErrors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all`}
            placeholder="Enter your name"
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all"
            placeholder="Enter your address"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-xl ${
              formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-[#f46c00] focus:border-transparent transition-all`}
            placeholder="Enter your phone number"
          />
          {formErrors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 cursor-pointer inline-flex items-center transition-colors"
              >
                <FaEdit className="h-4 w-4 mr-2 text-[#f46c00]" />
                Choose File
              </label>
              <span className="text-sm text-gray-500 truncate max-w-xs">
                {formData.image ? formData.image.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#f46c00] text-white rounded-xl hover:bg-[#d85f00] transition-colors disabled:opacity-70 font-medium shadow-md relative overflow-hidden"
          >
            <span className={loading ? "opacity-0" : "opacity-100"}>
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

const getStatusColor = (status) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-[#f46c00]/10 text-[#f46c00]";
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
    className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
    whileHover={{ y: -5 }}
  >
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-[#b5b3b3] flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4" />
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <h3 className="text-lg font-bold text-gray-900">
            Order #{order._id.slice(-6)}
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            order.status
          )}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-600 flex items-center gap-2 text-sm">
          <Package className="w-4 h-4" />
          {order.items?.length || 0} items
        </p>
        {order.estimatedDelivery && (
          <p className="text-gray-600 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            Estimated delivery:{" "}
            {new Date(order.estimatedDelivery).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-xl font-bold text-[#f46c00]">
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
    if (user) {
      setFormData({
        name: user.name || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
        image: null,
      });
    }
  }, [user]);

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

      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
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
        await axios.put(
          `http://localhost:5000/api/users/${user._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

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
        <div className="w-12 h-12 border-4 border-[#f46c00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-2xl mx-auto p-8 mt-10">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="bg-[#f46c00] text-white px-6 py-3 rounded-xl hover:bg-[#d85f00] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8 mt-10">
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">
            No Profile Data
          </h3>
          <p className="text-yellow-600 mb-4">
            No user data is currently available
          </p>
          <button
            onClick={fetchUserProfile}
            className="bg-[#f46c00] text-white px-6 py-3 rounded-xl hover:bg-[#d85f00] transition-colors"
          >
            Retry Fetching Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-[#f46c00]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#f46c00]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="flex flex-col md:flex-row items-center gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <motion.div
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={user?.image || "https://via.placeholder.com/200"}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="absolute bottom-0 right-0 bg-[#f46c00] text-white p-3 rounded-full shadow-lg hover:bg-[#d85f00] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                {user?.name}
              </h1>
              <div className="flex flex-col md:flex-row gap-4 text-gray-300">
                {user?.email && (
                  <span className="flex items-center gap-2">
                    <FaEnvelope className="w-4 h-4" />
                    {user.email}
                  </span>
                )}
                {user?.phoneNumber && (
                  <span className="flex items-center gap-2">
                    <FaPhone className="w-4 h-4" />
                    {user.phoneNumber}
                  </span>
                )}
                {user?.address && (
                  <span className="flex items-center gap-2">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    {user.address}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-2 rounded-2xl bg-white p-2 shadow-md mb-8">
            <Tab
              className={({ selected }) =>
                `flex-1 rounded-xl py-3 text-sm font-semibold transition-all
                ${
                  selected
                    ? "bg-[#f46c00] text-white shadow-lg"
                    : "text-gray-600 hover:bg-[#f46c00]/10"
                }`
              }
            >
              <div className="flex items-center justify-center gap-2">
                <FaUser className="w-4 h-4" />
                Profile
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `flex-1 rounded-xl py-3 text-sm font-semibold transition-all
                ${
                  selected
                    ? "bg-[#f46c00] text-white shadow-lg"
                    : "text-gray-600 hover:bg-[#f46c00]/10"
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Profile Information
                  </h2>
                  <motion.button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#f46c00] text-white rounded-xl hover:bg-[#d85f00] transition-colors font-semibold shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-semibold text-[#b5b3b3] mb-2 uppercase tracking-wide">
                      Name
                    </label>
                    <p className="text-lg font-bold text-gray-900">{user?.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-semibold text-[#b5b3b3] mb-2 uppercase tracking-wide">
                      Email
                    </label>
                    <p className="text-lg font-bold text-gray-900">{user?.email}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-semibold text-[#b5b3b3] mb-2 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <p className="text-lg font-bold text-gray-900">
                      {user?.phoneNumber || "Not provided"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-semibold text-[#b5b3b3] mb-2 uppercase tracking-wide">
                      Address
                    </label>
                    <p className="text-lg font-bold text-gray-900">
                      {user?.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Tab.Panel>

            {/* Orders Panel */}
            <Tab.Panel>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {ordersLoading ? (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f46c00] mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <div className="text-red-500 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Error Loading Orders
                    </h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                      onClick={fetchUserOrders}
                      className="inline-flex items-center px-6 py-3 bg-[#f46c00] text-white rounded-xl hover:bg-[#d85f00] transition-colors font-semibold"
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
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <div className="w-20 h-20 bg-[#f46c00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-10 h-10 text-[#f46c00]" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No Orders Yet
                    </h3>
                    <p className="text-[#b5b3b3] text-lg">
                      When you make your first order, it will appear here.
                    </p>
                  </div>
                )}
              </motion.div>
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
