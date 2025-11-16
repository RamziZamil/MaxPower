import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2";
import interiorDesignLogin from "../assets/interiorDesignLogin.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make login request
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (!response.data || !response.data.data || !response.data.data.token) {
        throw new Error("No token received from server");
      }

      // Get the token and user from response
      const { token, user } = response.data.data;

      // Call login function and wait for it to complete
      const userData = await login(token);

      if (!userData) {
        throw new Error("Failed to get user data");
      }

      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Welcome back!",
        text: "Login successful",
        timer: 1500,
        showConfirmButton: false,
        background: "#ffffff",
        iconColor: "#798cff",
        titleColor: "#1e293b",
        textColor: "#475569",
        customClass: { popup: "rounded-lg shadow-xl" },
      });

      // Redirect based on user role
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        background: "#ffffff",
        iconColor: "#ef4444",
        titleColor: "#1e293b",
        textColor: "#475569",
        customClass: { popup: "rounded-lg shadow-xl" },
      });
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#7141fc]">
              Freedom<span className="text-[#fb64b6]">Road</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to your account
            </p>
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">
                or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="peer bg-white border border-gray-300 text-gray-900 placeholder-transparent text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="email-address"
                  className="absolute text-xs text-gray-500 duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
                >
                  Email address
                </label>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="peer bg-white border border-gray-300 text-gray-900 placeholder-transparent text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className="absolute text-xs text-gray-500 duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
                >
                  Password
                </label>
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-xs font-medium text-purple-500 hover:text-purple-600"
              >
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition duration-150 shadow"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Don't have an account?{" "}
              <a
                href="./signup"
                className="font-medium text-purple-500 hover:text-purple-600"
              >
                Sign up
              </a>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Redesigned with improved text visibility */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        {/* Main background image with darker overlay for better text contrast */}
        <img
          src={interiorDesignLogin}
          alt="Interior design showcase"
          className="h-full w-full object-cover"
        />

        {/* Gradient overlay with stronger opacity for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-800/70 to-indigo-600/80"></div>

        {/* Decorative elements */}
        <div className="absolute inset-0">
          {/* Top right decorative circle */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-500/30 rounded-full blur-xl"></div>

          {/* Bottom left decorative circle */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-300/30 rounded-full blur-lg"></div>

          {/* Middle decorative element */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-lg"></div>
        </div>

        {/* Content box with improved visibility */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-8">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 max-w-md border border-white/20 shadow-2xl">
            {/* Logo/Icon section */}
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
            </div>

            {/* Headline with improved contrast */}
            <h1 className="text-4xl font-bold mb-4 text-white text-center drop-shadow-md">
              Design Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">
                Dream Space
              </span>
            </h1>

            {/* Description with improved readability */}
            <p className="text-white text-lg mb-8 text-center leading-relaxed drop-shadow">
              Transform your living environment with our exclusive collection of
              premium designs tailored to your unique style.
            </p>

            {/* Feature points with icons for better visual appeal */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
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
                </div>
                <p className="ml-3 text-white text-sm">
                  Personalized recommendations based on your preferences
                </p>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
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
                </div>
                <p className="ml-3 text-white text-sm">
                  Access to exclusive premium design collections
                </p>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-pink-500/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
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
                </div>
                <p className="ml-3 text-white text-sm">
                  Professional design consultations and support
                </p>
              </div>
            </div>

            {/* Decorative divider */}
            <div className="flex justify-center space-x-2 mb-2">
              <div className="h-1 w-12 bg-indigo-400 rounded-full"></div>
              <div className="h-1 w-8 bg-purple-400 rounded-full"></div>
              <div className="h-1 w-4 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
