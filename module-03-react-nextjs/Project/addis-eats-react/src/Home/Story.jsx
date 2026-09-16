import { Link } from "react-router-dom";

export default function Story() {
  return (
    <section className="story" id="story">
      <div className="story-images">
        <div className="img-main">
          <img src="/images/cheif.jpg" alt="Chef preparing a dish" />
        </div>
        <div className="img-sub">
          <img src="/images/spices.jpg" alt="Spices" />
        </div>
        <div className="badge serif">Est. 2026</div>
      </div>

      <div className="story-copy">
        <div className="eyebrow">Our Culinary Journey</div>
        <h2 className="serif">
          Where Elegance
          <br />
          Meets Flavor
        </h2>
        <p>
          Royale Bistro was born from a passion for exceptional cuisine and
          gracious hospitality. We blend classic techniques with modern
          creativity to create dishes that delight the senses.
        </p>
        <div className="story-quote">
          "Dining is not just about eating; it is an art form meant to be
          shared, savored, and remembered."
        </div>
        <Link to="/menu" className="btn-outline">
          Discover Menu
        </Link>
      </div>
    </section>
  );
}