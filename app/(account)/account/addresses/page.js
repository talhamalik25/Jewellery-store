import AddressHistory from "@/components/AddressHistory";

export const metadata = {
  title: "Addresses | Atelier & Co.",
  description: "Review delivery addresses used for your Atelier & Co. orders.",
  openGraph: { type: "website", title: "Addresses | Atelier & Co.", description: "Review your Atelier & Co. delivery address history." },
};

export default function AddressesPage() {
  return <AddressHistory />;
}
