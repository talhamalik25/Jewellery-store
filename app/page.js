import Hero from "@/components/sections/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="home-page">
      <Navbar variant="hero" />
      <Hero />
    </main>
  );
}

