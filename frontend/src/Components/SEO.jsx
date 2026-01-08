import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SEO = ({ title, description, keywords, image, type = "website" }) => {
  const location = useLocation();
  const baseUrl = "https://maxpower.com";

  useEffect(() => {
    // Update document title
    document.title = title || "MaxPower - Premium Cables & Chargers";

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Primary Meta Tags
    updateMetaTag("title", title || "MaxPower - Premium Cables & Chargers");
    updateMetaTag(
      "description",
      description ||
        "Discover premium quality USB-C cables, Lightning cables, wireless chargers, and power adapters. Fast charging, durable design, and reliable performance for all your devices."
    );
    if (keywords) {
      updateMetaTag(
        "keywords",
        keywords ||
          "premium cables, USB-C cables, Lightning cables, wireless chargers, power adapters, fast charging, charging cables, phone chargers, MaxPower, Jordan"
      );
    }

    // Open Graph Tags
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:url", `${baseUrl}${location.pathname}`, true);
    updateMetaTag(
      "og:title",
      title || "MaxPower - Premium Cables & Chargers",
      true
    );
    updateMetaTag(
      "og:description",
      description ||
        "Discover premium quality USB-C cables, Lightning cables, wireless chargers, and power adapters. Fast charging, durable design, and reliable performance.",
      true
    );
    updateMetaTag(
      "og:image",
      image || `${baseUrl}/logoMaxPower.png`,
      true
    );

    // Twitter Card Tags
    updateMetaTag("twitter:card", "summary_large_image", true);
    updateMetaTag("twitter:url", `${baseUrl}${location.pathname}`, true);
    updateMetaTag(
      "twitter:title",
      title || "MaxPower - Premium Cables & Chargers",
      true
    );
    updateMetaTag(
      "twitter:description",
      description ||
        "Discover premium quality USB-C cables, Lightning cables, wireless chargers, and power adapters.",
      true
    );
    updateMetaTag(
      "twitter:image",
      image || `${baseUrl}/logoMaxPower.png`,
      true
    );

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${baseUrl}${location.pathname}`);
  }, [title, description, keywords, image, type, location.pathname]);

  return null;
};

export default SEO;

