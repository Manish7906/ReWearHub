import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { mockProducts, mockCelebrityLooks } from '../../utils/mockData';
import './Home.css';

const banners = [
  { bg: 'linear-gradient(135deg,#f43397 0%,#9b59b6 100%)', emoji: '👗', tag: 'New Collection', title: 'Rent Stylish\nOutfits', sub: 'Starting at ₹149/day', btn: 'Shop Now', link: '/rent' },
  { bg: 'linear-gradient(135deg,#ff6b35 0%,#f43397 100%)', emoji: '⭐', tag: 'Celebrity Looks', title: 'Dress Like\nSRK', sub: 'Iconic Bollywood styles', btn: 'Explore', link: '/celebrity-style' },
  { bg: 'linear-gradient(135deg,#27ae60 0%,#3498db 100%)', emoji: '♻️', tag: 'Sustainability', title: 'Donate &\nEarn Points', sub: 'Up to 50 reward points', btn: 'Donate Now', link: '/donate' },
];

const categories = [
  { icon: '💍', label: 'Wedding', color: '#fde8f3', link: '/rent?occasion=wedding' },
  { icon: '🎉', label: 'Party', color: '#f3e9f8', link: '/rent?occasion=party' },
  { icon: '🏮', label: 'Festival', color: '#fff0eb', link: '/rent?occasion=festival' },
  { icon: '👔', label: 'Formal', color: '#e8f4fd', link: '/rent?category=formal' },
  { icon: '👕', label: 'Casual', color: '#e8f8ef', link: '/rent?category=casual' },
  { icon: '⭐', label: 'Celebrity', color: '#fff9e6', link: '/celebrity-style' },
];

