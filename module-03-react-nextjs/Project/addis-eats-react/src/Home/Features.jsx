// src/Home/Features.jsx
import React from 'react';

export default function Features() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: "Fast Delivery",
      desc: "Fresh, hot gourmet meals delivered swiftly to your doorstep.",
      link: "Order Now"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      title: "Premium Recipes",
      desc: "Crafted by master chefs using only the finest seasonal ingredients.",
      link: "Learn More"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      title: "Made with Passion",
      desc: "Every plate is artfully arranged for a memorable dining experience.",
      link: "View Options"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v12" />
          <path d="M6 8c0 3.3 2.7 6 6 6s6-2.7 6-6" />
          <path d="M8 14v6" />
          <path d="M16 14v6" />
        </svg>
      ),
      title: "Refreshing Drinks",
      desc: "Quench your thirst with our selection of classic sodas and crisp, refreshing beverages.",
      link: "See Drinks"
    }
  ];

  return (
    <div className="features-wrap">
      <div className="features">
        {features.map((feature, index) => (
          <div className="feature" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
            <a href="#menu">{feature.link}</a>
          </div>
        ))}
      </div>
    </div>
  );
}