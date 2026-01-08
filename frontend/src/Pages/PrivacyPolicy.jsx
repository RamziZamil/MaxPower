import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaLock, FaUserShield, FaEye } from "react-icons/fa";

const PrivacyPolicy = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white py-20 px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-[#f46c00]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#f46c00]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[#f46c00]/20 backdrop-blur-md border border-[#f46c00]/30 rounded-full px-4 py-1.5 mb-6"
            >
              <FaShieldAlt className="w-4 h-4 text-[#f46c00]" />
              <span className="text-xs font-medium text-gray-200">
                Your Privacy Matters
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="block text-gray-200">Privacy</span>
              <span className="block bg-gradient-to-r from-[#f46c00] via-[#ff8c42] to-[#ffa366] bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We are committed to protecting your personal information and ensuring your privacy.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Last Updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <motion.div
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Introduction */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center">
                <FaEye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Introduction</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed text-lg">
              Welcome to MaxPower. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, disclose, and safeguard your information when you 
              visit our website and use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center">
                <FaUserShield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-[#b5b3b3] leading-relaxed">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-[#b5b3b3] ml-4">
                  <li>Register for an account on our website</li>
                  <li>Place an order for products or services</li>
                  <li>Subscribe to our newsletter or marketing communications</li>
                  <li>Contact us through our contact form or customer service</li>
                  <li>Participate in surveys, contests, or promotions</li>
                </ul>
                <p className="text-[#b5b3b3] leading-relaxed mt-4">
                  This information may include your name, email address, phone number, shipping address, 
                  billing information, and payment details.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Automatically Collected Information</h3>
                <p className="text-[#b5b3b3] leading-relaxed">
                  When you visit our website, we automatically collect certain information about your device, 
                  including information about your web browser, IP address, time zone, and some of the cookies 
                  that are installed on your device. We also collect information about the individual web pages 
                  you view and how you interact with our website.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center">
                <FaLock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#b5b3b3] ml-4">
              <li>To process and fulfill your orders and transactions</li>
              <li>To manage your account and provide customer support</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To improve our website, products, and services</li>
              <li>To detect and prevent fraud and unauthorized access</li>
              <li>To comply with legal obligations and enforce our terms</li>
              <li>To analyze website usage and trends</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Data Security</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, no method 
              of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee 
              absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center">
                <FaUserShield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#b5b3b3] ml-4">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Data portability (receive your data in a structured format)</li>
              <li>Withdraw consent at any time where we rely on consent</li>
            </ul>
            <p className="text-[#b5b3b3] leading-relaxed mt-4">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:info@maxpower.com" className="text-[#f46c00] hover:underline">
                info@maxpower.com
              </a>
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center">
                <FaLock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Cookies</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our website and hold certain 
              information. Cookies are files with a small amount of data which may include an anonymous unique identifier. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
              if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Third-Party Services</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed">
              Our website may contain links to third-party websites or services that are not owned or controlled 
              by MaxPower. We are not responsible for the privacy practices of these third parties. We encourage 
              you to review the privacy policies of any third-party services you access.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center">
                <FaEye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Changes to This Policy</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by posting 
              the new privacy policy on this page and updating the "Last Updated" date. You are advised to review 
              this privacy policy periodically for any changes.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-gradient-to-br from-[#f46c00]/10 to-gray-50 rounded-xl p-6 border border-[#f46c00]/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-[#b5b3b3] leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="space-y-2 text-[#b5b3b3]">
              <p>
                <strong className="text-gray-900">Email:</strong>{" "}
                <a href="mailto:info@maxpower.com" className="text-[#f46c00] hover:underline">
                  info@maxpower.com
                </a>
              </p>
              <p>
                <strong className="text-gray-900">Phone:</strong> +962 790816631
              </p>
              <p>
                <strong className="text-gray-900">Address:</strong> Amman, Jordan
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