const Home = () => {
  const navigate = useNavigate();
  const trending  = mockProducts.filter(p => p.trending).slice(0, 6);
  const newArr    = mockProducts.filter(p => !p.trending).slice(0, 4);
  const bridalPicks = mockProducts.filter(p => p.occasion === 'wedding').slice(0, 4);

  return (
    <div className="home">

      {/* ── Hero Banners ── */}
      <section className="home-hero">
        <div className="hero-banners">
          {banners.map((b, i) => (
            <div key={i} className="hero-banner" style={{ background: b.bg }}>
              <div className="hero-banner__content">
                <span className="hero-banner__tag">{b.tag}</span>
                <h1 className="hero-banner__title">
                  {b.title.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}
                </h1>
                <p className="hero-banner__sub">{b.sub}</p>
                <Link to={b.link} className="hero-banner__btn">{b.btn} →</Link>
              </div>
              <div className="hero-banner__emoji">{b.emoji}</div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="home-stats">
          {[
            { num: '50+', label: 'Outfits' },
            { num: '50K+', label: 'Happy Renters' },
            { num: '4.8★', label: 'Avg Rating' },
            { num: 'FREE', label: 'Delivery' },
          ].map(s => (
            <div key={s.label} className="home-stat">
              <span className="home-stat__num">{s.num}</span>
              <span className="home-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Offer Strip ── */}
      <div className="offer-strip">
        <div className="container offer-strip__inner">
          <span>🎉 New User? Get 20% off your first rental with code <strong>NEWRWH20</strong></span>
          <span className="offer-strip__sep">|</span>
          <span>🚚 FREE delivery on all orders</span>
          <span className="offer-strip__sep">|</span>
          <span>⭐ 50 reward points on every donation</span>
        </div>
      </div>

      {/* ── Shop by Category ── */}
      <section className="section-sm container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find the perfect outfit for every occasion</p>
          </div>
          <Link to="/rent" className="see-all-link">See All →</Link>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <button key={cat.label} className="category-pill" style={{ background: cat.color }}
              onClick={() => navigate(cat.link)}>
              <span className="category-pill__icon">{cat.icon}</span>
              <span className="category-pill__label">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Trending Banner ── */}
      <div className="trending-banner container">
        <div className="trending-banner__left">
          <span className="badge badge-pink">🔥 Hot Right Now</span>
          <h2>Trending<br />This Week</h2>
          <p>Most rented outfits loved by our community</p>
          <Link to="/rent" className="btn btn-primary" style={{ marginTop: 8 }}>Explore All →</Link>
        </div>
        <div className="trending-banner__right">
          {trending.slice(0, 3).map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="trending-mini">
              <img src={p.image} alt={p.name}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=60'; }} />
              <div>
                <p>{p.name}</p>
                <span className="trending-mini__brand">{p.brand}</span>
                <span className="trending-mini__price">₹{p.pricePerDay}/day</span>
                <span className="trending-mini__rating">★ {p.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Trending Products ── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">🔥 Trending Now</h2>
            <p className="section-subtitle">Most popular rentals this season</p>
          </div>
          <Link to="/rent" className="see-all-link">View All 50 →</Link>
        </div>
        <div className="product-grid">
          {trending.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Celebrity Strip ── */}
      <section className="celeb-strip">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title" style={{ color: 'white' }}>⭐ Shah Rukh Khan Looks</h2>
              <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>Recreate iconic Bollywood moments</p>
            </div>
            <Link to="/celebrity-style" className="btn btn-white btn-sm">See All Looks</Link>
          </div>
          <div className="celeb-cards">
            {mockCelebrityLooks.map(look => (
              <Link key={look.id} to="/celebrity-style" className="celeb-card">
                <div className="celeb-card__img-wrap">
                  <img src={look.image} alt={look.movie}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=60'; }} />
                  <div className="celeb-card__overlay">
                    <span className="badge badge-yellow">⭐ {look.celebrity}</span>
                  </div>
                </div>
                <div className="celeb-card__info">
                  <div className="celeb-card__meta">
                    <h3>{look.movie}</h3>
                    <span className="celeb-card__price">From ₹{look.pricePerDay}/day</span>
                  </div>
                  <p className="celeb-card__desc">{look.description}</p>
                  <button className="celeb-card__btn">Rent This Look →</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bridal Picks ── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">💍 Bridal Picks</h2>
            <p className="section-subtitle">For weddings, sangeet, haldi & mehendi</p>
          </div>
          <Link to="/rent?occasion=wedding" className="see-all-link">View All →</Link>
        </div>
        <div className="product-grid">
          {bridalPicks.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── App Download Banner ── */}
      <section className="app-banner container">
        <div className="app-banner__inner">
          <div className="app-banner__content">
            <span className="badge badge-pink" style={{ marginBottom: 10 }}>📱 Coming Soon</span>
            <h2>Download the ReWearHub App</h2>
            <p>Get exclusive app-only deals, track your orders in real time, and browse 50+ outfits on the go.</p>
            <div className="app-banner__btns">
              <div className="app-btn"><span>🍎</span><div><small>Download on</small><strong>App Store</strong></div></div>
              <div className="app-btn"><span>🤖</span><div><small>Get it on</small><strong>Google Play</strong></div></div>
            </div>
          </div>
          <div className="app-banner__emoji">📱✨</div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">✨ New Arrivals</h2>
            <p className="section-subtitle">Fresh styles added this week</p>
          </div>
          <Link to="/rent" className="see-all-link">View All →</Link>
        </div>
        <div className="product-grid">
          {newArr.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="how-it-works">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 className="section-title">How ReWearHub Works</h2>
            <p className="section-subtitle">Renting is easy, affordable & fun — 4 simple steps</p>
          </div>
          <div className="steps-row">
            {[
              { icon: '🔍', step: '01', title: 'Browse & Choose', desc: 'Explore 50+ curated outfits. Filter by occasion, size, price & gender.' },
              { icon: '📅', step: '02', title: 'Pick Duration', desc: 'Choose 1–30 days rental. Flexible plans that fit every event & budget.' },
              { icon: '🚚', step: '03', title: 'We Deliver', desc: 'Dry-cleaned outfit delivered to your doorstep before your big day.' },
              { icon: '↩️', step: '04', title: 'Return & Earn', desc: 'Return after use. Get full deposit back + earn reward points!' },
            ].map(s => (
              <div key={s.step} className="step-card">
                <div className="step-card__icon">{s.icon}</div>
                <div className="step-card__num">{s.step}</div>
                <h3 className="step-card__title">{s.title}</h3>
                <p className="step-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Donate CTA ── */}
      <section className="donate-cta-strip container">
        <div className="donate-cta-strip__inner">
          <div className="donate-cta-strip__left">
            <span className="badge badge-green">♻️ Sustainability</span>
            <h2>Have unused clothes?<br /><span style={{ color: '#f43397' }}>Donate & Earn Points!</span></h2>
            <p>Give your unused clothes a second life. We pick them up for free and credit 50 reward points instantly.</p>
            <Link to="/donate" className="btn btn-primary" style={{ marginTop: 16, alignSelf: 'flex-start' }}>Donate Now →</Link>
          </div>
          <div className="donate-cta-strip__right">
            <div className="donate-stat"><span>2,400+</span><small>Items Donated</small></div>
            <div className="donate-stat"><span>180+</span><small>NGO Partners</small></div>
            <div className="donate-stat"><span>50 pts</span><small>Per Donation</small></div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section container">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Trusted by 50,000+ renters across India</p>
        </div>
        <div className="testimonials-grid">
          {[
            { name: 'Priya M.', city: 'Mumbai', rating: 5, text: 'Wore the bridal lehenga for my cousin wedding — everyone thought I bought it! Saved ₹80,000 by renting. Absolutely stunning quality!', avatar: 'P' },
            { name: 'Arjun S.', city: 'Delhi', rating: 5, text: 'Rented the SRK Pathaan jacket for a party. The quality is unreal. Easy booking, on-time delivery, and smooth return. 10/10 experience!', avatar: 'A' },
            { name: 'Sneha K.', city: 'Bengaluru', rating: 5, text: 'The Kanjeevaram saree was authentic and breathtaking. Came perfectly pressed. ReWearHub is a game-changer for fashion lovers!', avatar: 'S' },
            { name: 'Rahul V.', city: 'Pune', rating: 5, text: 'Second time renting from ReWearHub. The 3-piece suit was perfect for my presentation. Deposit was refunded within 3 days. Great service!', avatar: 'R' },
          ].map(t => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.city}</small>
                </div>
                <span className="testimonial-verified">✓ Verified Renter</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 40 }} />
    </div>
  );
};

export default Home;
