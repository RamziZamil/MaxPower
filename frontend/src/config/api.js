// API Configuration
// This file centralizes all API endpoints and base URL configuration

// Get base URL - VITE_API_URL should be the full API domain (e.g., https://api.maxpowerjo.com)
// For production, it will be set in .env.production
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // If VITE_API_URL is set, use it (should be full domain like https://api.maxpowerjo.com)
    return envUrl;
  }
  // Development fallback
  return 'http://localhost:5000';
};

const API_BASE_URL = getBaseUrl();

// Helper to construct full API endpoint URLs
const getApiUrl = (path) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Ensure path starts with /api
  const apiPath = cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`;
  return `${API_BASE_URL}${apiPath}`;
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: getApiUrl('/auth/login'),
  REGISTER: getApiUrl('/auth/register'),
  LOGOUT: getApiUrl('/auth/logout'),
  PROFILE: getApiUrl('/users/profile'),
  
  // Products
  ITEMS: getApiUrl('/items'),
  ITEM_BY_ID: (id) => getApiUrl(`/items/${id}`),
  ITEMS_BY_CATEGORY: getApiUrl('/items/category'),
  
  // Cart
  CART: getApiUrl('/cart'),
  ADD_TO_CART: getApiUrl('/cart/add'),
  UPDATE_CART: getApiUrl('/cart/update-quantity'),
  REMOVE_FROM_CART: (itemId) => getApiUrl(`/cart/remove/${itemId}`),
  CLEAR_CART: getApiUrl('/cart/clear'),
  
  // Orders
  ORDERS: getApiUrl('/orders'),
  ORDER_BY_ID: (id) => getApiUrl(`/orders/${id}`),
  CREATE_ORDER: getApiUrl('/orders'),
  MY_ORDERS: getApiUrl('/orders/myorders'),
  
  // Users
  USERS: getApiUrl('/users'),
  USER_BY_ID: (id) => getApiUrl(`/users/${id}`),
  
  // Contact
  CONTACT_MESSAGES: getApiUrl('/contact-messages'),
  CONTACT_MESSAGE_STATUS: (id) => getApiUrl(`/contact-messages/${id}/status`),
  CONTACT_MESSAGE_DELETE: (id) => getApiUrl(`/contact-messages/${id}`),
  
  // Admin
  ADMIN_USERS: getApiUrl('/admin/users'),
  ADMIN_PRODUCTS: getApiUrl('/admin/items'),
  ADMIN_ORDERS: getApiUrl('/admin/orders'),
  ADMIN_MESSAGES: getApiUrl('/admin/messages'),
};

export default API_BASE_URL;

