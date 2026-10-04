import WishlistContents from "@/components/WishlistContents";

export const metadata = {
  title: "Wishlist | Atelier & Co.",
  description: "Keep your favourite Atelier & Co. jewellery pieces close.",
  openGraph: { type: "website", title: "Wishlist | Atelier & Co.", description: "Your favourite pieces from Atelier & Co." },
};

export default function WishlistPage() {
  return <WishlistContents />;
}
