import Hero from "@/components/sections/Hero";
import Navbar from "@/components/Navbar";
import ShapeSelector from "@/components/sections/ShapeSelector";

export default function Home() {
  return (
    <main className="home-page">
      <Navbar variant="hero" />
      <Hero />
      <ShapeSelector />
    </main>
  );
}

