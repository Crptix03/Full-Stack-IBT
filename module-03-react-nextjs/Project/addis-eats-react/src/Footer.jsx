export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="brand serif" style={{ fontSize: "18px", marginBottom: "12px" }}>
            Royale <span style={{ color: "var(--gold)" }}>Bistro</span>
          </div>
          <p>
            Elevating everyday dining with world-class flavors, exceptional
            service, and a truly luxurious atmosphere.
          </p>
          <div className="socials">
            <a href="#" aria-label="Facebook" className="social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            </a>
            <a href="#" aria-label="Instagram" className="social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
            </a>
          </div>
        </div>

        <div>
          <h4>QUICK NAVIGATION</h4>
          <a href="#">Home</a>
          <a href="#">Our Story</a>
          <a href="#">Dining Menu</a>
        </div>

        <div>
          <h4>OPENING HOURS</h4>
          <div className="hours-row"><span>Mon – Thu</span><span>11:00 AM – 10:00 PM</span></div>
          <div className="hours-row"><span>Fri – Sat</span><span>11:00 AM – 11:30 PM</span></div>
          <div className="hours-row"><span>Sunday</span><span>12:00 PM – 9:30 PM</span></div>
        </div>

        <div>
          <h4>NEWSLETTER</h4>
          <p>Subscribe for seasonal menu updates and exclusive dining events.</p>
          <div className="newsletter-input">
            <input type="text" placeholder="Your email address" />
            <button aria-label="Subscribe">→</button>
          </div>
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