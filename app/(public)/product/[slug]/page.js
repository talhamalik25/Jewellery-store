import ProductDetails from "@/components/ProductDetails";

function titleFromSlug(slug = "") {
  const name = String(slug).replace(/-[a-f0-9]{6}$/i, "").split("-").filter(Boolean).map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
  return name || "Considered Jewellery";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const name = titleFromSlug(slug);
  const description = `Discover ${name} from Atelier & Co. Thoughtful jewellery for all the days that make a life.`;
  return {
    title: `${name} | Atelier & Co.`,
    description,
    openGraph: {
      title: `${name} | Atelier & Co.`,
      description,
      images: [{ url: "/images/hero/gemstone-ring.webp", alt: `${name} by Atelier & Co.` }],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
}
