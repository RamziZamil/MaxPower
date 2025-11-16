import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Checkout = () => {
  const { cart, loading, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: user?.address || "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please log in to proceed to checkout", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Autofill form with user data when available
  useEffect(() => {
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        fullName: user.name || prevState.fullName,
        email: user.email || prevState.email,
        phone: user.phoneNumber || prevState.phone,
        address: user.address || prevState.address,
      }));
    }
  }, [user]);

  const calculateSubtotal = () => {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce(
      (total, item) => total + item.item.pricePerUnit * item.quantity,
      0
    );
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.07; // 7% tax
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 15; // Free shipping for orders over JOD 100
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart?.items?.length) {
      toast.error("Your cart is empty", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: cart.items.map((item) => ({
          item: item.item._id,
          quantity: item.quantity,
          price: item.item.pricePerUnit,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        paymentMethod,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shipping: calculateShipping(),
        total: calculateTotal(),
      };

      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };

      // Submit order
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        config
      );

      // Clear the cart after successful order
      await clearCart();

      toast.success("Order placed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${response.data.data._id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Failed to place order", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
          <p className="text-lg mb-6">
            Your cart is empty. Add some products before checkout.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Payment Method
                </h2>

                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <input
                      type="radio"
                      id="credit"
                      name="paymentMethod"
                      value="credit"
                      checked={paymentMethod === "credit"}
                      onChange={() => setPaymentMethod("credit")}
                      className="h-5 w-5 text-purple-600"
                    />
                    <label htmlFor="credit" className="text-gray-700">
                      Credit/Debit Card
                    </label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="radio"
                      id="cash"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="h-5 w-5 text-purple-600"
                    />
                    <label htmlFor="cash" className="text-gray-700">
                      Cash
                    </label>
                  </div>
                </div>

                {paymentMethod === "credit" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="cardName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required={paymentMethod === "credit"}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required={paymentMethod === "credit"}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="expDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        id="expDate"
                        name="expDate"
                        value={formData.expDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required={paymentMethod === "credit"}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="XXX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required={paymentMethod === "credit"}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 lg:hidden">
                <button
                  type="button"
                  className="w-full bg-gray-100 py-3 px-4 rounded-lg text-gray-700 font-medium mb-4 flex justify-between items-center"
                  onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
                >
                  <span>Order Summary ({cart.items.length} items)</span>
                  <span>JOD {calculateTotal().toFixed(2)}</span>
                </button>

                {orderSummaryOpen && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="max-h-60 overflow-y-auto mb-4">
                      {cart.items.map((item) => (
                        <div
                          key={item.item._id}
                          className="flex items-center py-3 border-b border-gray-200"
                        >
                          <img
                            src={item.item.image}
                            alt={item.item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm font-medium">
                              {item.item.name}
                            </h4>
                            <p className="text-gray-600 text-xs">
                              JOD {item.item.pricePerUnit} x {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            JOD{" "}
                            {(item.item.pricePerUnit * item.quantity).toFixed(
                              2
                            )}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>JOD {calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (7%)</span>
                        <span>JOD {calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>JOD {calculateShipping().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-purple-600">
                          JOD {calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:from-blue-600 hover:to-purple-700 transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Complete Order - JOD ${calculateTotal().toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3 hidden lg:block">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Order Summary
              </h2>

              <div className="max-h-80 overflow-y-auto mb-6">
                {cart.items.map((item) => (
                  <div
                    key={item.item._id}
                    className="flex items-center py-3 border-b border-gray-200"
                  >
                    <img
                      src={item.item.image}
                      alt={item.item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium">{item.item.name}</h4>
                      <p className="text-gray-600 text-xs">
                        JOD {item.item.pricePerUnit} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      JOD {(item.item.pricePerUnit * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>JOD {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>JOD {calculateShipping().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>JOD {calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>JOD {calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-blue-500 mt-0.5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-blue-800">
                    {calculateShipping() === 0
                      ? "Your order qualifies for free shipping!"
                      : `Add JOD ${(100 - calculateSubtotal()).toFixed(
                          2
                        )} more to get free shipping.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
