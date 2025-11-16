// src/pages/admin/Users.jsx
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import AdminLayout from "../../Components/AdminLayout";
import { useAuth } from "../../AuthContext";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserCog,
  FaSearch,
  FaFilter,
  FaDownload,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaUser,
  FaIdBadge,
} from "react-icons/fa";
import { toast } from "react-toastify";

// User Form Component
const UserForm = ({
  editingUser,
  formData,
  onInputChange,
  onCancel,
  onSubmit,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingUser ? "Edit User" : "Add New User"}
        </h2>
        <motion.button
          onClick={onCancel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FaTimes className="text-gray-500" />
        </motion.button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
              required
            />
          </div>
        </div>

        {/* Password (only for new users) */}
        {!editingUser && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={onInputChange}
                className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                required={!editingUser}
              />
            </div>
          </div>
        )}

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaIdBadge className="text-gray-400" />
            </div>
            <select
              name="role"
              value={formData.role}
              onChange={onInputChange}
              className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-6">
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <FaTimes className="mr-2" /> Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <FaSave className="mr-2" /> {editingUser ? "Update" : "Add"} User
          </motion.button>
        </div>
      </form>
    </motion.div>
  </motion.div>
);

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/users", {
        withCredentials: true,
      });
      setUsers(response.data.data);
    } catch (err) {
      setError("Failed to fetch users");
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const { password, ...updateData } = formData; // Remove password if not provided
        await axios.put(
          `http://localhost:5000/api/users/${editingUser._id}`,
          updateData,
          {
            withCredentials: true,
          }
        );
        toast.success("User updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/users", formData, {
          withCredentials: true,
        });
        toast.success("User added successfully");
      }

      handleCancel();
      fetchUsers();
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(err.response?.data?.message || "Failed to save user");
    }
  };

  const handleEdit = (userId) => {
    if (userId === "new") {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
      });
    } else {
      const userToEdit = users.find((u) => u._id === userId);
      if (userToEdit) {
        setEditingUser(userToEdit);
        setFormData({
          name: userToEdit.name,
          email: userToEdit.email,
          password: "", // Don't populate password
          role: userToEdit.role,
        });
      }
    }
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          withCredentials: true,
        });
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (err) {
        setError("Failed to delete user");
        toast.error("Failed to delete user");
        console.error("Error deleting user:", err);
      }
    }
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === "" || user.role === filterRole)
  );

  // Calculate user statistics
  const userStats = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    user: users.filter((u) => u.role === "user").length,
  };

  const columns = [
    {
      name: "User",
      cell: (row) => (
        <div className="flex items-center py-2">
          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-800">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => a.name.localeCompare(b.name),
      minWidth: "250px",
    },
    {
      name: "Role",
      cell: (row) => (
        <div
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            row.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : row.role === "editor"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
        </div>
      ),
      sortable: true,
      selector: (row) => row.role,
    },
    {
      name: "Joined",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEdit(row._id)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <FaEdit />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(row._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaTrash />
          </motion.button>
        </div>
      ),
      width: "120px",
    },
  ];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-800"
            >
              Users Management
            </motion.h1>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <div className="text-indigo-600 text-xl font-bold">
                {userStats.total}
              </div>
              <div className="text-gray-600 text-sm">Total Users</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="text-purple-600 text-xl font-bold">
                {userStats.admin}
              </div>
              <div className="text-gray-600 text-sm">Administrators</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-green-600 text-xl font-bold">
                {userStats.user}
              </div>
              <div className="text-gray-600 text-sm">Regular Users</div>
            </div>
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Box */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
              />
            </div>

            {/* Role Filter */}
            <div className="flex-1 md:max-w-xs">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 text-red-600 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Users Data Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <div className="text-4xl text-gray-300 mb-4">👤</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl overflow-hidden border border-gray-200"
            >
              <DataTable
                columns={columns}
                data={filteredUsers}
                progressPending={loading}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30, 50]}
                highlightOnHover
                responsive
                customStyles={{
                  headRow: {
                    style: {
                      backgroundColor: "#f9fafb",
                      color: "#374151",
                      fontWeight: "600",
                      padding: "12px",
                    },
                  },
                  rows: {
                    style: {
                      minHeight: "72px",
                      "&:hover": {
                        backgroundColor: "#f9fafb",
                      },
                    },
                  },
                }}
              />
            </motion.div>
          )}
        </div>

        {showModal && (
          <UserForm
            editingUser={editingUser}
            formData={formData}
            onInputChange={handleInputChange}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default Users;
