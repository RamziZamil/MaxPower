import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const WishlistContext = createContext();

// Create the provider component
export const WishlistProvider = ({ children }) => {
  // Initialize wishlist items from localStorage if available
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedItems = localStorage.getItem("wishlistItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add item to wishlist
  const addToWishlist = (item) => {
    if (!wishlistItems.some((wishlistItem) => wishlistItem.id === item.id)) {
      setWishlistItems([...wishlistItems, item]);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
  };

  // Check if item is in wishlist
  const isInWishlist = (itemId) => {
    return wishlistItems.some((item) => item.id === itemId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
