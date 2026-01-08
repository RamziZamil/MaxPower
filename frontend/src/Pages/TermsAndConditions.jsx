import React from "react";
import { motion } from "framer-motion";
import { FaFileContract, FaGavel, FaShoppingCart, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const TermsAndConditions = () => {
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
              <FaFileContract className="w-4 h-4 text-[#f46c00]" />
              <span className="text-xs font-medium text-gray-200">
                Legal Terms
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="block text-gray-200">Terms &</span>
              <span className="block bg-gradient-to-r from-[#f46c00] via-[#ff8c42] to-[#ffa366] bg-clip-text text-transparent">
                Conditions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our website and services.
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
                <FaFileContract className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Agreement to Terms</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed text-lg">
              By accessing and using the MaxPower website, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Use of Website */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Use of Website</h2>
            </div>
            <div className="space-y-4">
              <p className="text-[#b5b3b3] leading-relaxed">
                You may use our website for lawful purposes only. You agree not to use the website:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#b5b3b3] ml-4">
                <li>In any way that violates any applicable national or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material</li>
                <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
                <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the website</li>
              </ul>
            </div>
          </section>

          {/* Products and Services */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center">
                <FaShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Products and Services</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Information</h3>
                <p className="text-[#b5b3b3] leading-relaxed">
                  We strive to provide accurate product descriptions and images. However, we do not warrant that 
                  product descriptions or other content on this site is accurate, complete, reliable, current, 
                  or error-free. If a product offered by us is not as described, your sole remedy is to return it 
                  in unused condition.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pricing</h3>
                <p className="text-[#b5b3b3] leading-relaxed">
                  All prices are displayed in the currency specified on the website and are subject to change without 
                  notice. We reserve the right to modify prices at any time. However, if you have already placed an 
                  order, the price you paid will be honored.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Availability</h3>
                <p className="text-[#b5b3b3] leading-relaxed">
                  We reserve the right to limit the quantity of items purchased per person, per household, or per order. 
                  We also reserve the right to discontinue any product at any time. We do not warrant that the quality 
                  of any products, services, information, or other material purchased or obtained by you will meet your 
                  expectations.
                </p>
              </div>
            </div>
          </section>

          {/* Orders and Payment */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Orders and Payment</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Acceptance</h3>
                <p className="text-[#b5b3b3] leading-relaxed">
                  Your order is an offer to purchase products from us. We reserve the right to accept or reject your 
                  order for any reason, including product availability, errors in the description or price of the product, 
                  or error in your order.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Terms</h3>
                <p className="text-[#b5b3b3] leading-relaxed">
                  Payment must be received by us before we ship your order. We accept various payment methods as displayed 
                  on our website. By providing payment information, you represent and warrant that you are authorized 
                  to use the payment method provided.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping and Returns */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center">
                <FaShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Shipping and Returns</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Shipping</h3>
                <p className="text-[#b5b3b3] leading-relaxed">
                  We will arrange for shipment of the products to you. Shipping costs and delivery times will be 
                  displayed during checkout. Risk of loss and title for products purchased from us pass to you upon 
                  delivery of the products to the carrier.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Returns and Refunds</h3>
                <p className="text-[#b5b3b3] leading-relaxed">
                  If you are not satisfied with your purchase, you may return it within the timeframe specified in 
                  our return policy. Items must be returned in their original condition and packaging. Refunds will 
                  be processed to the original payment method within a reasonable timeframe after we receive and inspect 
                  the returned items.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center">
                <FaGavel className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Intellectual Property</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed">
              The website and its original content, features, and functionality are owned by MaxPower and are protected 
              by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may 
              not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, 
              download, store, or transmit any of the material on our website without our prior written consent.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center">
                <FaExclamationTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Limitation of Liability</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed">
              In no event shall MaxPower, its directors, employees, partners, agents, suppliers, or affiliates, be liable 
              for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss 
              of profits, data, use, goodwill, or other intangible losses, resulting from your use of the website or services.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center">
                <FaGavel className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Indemnification</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed">
              You agree to defend, indemnify, and hold harmless MaxPower and its licensee and licensors, and their employees, 
              contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, 
              liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f46c00] to-[#ff8c42] flex items-center justify-center">
                <FaFileContract className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Changes to Terms</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is 
              material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a 
              material change will be determined at our sole discretion.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b5b3b3] to-[#9a9898] flex items-center justify-center">
                <FaGavel className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Governing Law</h2>
            </div>
            <p className="text-[#b5b3b3] leading-relaxed">
              These Terms shall be interpreted and governed by the laws of Jordan, without regard to its conflict of law 
              provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of 
              those rights.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-gradient-to-br from-[#f46c00]/10 to-gray-50 rounded-xl p-6 border border-[#f46c00]/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-[#b5b3b3] leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
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

export default TermsAndConditions;

