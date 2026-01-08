import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const StructuredData = ({ product, organization }) => {
  const location = useLocation();

  useEffect(() => {
    // Remove existing structured data
    const existingScript = document.getElementById("structured-data");
    if (existingScript) {
      existingScript.remove();
    }

    const baseUrl = "https://maxpower.com";
    let structuredData = {};

    // Organization Schema (for all pages)
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "MaxPower",
      url: baseUrl,
      logo: `${baseUrl}/logoMaxPower.png`,
      description:
        "Premium cables and chargers for all your devices. Fast charging, durable design, and reliable performance.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Amman",
        addressCountry: "Jordan",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+962-790816631",
        contactType: "Customer Service",
        email: "info@maxpower.com",
      },
      sameAs: [
        // Add social media links if available
      ],
    };

    // Product Schema (for product detail pages)
    if (product && location.pathname.includes("/products/")) {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || `${product.name} - Premium cable from MaxPower`,
        image: product.image || `${baseUrl}/logoMaxPower.png`,
        brand: {
          "@type": "Brand",
          name: "MaxPower",
        },
        category: product.category || "Electronics",
        offers: {
          "@type": "Offer",
          url: `${baseUrl}${location.pathname}`,
          priceCurrency: "JOD",
          price: product.price || product.pricePerUnit || "0",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "MaxPower",
          },
        },
        aggregateRating: product.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount || 1,
            }
          : {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "120",
            },
      };
    } else if (location.pathname === "/") {
      // Website Schema for homepage
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "MaxPower",
        url: baseUrl,
        description:
          "Premium cables and chargers for all your devices. Fast charging, durable design, and reliable performance.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/products?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      };
    } else {
      // Default: Organization schema
      structuredData = organizationSchema;
    }

    // Add organization schema alongside other schemas
    const schemas = [structuredData];
    if (product && location.pathname.includes("/products/")) {
      schemas.push(organizationSchema);
    }

    // Create script element with structured data
    const script = document.createElement("script");
    script.id = "structured-data";
    script.type = "application/ld+json";
    script.text = JSON.stringify(
      schemas.length === 1 ? schemas[0] : schemas
    );
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("structured-data");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [product, location.pathname]);

  return null;
};

export default StructuredData;

