import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./AuthContext";

// Pages
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import Services from "./Pages/Services";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Footer from "./Components/Footer";
import UserProfile from "./Pages/UserProfile";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Components/Cart";
import Checkout from "./Pages/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminUsers from "./Pages/Admin/Users";
import AdminProducts from "./Pages/Admin/Products";
import AdminOrders from "./Pages/Admin/Orders";
import ContactMessages from "./Pages/Admin/ContactMessages";
import ProductDetails from "./Pages/ProductDetails";

function App() {
  const location = useLocation();
  const hideNavbarFooterRoutes = [
    "/login",
    "/signup",
    "/Signup",
    "/Login",
    "/admin",
    "/admin/users",
    "/admin/products",
    "/admin/orders",
    "/admin/messages",
  ];
  const showNavbarFooter = !hideNavbarFooterRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="App">
            {showNavbarFooter && <Navbar />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/messages" element={<ContactMessages />} />
              <Route
                path="/order-confirmation/:orderId"
                element={<OrderConfirmation />}
              />
              <Route path="/products/:id" element={<ProductDetails />} />
            </Routes>
            {showNavbarFooter && <Footer />}
            <ToastContainer />
          </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
