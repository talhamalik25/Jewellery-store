import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar variant="hero" />
      <CartDrawer />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
