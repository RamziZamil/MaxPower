import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      title: "Users",
      path: "/admin/users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: "Products",
      path: "/admin/products",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      title: "Orders",
      path: "/admin/orders",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: "Messages",
      path: "/admin/messages",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-20 flex items-center px-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {isSidebarOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Max Power</h1>
        </div>

        {/* Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 backdrop-blur-md z-20 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar for mobile/tablet */}
        <motion.div
          initial={false}
          animate={{
            x: isSidebarOpen ? 0 : -300,
            transition: { type: "tween", duration: 0.15 },
          }}
          className={`
            fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30
            transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:hidden
          `}
        >
          <div className="p-6">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-800"
            >
              Max Power
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-500 mt-1"
            >
              {user?.email}
            </motion.p>
          </div>
          <nav className="mt-6">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors ${
                    location.pathname === item.path
                      ? "bg-purple-50 text-purple-600 border-r-4 border-purple-600"
                      : ""
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>

        {/* Sidebar for desktop/laptop */}
        <div className="hidden lg:block lg:static lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-white lg:shadow-lg lg:z-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Max Power</h1>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          </div>
          <nav className="mt-6">
            {menuItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors ${
                    location.pathname === item.path
                      ? "bg-purple-50 text-purple-600 border-r-4 border-purple-600"
                      : ""
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ">
          <div className="p-4 lg:p-8 mt-16 lg:mt-0">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
