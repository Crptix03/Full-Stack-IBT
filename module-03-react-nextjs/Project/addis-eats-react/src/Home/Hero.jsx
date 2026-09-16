// src/Home/Hero.jsx
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      {/* LEFT — 2 stacked images */}
      <div className="hero-col hero-left">
        <img src="/images/hero1.jpg" alt="Signature Plated Dishes" className="img-a" />
        <img src="/images/hero3.jpg" alt="Chef's Specials" className="img-b" />
      </div>

      {/* CENTER — Copy and CTA */}
      <div className="hero-col hero-center">
        <span className="eyebrow">Order From Our Kitchen</span>
        <h1>
          Taste Royale <br />
          <em>Cuisine,</em> Delivered
        </h1>
        <div className="divider center"></div>
        <p>
          Experience the pinnacle of fine dining in the comfort of your own
          home. We craft every dish with premium, locally-sourced ingredients
          and meticulous attention to detail.
        </p>
        <Link to="/menu" className="btn filled">Order Now</Link>

        <div className="hero-badges">
          <span className="badge-pill">30 MIN DELIVERY</span>
          <span className="badge-pill">HANDCRAFTED DAILY</span>
        </div>
      </div>

      {/* RIGHT — 2 stacked images */}
      <div className="hero-col hero-right">
        <img src="/images/hero2.jpg" alt="Wine & Dining" className="img-c" />
        <img src="/images/hero4.jpg" alt="Elegant Table Setting" className="img-d" />
      </div>
    </section>
  );
}