import Link from "next/link";
import HomeHeader from "@/components/HomeHeader";

export default function Home() {
  return (
    <main className="home-page">
      <HomeHeader />

      <section className="home-hero" aria-labelledby="home-hero-title">
        {/* Replace this image slot with the original campaign photograph when available. */}
        <div className="home-hero-image-placeholder" role="img" aria-label="Dark, warm campaign image placeholder" />
        <div className="home-hero-shade" />

        <div className="home-hero-copy">
          <p className="home-hero-kicker">FINE JEWELRY · MADE TO BE YOURS</p>
          <h1 id="home-hero-title">You deserve the most<br />unique jewelry.</h1>
          <p className="home-hero-support">Discover pieces that feel unmistakably you.</p>
          <div className="home-hero-actions">
            <Link href="/shop" className="home-hero-primary">Shop now <span aria-hidden="true">↗</span></Link>
            <Link href="/shop" className="home-hero-secondary">Explore collection</Link>
          </div>
        </div>

        <div className="home-hero-side-detail" aria-hidden="true"><span>SCROLL TO DISCOVER</span><i /></div>
        <div className="home-hero-controls" aria-hidden="true"><span>01</span><i /><span>04</span><b>⌕</b><b>↗</b></div>

        <div className="home-hero-promos">
          <Link href="/shop" className="home-promo home-promo-design">
            <span className="home-promo-emblem" aria-hidden="true">✧</span>
            <span className="home-promo-copy"><small>MADE FOR YOU</small><strong>Design your own<br />gemstone ring</strong></span>
            <span className="home-promo-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link href="/shop" className="home-promo home-promo-community">
            <span className="home-promo-copy"><small>LOVED BY OUR COMMUNITY</small><strong>Discover our most-loved pieces</strong></span>
            <span className="home-promo-rating"><b>4.8K</b><i aria-hidden="true">✦ ✦ ✦</i></span>
          </Link>
        </div>
      </section>
    </main>
  );
}
