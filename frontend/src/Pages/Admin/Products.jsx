// src/pages/admin/Products.jsx
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
  FaImage,
  FaSearch,
  FaFilter,
  FaSort,
  FaDownload,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// ProductForm Component
const ProductForm = ({
  editingProduct,
  formData,
  onInputChange,
  onImageChange,
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
      className="bg-white p-8 rounded-xl w-full max-w-4xl shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingProduct ? "Edit Product" : "Add New Product"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={onInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                required
              />
            </div>

            {/* Price and Stock Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Per Unit (JOD)
                </label>
                <input
                  name="pricePerUnit"
                  type="number"
                  value={formData.pricePerUnit}
                  onChange={onInputChange}
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                name="category"
                value={formData.category}
                onChange={onInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                required
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="flex flex-col space-y-2">
                <label className="flex-1 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors flex items-center justify-center border border-dashed border-indigo-300">
                  <FaImage className="mr-2" />
                  {formData.image ? "Change Image" : "Upload Image"}
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                  />
                </label>
                {formData.image && (
                  <span className="text-sm text-gray-600 flex items-center">
                    <FaImage className="mr-2 text-indigo-500" />{" "}
                    {formData.image.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Product Specifications */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Product Specifications
              </h3>

              {/* Size */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <input
                  name="size"
                  value={formData.size}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  required
                />
              </div>

              {/* Thickness */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thickness (mm)
                </label>
                <input
                  name="thickness"
                  type="number"
                  value={formData.thickness}
                  onChange={onInputChange}
                  step="0.1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  required
                />
              </div>

              {/* Weight */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={onInputChange}
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  required
                />
              </div>

              {/* Material Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material Type
                </label>
                <input
                  name="materialType"
                  value={formData.materialType}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  required
                />
              </div>
            </div>
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
            <FaSave className="mr-2" /> {editingProduct ? "Update" : "Add"}{" "}
            Product
          </motion.button>
        </div>
      </form>
    </motion.div>
  </motion.div>
);

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [activeView, setActiveView] = useState("grid"); // 'grid' or 'table'
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerUnit: "",
    size: "",
    thickness: "",
    weight: "",
    materialType: "",
    stockQuantity: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      // Extract unique categories
      const uniqueCategories = [
        ...new Set(products.map((prod) => prod.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [products]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/items", {
        withCredentials: true,
      });
      setProducts(res.data.data);
    } catch (err) {
      setError("Failed to fetch products");
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      pricePerUnit: "",
      size: "",
      thickness: "",
      weight: "",
      materialType: "",
      stockQuantity: "",
      category: "",
      image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "image" && formData[key]) {
          formDataToSend.append("image", formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/items/${editingProduct._id}`,
          formDataToSend,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/items", formDataToSend, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product added successfully");
      }

      handleCancel();
      fetchProducts();
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description,
      pricePerUnit: prod.pricePerUnit,
      size: prod.size,
      thickness: prod.thickness,
      weight: prod.weight,
      materialType: prod.materialType,
      stockQuantity: prod.stockQuantity,
      category: prod.category,
      image: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/items/${id}`, {
          withCredentials: true,
        });
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error("Failed to delete product");
      }
    }
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "" || product.category === filterCategory)
  );

  const columns = [
    {
      name: "Image",
      selector: (row) => (
        <img
          src={row.image}
          alt={row.name}
          className="w-12 h-12 object-cover rounded-lg"
        />
      ),
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => `JOD ${row.pricePerUnit}`,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => row.stockQuantity,
      sortable: true,
      cell: (row) => (
        <div
          className={`font-medium ${
            parseInt(row.stockQuantity) < 10 ? "text-red-600" : "text-green-600"
          }`}
        >
          {row.stockQuantity}
        </div>
      ),
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEdit(row)}
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

  // Grid view for products
  const renderProductGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
            whileHover={{ y: -5 }}
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                <div className="p-4 w-full flex justify-between items-center">
                  <div className="bg-white/90 px-2 py-1 rounded text-xs font-medium">
                    {product.category}
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-indigo-500 text-white rounded-full"
                    >
                      <FaEdit size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(product._id)}
                      className="p-2 bg-red-500 text-white rounded-full"
                    >
                      <FaTrash size={14} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 truncate">
                {product.name}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-indigo-600 font-bold">
                  JOD {product.pricePerUnit}
                </span>
                <span
                  className={`text-sm font-medium ${
                    parseInt(product.stockQuantity) < 10
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {product.stockQuantity} in stock
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

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
              Manage Products
            </motion.h1>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mt-4 md:mt-0 cursor-pointer"
            >
              <FaPlus />
              <span>Add Product</span>
            </motion.button>
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex-1 md:max-w-xs">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <button
                onClick={() => setActiveView("grid")}
                className={`px-4 py-2 flex items-center ${
                  activeView === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setActiveView("table")}
                className={`px-4 py-2 flex items-center ${
                  activeView === "table"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <div className="text-indigo-600 text-xl font-bold">
                {products.length}
              </div>
              <div className="text-gray-600 text-sm">Total Products</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-green-600 text-xl font-bold">
                {products.reduce(
                  (sum, prod) => sum + parseInt(prod.stockQuantity),
                  0
                )}
              </div>
              <div className="text-gray-600 text-sm">Total Stock</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-amber-600 text-xl font-bold">
                {categories.length}
              </div>
              <div className="text-gray-600 text-sm">Categories</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-red-600 text-xl font-bold">
                {products.filter((p) => parseInt(p.stockQuantity) < 10).length}
              </div>
              <div className="text-gray-600 text-sm">Low Stock Items</div>
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

          {/* Products Display */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <div className="text-4xl text-gray-300 mb-4">🛍️</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : activeView === "grid" ? (
            renderProductGrid()
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl overflow-hidden border border-gray-200"
            >
              <DataTable
                columns={columns}
                data={filteredProducts}
                progressPending={loading}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30, 50]}
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
                      minHeight: "60px",
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
          <ProductForm
            editingProduct={editingProduct}
            formData={formData}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default Products;
