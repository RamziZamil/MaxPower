import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { name: "All Products", to: "/products" },
      { name: "New Arrivals", to: "/products" },
      { name: "Best Sellers", to: "/products" },
      { name: "Brands", to: "/products" },
      { name: "Discounts", to: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", to: "/about" },
      { name: "Our Vision", to: "/about" },
      { name: "Partners", to: "/about" },
      { name: "Careers", to: "/about" },
      { name: "Press", to: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "FAQ", to: "/contact" },
      { name: "Shipping & Returns", to: "/contact" },
      { name: "Contact Us", to: "/contact" },
      { name: "Terms & Conditions", to: "/contact" },
      { name: "Privacy Policy", to: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-12 overflow-hidden">
      {/* Gradient background to match hero section */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3b2fa7] to-[#7b2ff2] opacity-95"></div>

      {/* Main content */}
      <div className="container relative mx-auto px-4">
        {/* Top section with brand and columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12 text-white">
          {/* Brand column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold">
              <span className="text-white">Freedom</span>
              <span className="text-pink-400">Road</span>
            </h3>
            <p className="text-white/80">
              Discover a curated collection of premium products from us.
            </p>
            <div className="flex space-x-3 pt-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-400 hover:text-white transition-all duration-300"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Links columns */}
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-5">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.to}
                      className="hover:text-pink-300 transition-colors flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-1 bg-pink-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright section */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/70">
          <p className="mb-2">
            © {new Date().getFullYear()} FreedomRoad. All rights reserved.
          </p>
          <p>Connecting quality products with discerning customers</p>
        </div>
      </div>
    </footer>
  );
}
