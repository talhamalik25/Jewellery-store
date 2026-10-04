import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar variant="hero" />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
