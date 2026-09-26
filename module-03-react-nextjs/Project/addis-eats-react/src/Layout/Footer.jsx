import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer>
      <div className="footer-grid">
        {/* BRAND */}
        <div>
          <Link to="/" className="brand serif">
            <img
              src="./public/images/royal-bistro-logo.png"
              alt=""
              className="brand-logo"
              aria-hidden="true"
            />
            Royale <span>Bistro</span>
          </Link>

          <p className="footer-intro">
            Elevating everyday dining with world-class flavors, exceptional
            service, and a truly luxurious atmosphere.
          </p>

          <div className="socials">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="social-icon"
            >
              <svg viewBox="6 4 11 20" fill="currentColor">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-2.796c0-2.454 1.492-3.793 3.692-3.793 1.054 0 1.958.078 2.222.113v2.578h-1.524c-1.194 0-1.424.567-1.424 1.399v1.998h3.019l-.393 3.667h-2.626v7.98H9.101z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="social-icon"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* QUICK NAVIGATION */}
        <div>
          <h4>Quick Navigation</h4>
          <Link to="/">Home</Link>
          <Link to="/#story">Our Story</Link>
          <Link to="/menu">Dining Menu</Link>
          <Link to="/Order-History">Order History</Link>
        </div>

        {/* OPENING HOURS */}
        <div>
          <h4>Opening Hours</h4>
          <div className="hours-row">
            <span>Mon – Thu</span>
            <span>11:00 AM – 10:00 PM</span>
          </div>
          <div className="hours-row">
            <span>Fri – Sat</span>
            <span>11:00 AM – 11:30 PM</span>
          </div>
          <div className="hours-row">
            <span>Sunday</span>
            <span>12:00 PM – 9:30 PM</span>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h4>Newsletter</h4>
          <p>Subscribe for seasonal menu updates and exclusive dining events.</p>
          <form className="newsletter-input" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe">
              →
            </button>
          </form>
          {subscribed && (
            <p className="subscribe-success">Thank you! You're subscribed.</p>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Royale Bistro. All rights reserved.</span>
        <div className="links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <span>VISA · MC · AMEX</span>
      </div>
    </footer>
  );
}