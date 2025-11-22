// src/Components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FaUser, FaShoppingCart, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartIcon from "./CartIcon";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add navigation function for wishlist
  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged Out Successfully!", {
      position: "top-right",
      autoClose: 2000, // Slightly longer duration for readability
      hideProgressBar: false, // Keep the progress bar for a polished feel
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "maxpower-toast", // Custom class for additional styling
      style: {
        background: "linear-gradient(135deg, #EA7300, #F16767)", // Blue-500 to Purple-600 gradient
        color: "#FFFFFF", // White text for contrast
        borderRadius: "12px", // Softer, modern rounded corners
        padding: "12px 20px", // More spacious padding
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)", // Subtle, elevated shadow
        fontFamily: "inherit", // Inherit font from your site (or specify one)
        fontSize: "16px", // Slightly larger for readability
        fontWeight: "500", // Medium weight for a clean look
      },
      progressStyle: {
        background: "rgba(255, 255, 255, 0.3)", // White with transparency for a sleek progress bar
        height: "4px", // Thinner, modern progress bar
        borderRadius: "4px", // Rounded edges
      },
      icon: () => (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11.59L5.41 10 4 8.59 6.59 6 4 3.41 5.41 2 9 5.59 12.59 2 14 3.41 11.41 6 14 8.59 12.59 10 9 6.41z"
            fill="#FFFFFF"
          />
        </svg>
      ), // Custom logout icon
    });
  };

  return (
    <nav
      className={`transition-all duration-300 sticky top-0 z-50 ${
        scrolled
          ? "bg-white text-gray-900 shadow-md"
          : "bg-[#f46c00] text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span
                className={`text-2xl font-extrabold ${
                  scrolled ? "text-[#f46c00]" : "text-white"
                }`}
              >
                Max
                <span className={scrolled ? "text-[#b5b3b3]" : "text-white/90"}>
                  Power
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-1">
              {["Home", "Products", "Services", "About ", "Contact"].map(
                (item, index) => (
                  <Link
                    key={index}
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "")}`
                    }
                    className={`px-4 py-2 mx-1 text-sm font-medium rounded-full transition-all duration-200 ${
                      scrolled
                        ? "hover:bg-[#f46c00]/10 hover:text-[#f46c00]"
                        : "hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link to="/userprofile">
                  <div
                    className={`rounded-full p-2 ${
                      scrolled ? "hover:bg-[#f46c00]/10" : "hover:bg-white/10"
                    }`}
                  >
                    <FaUser
                      className={`text-xl cursor-pointer ${
                        scrolled ? "text-[#f46c00]" : "text-white"
                      }`}
                    />
                  </div>
                </Link>
                <Link to="/cart">
                  <div
                    className={`rounded-full p-2 ${
                      scrolled ? "hover:bg-[#f46c00]/10" : "hover:bg-white/10"
                    }`}
                  >
                    <CartIcon />
                  </div>
                </Link>
                <div
                  onClick={handleWishlistClick}
                  className={`rounded-full p-2 cursor-pointer ${
                    scrolled ? "hover:bg-[#f46c00]/10" : "hover:bg-white/10"
                  }`}
                >
                  <FaHeart
                    className={`text-xl ${
                      scrolled ? "text-[#f46c00]" : "text-white"
                    }`}
                  />
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-[#ff9f51] hover:bg-[#d85f00] px-4 py-2 rounded-full text-white text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    scrolled
                      ? "bg-[#f46c00] text-white hover:bg-[#d85f00]"
                      : "bg-white text-[#f46c00] hover:bg-white/90"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    scrolled
                      ? "border border-[#f46c00] text-[#f46c00] hover:bg-[#f46c00] hover:text-white"
                      : "border border-white hover:bg-white hover:text-[#f46c00]"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              className={`rounded-md p-2 ${
                scrolled
                  ? "text-[#f46c00] hover:bg-[#f46c00]/10"
                  : "text-white hover:bg-white/10"
              } focus:outline-none`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className={`lg:hidden ${
            scrolled ? "bg-white text-gray-900" : "bg-[#f46c00] text-white"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {["Home", "Products", "Services", "About ", "Contact"].map(
              (item, index) => (
                <Link
                  key={index}
                  to={
                    item === "Home"
                      ? "/"
                      : `/${item.toLowerCase().replace(" ", "")}`
                  }
                  className={`block px-3 py-3 text-base font-medium rounded-lg ${
                    scrolled
                      ? "text-gray-900 hover:bg-[#f46c00]/10"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              )
            )}

            <div
              className={`pt-4 pb-2 border-t ${
                scrolled ? "border-[#b5b3b3]" : "border-white/20"
              }`}
            >
              {isAuthenticated ? (
                <>
                  <Link
                    to="/userprofile"
                    className={`flex items-center px-3 py-2 ${
                      scrolled ? "text-gray-900" : "text-white"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUser className="text-xl mr-3" />
                    <span>My Account</span>
                  </Link>
                  <div className="flex items-center px-3 py-2">
                    <Link to="/cart">
                      <div
                        className={`rounded-full p-2 ${
                          scrolled
                            ? "hover:bg-[#f46c00]/10"
                            : "hover:bg-white/10"
                        }`}
                      >
                        <CartIcon />
                      </div>
                    </Link>
                  </div>
                  <div
                    className={`flex items-center px-3 py-2 cursor-pointer ${
                      scrolled ? "text-gray-900" : "text-white"
                    }`}
                    onClick={() => {
                      handleWishlistClick();
                      setIsOpen(false);
                    }}
                  >
                    <FaHeart className="text-xl mr-3" />
                    <span>Wishlist</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full bg-[#f46c00] hover:bg-[#d85f00] px-3 py-3 rounded-lg text-white text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="w-full bg-[#f46c00] hover:bg-[#d85f00] px-3 py-3 rounded-lg text-white text-center text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`w-full px-3 py-3 rounded-lg text-center text-base font-medium ${
                      scrolled
                        ? "border border-[#f46c00] text-[#f46c00] hover:bg-[#f46c00] hover:text-white"
                        : "border border-white text-white hover:bg-white hover:text-[#f46c00]"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
