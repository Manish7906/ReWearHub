import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { mockCelebrityLooks, mockProducts } from '../../utils/mockData';
import './CelebrityStyle.css';

const CelebrityStyle = () => {
  const [selected, setSelected] = useState(null);
  const { addToCart } = useCart();
  const getProducts = (ids) => ids.map(id => mockProducts.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="celeb-page">
      {/* Hero */}
      <div className="celeb-hero">
        <div className="container celeb-hero__inner">
          <div className="celeb-hero__content">
            <span className="badge badge-yellow">⭐ Celebrity Collection</span>
            <h1>Dress Like <span>Shah Rukh Khan</span></h1>
            <p>Recreate iconic looks from Bollywood's biggest blockbusters. Every outfit handpicked from his most memorable films.</p>
            <div className="celeb-hero__stats">
              <div><strong>50+</strong><span>Looks</span></div>
              <div><strong>3</strong><span>Movies</span></div>
              <div><strong>4.9★</strong><span>Rating</span></div>
            </div>
          </div>
          <div className="celeb-hero__img">
            <div className="celeb-hero__glow" />
            <span className="celeb-hero__big-emoji">🎬</span>
          </div>
        </div>
      </div>

      <div className="container celeb-content">
        {/* Look Cards */}
        <div className="celeb-looks-grid">
          {mockCelebrityLooks.map(look => (
            <div key={look.id} className={`celeb-look-card ${selected?.id === look.id ? 'selected' : ''}`}
              onClick={() => setSelected(selected?.id === look.id ? null : look)}>
              <div className="celeb-look-card__img-wrap">
                <img src={look.image} alt={look.movie} />
                <div className="celeb-look-card__overlay">
                  <button className="celeb-look-card__view">
                    {selected?.id === look.id ? '✕ Close' : '👀 View Outfit Set'}
                  </button>
                </div>
              </div>
              <div className="celeb-look-card__body">
                <div className="celeb-look-card__top">
                  <span className="badge badge-yellow">⭐ {look.celebrity}</span>
                  <span className="celeb-look-card__price">₹{look.pricePerDay}<small>/day</small></span>
                </div>
                <h3>{look.movie}</h3>
                <p>{look.description}</p>
                <div className="celeb-look-card__footer">
                  <span className="badge badge-green">FREE Delivery</span>
                  <span className="badge badge-pink">4.9★ Rated</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expanded outfit set */}
        {selected && (
          <div className="outfit-set-panel">
            <div className="outfit-set-panel__header">
              <div>
                <h2>Complete Look — {selected.movie}</h2>
                <p>All pieces from {selected.celebrity}'s iconic outfit</p>
              </div>
              <button className="outfit-close" onClick={() => setSelected(null)}>✕ Close</button>
            </div>

            <div className="outfit-pieces">
              {getProducts(selected.products).map(product => (
                <div key={product.id} className="outfit-piece">
                  <img src={product.image} alt={product.name} />
                  <div className="outfit-piece__info">
                    <span className="outfit-piece__cat">{product.category}</span>
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <div className="outfit-piece__footer">
                      <div>
                        <span className="outfit-piece__price">₹{product.pricePerDay}/day</span>
                        <span className="outfit-piece__deposit">+₹{product.deposit} deposit</span>
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>
                        Rent This
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="outfit-set-footer">
              <div className="outfit-set-footer__price">
                <span>Complete Set from</span>
                <strong>₹{selected.pricePerDay}/day</strong>
              </div>
              <button className="btn btn-primary btn-lg"
                onClick={() => { getProducts(selected.products).forEach(p => addToCart(p)); }}>
                🛍️ Rent Full Set
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="celeb-tips">
          {[
            { icon: '✨', title: 'Authentic Pieces', desc: 'Verified replicas of original Bollywood costumes' },
            { icon: '🚚', title: 'Free Delivery', desc: 'Delivered before your event, dry-cleaned & pressed' },
            { icon: '📸', title: 'Photo Ready', desc: 'Perfect for events, photoshoots & celebrations' },
            { icon: '↩️', title: 'Easy Return', desc: 'Schedule free pickup after your event' },
          ].map(t => (
            <div key={t.title} className="celeb-tip">
              <span className="celeb-tip__icon">{t.icon}</span>
              <h4>{t.title}</h4>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CelebrityStyle;
