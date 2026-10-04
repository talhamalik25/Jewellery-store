import AccountProfile from "@/components/AccountProfile";

export const metadata = {
  title: "Profile | Atelier & Co.",
  description: "View your Atelier & Co. account details.",
  openGraph: { type: "website", title: "Profile | Atelier & Co.", description: "Your Atelier & Co. account details." },
};

export default function ProfilePage() {
  return <AccountProfile />;
}
