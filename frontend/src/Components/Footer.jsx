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
      { name: "Terms & Conditions", to: "/terms-and-conditions" },
      { name: "Privacy Policy", to: "/privacy-policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-12 overflow-hidden">
      {/* Dark gray background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"></div>

      {/* Main content */}
      <div className="container relative mx-auto px-4">
        {/* Top section with brand and columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12">
          {/* Brand column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold">
              <span className="text-[#f46c00]">Max</span>
              <span className="text-white">Power</span>
            </h3>
            <p className="text-gray-300">
              Discover a curated collection of premium products from us.
            </p>
            <div className="flex space-x-3 pt-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-600/50 flex items-center justify-center hover:bg-[#f46c00] hover:text-white transition-all duration-300 text-gray-300"
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
              <h4 className="text-lg font-semibold mb-5 text-white">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-[#f46c00] transition-colors flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-1 bg-[#f46c00] rounded-full mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright section */}
        <div className="mt-12 pt-8 border-t border-gray-600 text-center text-gray-400">
          <p className="mb-2">
            © {new Date().getFullYear()} MaxPower. All rights reserved.
          </p>
          <p>Connecting quality products with discerning customers</p>
        </div>
      </div>
    </footer>
  );
}
