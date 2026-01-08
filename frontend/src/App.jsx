import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SEO from "./Components/SEO";
import StructuredData from "./Components/StructuredData";
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
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsAndConditions from "./Pages/TermsAndConditions";

// ScrollToTop component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

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

  // SEO configuration based on route
  const getSEOConfig = () => {
    const baseUrl = "https://maxpower.com";
    const configs = {
      "/": {
        title: "MaxPower - Premium Cables & Chargers | Fast Charging Solutions",
        description:
          "Discover premium quality USB-C cables, Lightning cables, wireless chargers, and power adapters. Fast charging, durable design, and reliable performance for all your devices. Shop now at MaxPower.",
        keywords:
          "premium cables, USB-C cables, Lightning cables, wireless chargers, power adapters, fast charging, charging cables, phone chargers, MaxPower, Jordan",
      },
      "/products": {
        title: "Premium Cables & Chargers | Shop All Products | MaxPower",
        description:
          "Browse our complete collection of premium cables and chargers. USB-C cables, Lightning cables, wireless chargers, and power adapters. Fast shipping and quality guarantee.",
        keywords:
          "buy cables, USB-C cables online, Lightning cables, wireless chargers, power adapters, charging accessories, MaxPower products",
      },
      "/about": {
        title: "About MaxPower - Premium Cables & Chargers | Our Story",
        description:
          "Learn about MaxPower, your trusted source for premium cables and chargers. Discover our mission, values, and commitment to quality charging solutions.",
        keywords:
          "about MaxPower, cable company, charging solutions, company history, MaxPower team",
      },
      "/contact": {
        title: "Contact MaxPower - Get in Touch | Customer Support",
        description:
          "Contact MaxPower for customer support, product inquiries, or business partnerships. We're here to help with all your cable and charger needs.",
        keywords:
          "contact MaxPower, customer support, product inquiries, MaxPower contact, support",
      },
      "/privacy-policy": {
        title: "Privacy Policy | MaxPower",
        description:
          "Read MaxPower's privacy policy to understand how we collect, use, and protect your personal information.",
        keywords: "privacy policy, data protection, MaxPower privacy",
      },
      "/terms-and-conditions": {
        title: "Terms & Conditions | MaxPower",
        description:
          "Review MaxPower's terms and conditions for using our website and purchasing our products.",
        keywords: "terms and conditions, MaxPower terms, legal",
      },
    };

    return (
      configs[location.pathname] || {
        title: "MaxPower - Premium Cables & Chargers",
        description:
          "Discover premium quality cables and chargers for all your devices at MaxPower.",
        keywords: "premium cables, chargers, MaxPower",
      }
    );
  };

  const seoConfig = getSEOConfig();

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="App">
            <SEO
              title={seoConfig.title}
              description={seoConfig.description}
              keywords={seoConfig.keywords}
            />
            <StructuredData />
            <ScrollToTop />
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
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            </Routes>
            {showNavbarFooter && <Footer />}
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
