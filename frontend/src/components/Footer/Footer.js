import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__top">
      <div className="container footer__top-inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <div className="footer__logo-icon">✦</div>
            <span className="footer__logo-text">ReWear<span>Hub</span></span>
          </div>
          <p>India's favourite fashion rental platform. Rent stylish outfits, wear celebrity looks, and donate unused clothes.</p>
          <div className="footer__social">
            {[
              { icon: '📘', label: 'Facebook' },
              { icon: '📸', label: 'Instagram' },
              { icon: '🐦', label: 'Twitter' },
              { icon: '▶️', label: 'YouTube' },
            ].map(s => (
              <a key={s.label} href="#" className="footer__social-btn" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
          <div className="footer__app-badges">
            <div className="app-badge">
              <span>📱</span>
              <div>
                <small>Download on</small>
                <strong>App Store</strong>
              </div>
            </div>
            <div className="app-badge">
              <span>🤖</span>
              <div>
                <small>Get it on</small>
                <strong>Google Play</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__links-grid">
          <div className="footer__col">
            <h4>Explore</h4>
            <Link to="/rent">Rent Clothes</Link>
            <Link to="/celebrity-style">Celebrity Style</Link>
            <Link to="/donate">Donate Clothes</Link>
            <Link to="/orders">Track Orders</Link>
            <Link to="/dashboard">My Account</Link>
          </div>
          <div className="footer__col">
            <h4>Categories</h4>
            <Link to="/rent?category=ethnic">Ethnic Wear</Link>
            <Link to="/rent?category=formal">Formal Wear</Link>
            <Link to="/rent?occasion=wedding">Wedding</Link>
            <Link to="/rent?occasion=party">Party Wear</Link>
            <Link to="/rent?category=casual">Casual</Link>
          </div>
          <div className="footer__col">
            <h4>Customer Care</h4>
            <a href="#">Help Center</a>
            <a href="#">Size Guide</a>
            <a href="#">Return Policy</a>
            <a href="#">Track My Order</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Blog</a>
            <a href="#">Partners</a>
          </div>
        </div>
      </div>
    </div>

    <div className="footer__trust">
      <div className="container footer__trust-inner">
        {[
          { icon: '🔒', label: '100% Secure Payment' },
          { icon: '✅', label: 'Quality Guaranteed' },
          { icon: '🚚', label: 'Free Delivery' },
          { icon: '↩️', label: 'Easy Returns' },
          { icon: '💯', label: 'Verified Products' },
        ].map(t => (
          <div key={t.label} className="trust-badge">
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="footer__bottom">
      <div className="container footer__bottom-inner">
        <p>© 2024 ReWearHub. All rights reserved. Made with ❤️ in India</p>
        <div className="footer__bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
        <div className="footer__payments">
          {['💳', '🏦', '📱', '💵'].map((icon, i) => (
            <span key={i} className="payment-icon">{icon}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
