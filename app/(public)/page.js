import Hero from "@/components/sections/Hero";
import Navbar from "@/components/Navbar";
import ShapeSelector from "@/components/sections/ShapeSelector";
import CategoryCarousel from "@/components/sections/CategoryCarousel";
import OurWorks from "@/components/sections/OurWorks";
import NewCollection from "@/components/sections/NewCollection";
import WatchOnHands from "@/components/sections/WatchOnHands";
import BrandsAndTestimonials from "@/components/sections/BrandsAndTestimonials";
import CtaNewsletter from "@/components/sections/CtaNewsletter";

export default function Home() {
  return (
    <main className="home-page">
      <Navbar variant="hero" />
      <Hero />
      <ShapeSelector />
      <CategoryCarousel />
      <OurWorks />
      <NewCollection />
      <WatchOnHands />
      <BrandsAndTestimonials />
      <CtaNewsletter />
    </main>
  );
}

