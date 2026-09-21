export function setDocumentTitle(
  title: string,
  description?: string,
  url?: string
) {
  const fullTitle = title.includes("Cinemora")
    ? title
    : `${title} | Cinemora`;

  // Page title
  document.title = fullTitle;

  // Helper function to create/update meta tags
  const setMeta = (
    attribute: "name" | "property",
    key: string,
    content: string
  ) => {
    let meta = document.querySelector(
      `meta[${attribute}="${key}"]`
    ) as HTMLMetaElement | null;

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attribute, key);
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
  };

  const pageDescription =
    description ||
    "Cinemora is a movie discovery platform to explore trending, popular and top-rated movies.";

  // Standard SEO
  setMeta("name", "description", pageDescription);

  // Open Graph
  setMeta("property", "og:title", fullTitle);
  setMeta("property", "og:description", pageDescription);
  setMeta("property", "og:type", "website");

  // Current page URL
  const canonicalUrl = url || window.location.href;

  setMeta("property", "og:url", canonicalUrl);

  // Twitter/X
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", fullTitle);
  setMeta("name", "twitter:description", pageDescription);

  // Canonical URL
  let canonical = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", canonicalUrl);
}
