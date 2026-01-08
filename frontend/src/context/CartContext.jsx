import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { API_ENDPOINTS } from "../config/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    };
  };

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        API_ENDPOINTS.CART,
        getAuthConfig()
      );
      setCart(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.response?.data?.message || "Error fetching cart");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    if (!isAuthenticated) {
      console.log("User is not authenticated");
      return { success: false, message: "Please login to add items to cart" };
    }

    try {
      console.log("Adding to cart:", { itemId, quantity });
      console.log("Auth config:", getAuthConfig());

      const response = await axios.post(
        API_ENDPOINTS.ADD_TO_CART,
        { itemId, quantity },
        getAuthConfig()
      );

      console.log("Cart response:", response.data);
      setCart(response.data.data);
      return { success: true };
    } catch (err) {
      console.error("Error adding to cart:", err);
      console.error("Response data:", err.response?.data);
      return {
        success: false,
        message: err.response?.data?.message || "Error adding to cart",
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) {
      return { success: false, message: "Please login to update your cart" };
    }

    try {
      const response = await axios.put(
        API_ENDPOINTS.UPDATE_CART,
        { itemId, quantity },
        getAuthConfig()
      );
      setCart(response.data.data);
      return { success: true };
    } catch (err) {
      console.error("Error updating cart:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Error updating cart",
      };
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) {
      return {
        success: false,
        message: "Please login to remove items from cart",
      };
    }

    try {
      const response = await axios.delete(
        API_ENDPOINTS.REMOVE_FROM_CART(itemId),
        getAuthConfig()
      );
      setCart(response.data.data);
      return { success: true };
    } catch (err) {
      console.error("Error removing from cart:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Error removing from cart",
      };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      return { success: false, message: "Please login to clear your cart" };
    }

    try {
      const response = await axios.delete(
        API_ENDPOINTS.CLEAR_CART,
        getAuthConfig()
      );
      setCart(response.data.data);
      return { success: true };
    } catch (err) {
      console.error("Error clearing cart:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Error clearing cart",
      };
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
