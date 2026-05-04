import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const categories = ['All', 'Ethnic Wear', 'Formal', 'Casual', 'Wedding', 'Party Wear', 'Celebrity Looks', 'Donate'];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { cartCount, setCartOpen } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setMenuOpen(false), [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/rent?search=${encodeURIComponent(search.trim())}`);
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === 'Donate') navigate('/donate');
    else if (cat === 'Celebrity Looks') navigate('/celebrity-style');
    else navigate(cat === 'All' ? '/rent' : `/rent?category=${encodeURIComponent(cat)}`);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/rent', label: 'Rent', icon: '👗' },
    { to: '/celebrity-style', label: 'Celebrity', icon: '⭐' },
    { to: '/orders', label: 'Orders', icon: '📦' },
    { to: '/donate', label: 'Donate', icon: '♻️' },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner container">
          <Link to="/" className="navbar__logo">
            <div className="navbar__logo-icon">✦</div>
            <span className="navbar__logo-text">ReWear<span>Hub</span></span>
          </Link>

          <form className="navbar__search" onSubmit={handleSearch}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search clothes, styles, occasions..." value={search} onChange={e => setSearch(e.target.value)} />
          </form>

          <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
            {navLinks.map(({ to, label, icon }) => (
              <li key={to}>
                <Link to={to} className={`navbar__link ${location.pathname === to ? 'active' : ''}`}>
                  <span>{icon}</span><span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button className="navbar__cart-btn" onClick={() => setCartOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span>Cart</span>
              {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
            </button>

            {user ? (
              <div className="navbar__user">
                <Link to="/dashboard" className="navbar__user-btn">
                  <div className="navbar__avatar">{user.name?.[0]}</div>
                  <span>{user.name?.split(' ')[0]}</span>
                </Link>
                <button className="btn btn-ghost btn-sm" onClick={logout} style={{ color: '#f43397', fontWeight: 700 }}>Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
            <button className="navbar__hamburger" onClick={() => setMenuOpen(m => !m)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Category Strip */}
      <div className="category-strip">
        <div className="category-strip__inner">
          {categories.map(cat => (
            <button key={cat} className={`category-strip__btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategory(cat)}>
              {cat === 'Celebrity Looks' ? '⭐ ' : ''}{cat}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
