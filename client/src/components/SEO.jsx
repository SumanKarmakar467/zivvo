import { Helmet } from "react-helmet-async";

const SITE_NAME = "Zivvo";
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://zivvo-six.vercel.app";
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;
const DEFAULT_DESCRIPTION = "Zivvo - premium e-commerce experience. Shop the latest products in cosmic style.";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  product = null,
  noIndex = false
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images?.[0] || image,
        sku: product._id,
        brand: { "@type": "Brand", name: product.brand || SITE_NAME },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "INR",
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: canonicalUrl
        },
        aggregateRating: product.totalReviews > 0
          ? {
              "@type": "AggregateRating",
              ratingValue: product.averageRating,
              reviewCount: product.totalReviews
            }
          : undefined
      }
    : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {productJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(productJsonLd)}
        </script>
      )}
    </Helmet>
  );
}
