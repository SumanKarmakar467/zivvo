import { Helmet } from "react-helmet-async";
import SEO from "./SEO";

export default function PageSeo({ title = "Zivvo | Indian E-commerce Marketplace", description = "Shop curated Indian products on Zivvo with secure checkout, seller tools, and fast discovery." }) {
  if (title.includes("|")) {
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
    );
  }

  return <SEO title={title} description={description} />;
}

export function LegacyPageSeo({ title = "Zivvo | Indian E-commerce Marketplace", description = "Shop curated Indian products on Zivvo with secure checkout, seller tools, and fast discovery." }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}
