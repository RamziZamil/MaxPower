import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    retypePassword: "",
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // For multi-step form
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format.");
      return false;
    }
    const phoneRegex = /^(\+962|0)(7[0-9]{8})$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError(
        "Phone number must be a valid Jordanian number (e.g., +9627XXXXXXXX)."
      );
      return false;
    }
    if (!formData.address.trim()) {
      setError("Please enter your address.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (formData.password !== formData.retypePassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (!image) {
      setError("Please upload a profile image.");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError("");
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      nextStep();
      return;
    }

    if (!validateStep2()) {
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("image", image);

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Welcome to FreedomRoad!",
        text: "Your account has been created successfully",
        showConfirmButton: true,
        confirmButtonColor: "#4F46E5",
        timer: 3000,
      });
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error.response?.data?.message || "Signup failed. Please try again.",
        confirmButtonColor: "#4F46E5",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Enhanced Design panel with background image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Background image with overlay and gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop')",
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-800/80 to-pink-600/70"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center items-center h-full text-white relative z-10 px-12">
          <div className="p-8 bg-black/30 rounded-2xl backdrop-blur-md max-w-lg border border-white/10 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white/20 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
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
            <h2 className="text-4xl font-bold text-center mb-3 text-white drop-shadow-lg">
              Design Your Dream Space
            </h2>
            <p className="text-center text-white text-opacity-90 mb-8 text-lg">
              Transform your living environment with our exclusive collection of
              premium designs tailored to your unique style.
            </p>
            <div className="space-y-5">
              <div className="flex items-center bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <div className="p-2 bg-indigo-500 rounded-full mr-4 shadow-lg">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="font-medium">
                  Personalized recommendations based on your preferences
                </p>
              </div>
              <div className="flex items-center bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <div className="p-2 bg-indigo-500 rounded-full mr-4 shadow-lg">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="font-medium">
                  Access to exclusive premium design collections
                </p>
              </div>
              <div className="flex items-center bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <div className="p-2 bg-indigo-500 rounded-full mr-4 shadow-lg">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="font-medium">
                  Professional design consultations and support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form (unchanged) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">
              <span className="text-indigo-600">Freedom</span>
              <span className="text-pink-500">Road</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 1
                ? "Sign up to create your account"
                : "Complete your profile"}
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full ${
                  step >= 1 ? "bg-indigo-600" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-12 h-1 ${
                  step >= 2 ? "bg-indigo-600" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${
                  step >= 2 ? "bg-indigo-600" : "bg-gray-300"
                }`}
              ></div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              // Step 1 form
              <>
                <div className="mb-4">
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <input
                    name="phoneNumber"
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Phone Number (+962XXXXXXXXX)"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-6">
                  <input
                    name="address"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                  Continue
                </button>
              </>
            ) : (
              // Step 2 form
              <>
                <div className="mb-4 relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400" />
                    ) : (
                      <FaEye className="text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <input
                    name="retypePassword"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Confirm Password"
                    value={formData.retypePassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-6">
                  <div className="border border-gray-300 rounded-md p-3">
                    <label className="block text-sm text-gray-600 mb-2">
                      Profile Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`border-2 border-dashed rounded-md p-4 flex-grow cursor-pointer ${
                          previewImage
                            ? "border-indigo-300 bg-indigo-50"
                            : "border-gray-300"
                        }`}
                        onClick={() => document.getElementById("image").click()}
                      >
                        <div className="text-center">
                          <p className="text-sm text-gray-500">
                            {previewImage
                              ? "Change profile image"
                              : "Click to upload profile image"}
                          </p>
                        </div>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                      {previewImage && (
                        <div className="shrink-0">
                          <img
                            src={previewImage}
                            alt="Profile preview"
                            className="h-16 w-16 object-cover rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-200 flex justify-center items-center"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin mr-2 h-4 w-4 text-white"
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
                        Processing...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </>
            )}

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="flex items-center justify-center mt-6">
              <Link
                to="/"
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
