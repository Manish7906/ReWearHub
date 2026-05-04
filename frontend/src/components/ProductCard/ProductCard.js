import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleRent = (e) => {
    e.preventDefault();
    if (!product.available) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const mrp = Math.round(product.pricePerDay * (100 / (100 - (product.discount || 20))));

  return (
    <Link to={`/product/${product.id}`} className="pcard">
      {/* Image */}
      <div className="pcard__img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="pcard__img"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80'; }}
        />

        {/* Top badges */}
        <div className="pcard__top-badges">
          {product.badge && (
            <span className="pcard__badge pcard__badge--main">{product.badge}</span>
          )}
          {product.discount > 0 && (
            <span className="pcard__badge pcard__badge--discount">{product.discount}% OFF</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`pcard__wish ${wishlist ? 'active' : ''}`}
          onClick={e => { e.preventDefault(); setWishlist(w => !w); }}
          aria-label="Add to wishlist"
        >
          {wishlist ? '❤️' : '🤍'}
        </button>

        {/* Free delivery tag */}
        <div className="pcard__free-tag">🚚 FREE Delivery</div>

        {/* Unavailable overlay */}
        {!product.available && (
          <div className="pcard__unavailable-overlay">Currently Unavailable</div>
        )}
      </div>

      {/* Body */}
      <div className="pcard__body">
        {/* Brand + Category */}
        <div className="pcard__meta">
          <span className="pcard__brand">{product.brand}</span>
          <span className="pcard__dot">·</span>
          <span className="pcard__cat">{product.category}</span>
        </div>

        {/* Name */}
        <h3 className="pcard__name">{product.name}</h3>

        {/* Color + Fabric */}
        <div className="pcard__details">
          {product.color && <span className="pcard__detail-chip">🎨 {product.color}</span>}
          {product.fabric && <span className="pcard__detail-chip">🧵 {product.fabric}</span>}
        </div>

        {/* Rating Row */}
        <div className="pcard__rating-row">
          <span className="pcard__stars-box">★ {product.rating}</span>
          <span className="pcard__reviews">({product.reviewCount?.toLocaleString()})</span>
          <span className="pcard__rented">{product.totalRentals?.toLocaleString()} rented</span>
        </div>

        {/* Price */}
        <div className="pcard__price-row">
          <span className="pcard__price">₹{product.pricePerDay}<small>/day</small></span>
          <span className="pcard__mrp">₹{mrp}</span>
          {product.discount > 0 && (
            <span className="pcard__off">{product.discount}% off</span>
          )}
        </div>

        {/* Deposit note */}
        <p className="pcard__deposit">+ ₹{product.deposit?.toLocaleString()} refundable deposit</p>

        {/* Sizes */}
        <div className="pcard__sizes">
          {(product.size || []).slice(0, 5).map(s => (
            <span key={s} className="pcard__size">{s}</span>
          ))}
          {(product.size || []).length > 5 && (
            <span className="pcard__size pcard__size--more">+{product.size.length - 5}</span>
          )}
        </div>

        {/* Rent Button */}
        <button
          className={`pcard__rent-btn ${added ? 'added' : ''} ${!product.available ? 'disabled' : ''}`}
          onClick={handleRent}
          disabled={!product.available}
        >
          {added ? '✓ Added to Cart!' : !product.available ? 'Unavailable' : 'Rent Now'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
