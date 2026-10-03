import Link from "next/link";

export default function Home() {
  return (
    <main className="reference-home">
      <section className="campaign-hero" aria-labelledby="campaign-title">
        <div className="campaign-image-placeholder" role="img" aria-label="Replaceable placeholder for the dark jewelry campaign photograph" />
        <header className="campaign-nav">
          <Link href="/" className="campaign-logo" aria-label="Zales home">ZALES</Link>
          <nav aria-label="Main navigation">
            <Link href="/shop">Shop</Link>
            <Link href="/shop">Collections</Link>
            <Link href="/shop">Our story</Link>
          </nav>
          <div className="campaign-tools">
            <Link href="/shop" aria-label="Search">⌕</Link>
            <Link href="/cart" aria-label="Shopping bag">♧</Link>
            <Link href="/login" className="campaign-account">Sign in</Link>
          </div>
        </header>

        <div className="campaign-copy">
          <h1 id="campaign-title">You deserve the most<br />unique jewelry</h1>
          <div className="campaign-actions">
            <Link href="/shop" className="campaign-primary">Shop now <span aria-hidden="true">↗</span></Link>
            <Link href="/shop" className="campaign-secondary">Explore collection</Link>
          </div>
        </div>

        <div className="campaign-side-progress" aria-hidden="true"><span>01</span><i /><span>04</span></div>
        <div className="campaign-slider-controls" aria-hidden="true"><span>‹</span><span>›</span></div>

        <div className="campaign-promos">
          <Link href="/shop" className="campaign-promo campaign-promo-design">
            <span className="campaign-promo-art" aria-hidden="true"><i /><b /></span>
            <span className="campaign-promo-copy"><small>MADE FOR YOU</small><strong>Design your own<br />gemstone ring</strong></span>
            <span className="campaign-promo-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link href="/shop" className="campaign-promo campaign-promo-community">
            <span className="campaign-promo-copy"><small>DISCOVER THE COLLECTION</small></span>
            <span className="campaign-rating"><strong>4.8K</strong><i aria-hidden="true"><b /><b /><b /></i></span>
          </Link>
        </div>
      </section>
    </main>
  );
}

