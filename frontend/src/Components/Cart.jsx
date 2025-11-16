import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash, ShoppingBag, Minus, Plus, ArrowRight } from "lucide-react";

const Cart = () => {
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart } =
    useCart();
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <ShoppingBag className="text-purple-600 mr-3" size={28} />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>
        <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg max-w-lg mx-auto text-center">
          <h2 className="text-xl font-semibold mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-8">
            You need to be logged in to view your cart and continue shopping.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-md"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <ShoppingBag className="text-purple-600 mr-3" size={28} />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 border-opacity-50 border-b-4"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <ShoppingBag className="text-purple-600 mr-3" size={28} />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <p className="font-medium">{error}</p>
          <p className="mt-2">
            Please try refreshing the page or sign in again.
          </p>
        </div>
      </div>
    );

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const result = await updateCartItem(itemId, newQuantity);
    if (!result.success) {
      setMessage(result.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (!result.success) {
      setMessage(result.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (!result.success) {
      setMessage(result.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce((total, cartItem) => {
      return total + cartItem.item.pricePerUnit * cartItem.quantity;
    }, 0);
  };

  const calculateSubtotal = (item) => {
    return (item.quantity * item.item.pricePerUnit).toFixed(2);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-center mb-8">
          <ShoppingBag className="text-purple-600 mr-3" size={28} />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        {message && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center">
              <span className="font-medium mr-2">Error:</span> {message}
            </div>
          </div>
        )}

        {!cart?.items?.length ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-100 p-4 rounded-full">
                <ShoppingBag className="text-purple-600" size={40} />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-md"
            >
              Browse Products <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">
                    Cart Items ({cart.items.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {cart?.items?.map((cartItem) => (
                    <div
                      key={cartItem.item._id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 mr-6 mb-4 sm:mb-0">
                          <img
                            src={cartItem.item.image}
                            alt={cartItem.item.name}
                            className="w-24 h-24 object-cover rounded-lg shadow-sm"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg mb-1">
                            {cartItem.item.name}
                          </h3>
                          <p className="text-purple-600 font-medium mb-4">
                            JOD {cartItem.item.pricePerUnit}
                          </p>

                          <div className="flex flex-wrap items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden mb-3 sm:mb-0">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    cartItem.item._id,
                                    cartItem.quantity - 1
                                  )
                                }
                                className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-1 font-medium">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    cartItem.item._id,
                                    cartItem.quantity + 1
                                  )
                                }
                                className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <div className="flex items-center">
                              <span className="font-medium mr-6">
                                JOD {calculateSubtotal(cartItem)}
                              </span>
                              <button
                                onClick={() =>
                                  handleRemoveItem(cartItem.item._id)
                                }
                                className="text-gray-500 hover:text-red-600 transition-colors p-1"
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={handleClearCart}
                    className="flex items-center text-gray-600 hover:text-red-600 transition-colors font-medium"
                  >
                    <Trash size={16} className="mr-2" />
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>JOD {calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-purple-600">
                      JOD {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-md flex items-center justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2" size={18} />
                </button>

                <div className="mt-6 text-center">
                  <Link
                    to="/products"
                    className="text-purple-600 hover:text-purple-800 transition-colors font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
