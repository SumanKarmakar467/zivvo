import { Helmet } from "react-helmet-async";

export default function PageSeo({ title = "Zivvo | Indian E-commerce Marketplace", description = "Shop curated Indian products on Zivvo with secure checkout, seller tools, and fast discovery." }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}
