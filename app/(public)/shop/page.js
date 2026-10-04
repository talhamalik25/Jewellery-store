import ShopExperience from "@/components/ShopExperience";

export const metadata = {
  title: "Shop the Collection | Atelier & Co.",
  description: "Explore considered rings, earrings, necklaces and bracelets from Atelier & Co.",
  openGraph: {
    type: "website",
    title: "Shop the Collection | Atelier & Co.",
    description: "Explore considered jewellery, made for all the days that make a life.",
  },
};

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const category = typeof params?.category === "string" ? params.category : "";

  return <ShopExperience initialCategory={category} />;
}
