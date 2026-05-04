import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { mockProducts, mockReviews } from '../../utils/mockData';
import './ProductDetail.css';

const StarBar = ({ label, pct }) => (
  <div className="star-bar">
    <span className="star-bar__label">{label}★</span>
    <div className="star-bar__track"><div className="star-bar__fill" style={{ width: `${pct}%` }} /></div>
    <span className="star-bar__pct">{Math.round(pct)}%</span>
  </div>
);

const SimilarCard = ({ p }) => {
  const { addToCart } = useCart();
  const mrpS = Math.round(p.pricePerDay * (100 / (100 - (p.discount || 20))));
  return (
    <Link to={`/product/${p.id}`} className="pcard" onClick={() => window.scrollTo(0,0)}>
      <div className="pcard__img-wrap">
        <img src={p.image} alt={p.name} className="pcard__img" loading="lazy"
          onError={e => { e.target.src='https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=60'; }} />
        {p.badge && <div className="pcard__top-badges"><span className="pcard__badge pcard__badge--main">{p.badge}</span></div>}
        {p.discount > 0 && <div className="pcard__top-badges" style={{top:'auto',bottom:30,left:8}}><span className="pcard__badge pcard__badge--discount">{p.discount}% OFF</span></div>}
        <div className="pcard__free-tag">🚚 FREE Delivery</div>
      </div>
      <div className="pcard__body">
        <div className="pcard__meta">
          <span className="pcard__brand">{p.brand}</span>
          <span className="pcard__dot">·</span>
          <span className="pcard__cat">{p.category}</span>
        </div>
        <h3 className="pcard__name">{p.name}</h3>
        <div className="pcard__details">
          {p.color && <span className="pcard__detail-chip">🎨 {p.color}</span>}
          {p.fabric && <span className="pcard__detail-chip">🧵 {p.fabric}</span>}
        </div>
        <div className="pcard__rating-row">
          <span className="pcard__stars-box">★ {p.rating}</span>
          <span className="pcard__reviews">({p.reviewCount?.toLocaleString()})</span>
          <span className="pcard__rented">{p.totalRentals?.toLocaleString()} rented</span>
        </div>
        <div className="pcard__price-row">
          <span className="pcard__price">₹{p.pricePerDay}<small>/day</small></span>
          <span className="pcard__mrp">₹{mrpS}</span>
          {p.discount > 0 && <span className="pcard__off">{p.discount}% off</span>}
        </div>
        <p className="pcard__deposit">+ ₹{p.deposit?.toLocaleString()} refundable deposit</p>
        <div className="pcard__sizes">
          {(p.size||[]).slice(0,4).map(s=><span key={s} className="pcard__size">{s}</span>)}
        </div>
        <button className="pcard__rent-btn" onClick={e=>{e.preventDefault();addToCart(p);}}>Rent Now</button>
      </div>
    </Link>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = mockProducts.find(p => p.id === parseInt(id));
  const [selectedSize, setSelectedSize] = useState('');
  const [days, setDays] = useState(3);
  const [tab, setTab] = useState('description');
  const [added, setAdded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [wishlist, setWishlist] = useState(false);

  if (!product) return (
    <div style={{ paddingTop: 140, textAlign: 'center' }}>
      <h2>Product not found</h2>
      <button className="btn btn-primary" onClick={() => navigate('/rent')} style={{ marginTop: 16 }}>Back to Catalogue</button>
    </div>
  );

  const allImages = (product.images && product.images.length > 1)
    ? product.images
    : [product.image, product.image, product.image];

  const mrp = Math.round(product.pricePerDay * (100 / (100 - (product.discount || 20))));
  const rentalCost = product.pricePerDay * days;
  const totalPayable = rentalCost + (product.deposit || 0);
  const similar = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleRent = () => {
    if (!selectedSize && product.size && product.size[0] !== 'Free Size') {
      alert('Please select a size first');
      return;
    }
    addToCart({ ...product, selectedSize: selectedSize || (product.size && product.size[0]) }, days);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const ratingDist = [
    { label: 5, pct: 68 }, { label: 4, pct: 19 },
    { label: 3, pct: 8 },  { label: 2, pct: 3 }, { label: 1, pct: 2 },
  ];

  const returnDate = new Date(Date.now() + days * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="pdp">
      {/* Breadcrumb */}
      <div className="pdp-breadcrumb container">
        <Link to="/">Home</Link><span>/</span>
        <Link to="/rent">Rent</Link><span>/</span>
        <Link to={`/rent?category=${product.category}`} style={{textTransform:'capitalize'}}>{product.category}</Link><span>/</span>
        <span className="pdp-breadcrumb__current">{product.name}</span>
      </div>

      {/* Main */}
      <div className="container pdp-main">

        {/* ── Gallery ── */}
        <div className="pdp-gallery">
          <div className="pdp-thumbs">
            {allImages.map((img, i) => (
              <button key={i} className={`pdp-thumb ${imgIndex===i?'active':''}`} onClick={() => setImgIndex(i)}>
                <img src={img} alt={`View ${i+1}`} loading="lazy"
                  onError={e=>{e.target.src='https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=60';}} />
              </button>
            ))}
          </div>
          <div className="pdp-main-img">
            <img src={allImages[imgIndex]} alt={product.name}
              onError={e=>{e.target.src='https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80';}} />
            <div className="pdp-img-badges">
              {product.badge && <span className="pdp-badge pdp-badge--main">{product.badge}</span>}
              {product.discount>0 && <span className="pdp-badge pdp-badge--off">{product.discount}% OFF</span>}
            </div>
            <button className={`pdp-wish ${wishlist?'active':''}`} onClick={()=>setWishlist(w=>!w)}>
              {wishlist?'❤️':'🤍'} {wishlist?'Saved':'Wishlist'}
            </button>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="pdp-info">

          {/* Brand / category pills */}
          <div className="pdp-meta-row">
            <span className="pdp-brand-pill">{product.brand}</span>
            <span className="pdp-cat-pill" style={{textTransform:'capitalize'}}>{product.category}</span>
            {product.celebrity && <span className="pdp-celeb-pill">⭐ Celebrity Look</span>}
            {product.gender && (
              <span className="pdp-gender-pill">
                {product.gender==='men'?'👔':'👗'} {product.gender==='men'?'Men':'Women'}
              </span>
            )}
          </div>

          <h1 className="pdp-title">{product.name}</h1>

          {/* Rating */}
          <div className="pdp-rating-row">
            <div className="pdp-stars-box">★ {product.rating}</div>
            <span className="pdp-rating-text">{product.reviewCount?.toLocaleString()} reviews</span>
            <span className="pdp-sep">·</span>
            <span className="pdp-rented-text">{product.totalRentals?.toLocaleString()} times rented</span>
          </div>

          {/* Price */}
          <div className="pdp-price-block">
            <div className="pdp-price-row">
              <span className="pdp-price">₹{product.pricePerDay}</span>
              <span className="pdp-per">/day</span>
              <span className="pdp-mrp">₹{mrp}</span>
              {product.discount>0 && <span className="pdp-discount-pill">{product.discount}% OFF</span>}
            </div>
            <p className="pdp-deposit-line">
              + <strong>₹{product.deposit?.toLocaleString()}</strong> refundable security deposit
            </p>
            <div className="pdp-offer-chips">
              <span className="pdp-offer">🏷️ Use code REWEAR10 for extra 10% off</span>
              <span className="pdp-offer">🎁 +10 reward points on this rental</span>
            </div>
          </div>

          {/* Details grid */}
          <div className="pdp-details-grid">
            {product.color && (
              <div className="pdp-detail-item">
                <span className="pdp-detail-icon">🎨</span>
                <div><small>Color</small><strong>{product.color}</strong></div>
              </div>
            )}
            {product.fabric && (
              <div className="pdp-detail-item">
                <span className="pdp-detail-icon">🧵</span>
                <div><small>Fabric</small><strong>{product.fabric}</strong></div>
              </div>
            )}
            {product.occasion && (
              <div className="pdp-detail-item">
                <span className="pdp-detail-icon">🎉</span>
                <div><small>Occasion</small><strong style={{textTransform:'capitalize'}}>{product.occasion}</strong></div>
              </div>
            )}
            {product.gender && (
              <div className="pdp-detail-item">
                <span className="pdp-detail-icon">{product.gender==='men'?'👔':'👗'}</span>
                <div><small>For</small><strong>{product.gender==='men'?'Men':'Women'}</strong></div>
              </div>
            )}
          </div>

          {/* Size */}
          {product.size && product.size[0] !== 'Free Size' && (
            <div className="pdp-size-section">
              <div className="pdp-size-header">
                <label>Select Size</label>
                <button className="pdp-size-guide">📏 Size Guide</button>
              </div>
              <div className="pdp-sizes">
                {product.size.map(s => (
                  <button key={s} className={`pdp-size-btn ${selectedSize===s?'active':''}`}
                    onClick={()=>setSelectedSize(s)}>{s}</button>
                ))}
              </div>
              {!selectedSize && <p className="pdp-size-hint">⚠️ Please select a size to rent</p>}
            </div>
          )}

          {/* Duration */}
          <div className="pdp-duration-section">
            <div className="pdp-duration-header">
              <label>Rental Duration</label>
              <span className="pdp-duration-val">{days} {days===1?'day':'days'}</span>
            </div>
            <div className="pdp-duration-chips">
              {[1,3,5,7,14,30].map(d => (
                <button key={d} className={`pdp-duration-chip ${days===d?'active':''}`} onClick={()=>setDays(d)}>
                  {d}d
                </button>
              ))}
            </div>
            <input type="range" min="1" max="30" value={days}
              onChange={e=>setDays(Number(e.target.value))} className="pdp-slider" />
            <p className="pdp-slider-tip">🗓️ Slide to choose 1–30 days</p>
          </div>

          {/* Breakdown */}
          <div className="pdp-price-breakdown">
            <div className="pdp-pb-row">
              <span>Rental (₹{product.pricePerDay}/day × {days} days)</span>
              <span>₹{rentalCost.toLocaleString()}</span>
            </div>
            <div className="pdp-pb-row">
              <span>Security Deposit <em>(fully refundable)</em></span>
              <span>₹{(product.deposit||0).toLocaleString()}</span>
            </div>
            <div className="pdp-pb-row">
              <span>Delivery Charges</span>
              <span className="pdp-free">FREE</span>
            </div>
            <div className="pdp-pb-divider" />
            <div className="pdp-pb-row pdp-pb-total">
              <span>Total Payable</span>
              <span>₹{totalPayable.toLocaleString()}</span>
            </div>
            <p className="pdp-pb-note">
              💰 You save ₹{((mrp - product.pricePerDay) * days).toLocaleString()} vs buying!
            </p>
          </div>

          {/* CTA */}
          <div className="pdp-cta">
            <button className={`pdp-rent-btn ${added?'added':''}`} onClick={handleRent} disabled={!product.available}>
              {added ? '✓ Added to Cart!' : !product.available ? 'Currently Unavailable' : '🛍️ Rent Now'}
            </button>
            <button className="pdp-cart-btn" onClick={handleRent} disabled={!product.available||added}>
              {added?'✓':'🛒'}
            </button>
          </div>

          {/* Trust */}
          <div className="pdp-trust-row">
            {[['✅','Quality Checked'],['🔒','Secure Payment'],['🚚','Free Delivery'],['↩️','Easy Return']].map(([i,l])=>(
              <div key={l} className="pdp-trust-item"><span>{i}</span><span>{l}</span></div>
            ))}
          </div>

          {/* Delivery */}
          <div className="pdp-delivery-info">
            <div className="pdp-delivery-row">
              <span>📍</span>
              <div>
                <strong>Deliver to Mumbai 400001</strong>
                <p>Usually delivered in 2–3 business days</p>
              </div>
              <button className="pdp-change-btn">Change</button>
            </div>
            <div className="pdp-delivery-row">
              <span>🔄</span>
              <div>
                <strong>Free Return Pickup</strong>
                <p>Schedule pickup before {returnDate}</p>
              </div>
            </div>
            <div className="pdp-delivery-row">
              <span>💰</span>
              <div>
                <strong>Deposit Refund in 3–5 Days</strong>
                <p>₹{(product.deposit||0).toLocaleString()} credited after safe return</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="container pdp-tabs-section">
        <div className="pdp-tabs">
          {[['description','📋 Description'],['features','✨ Features'],['reviews','⭐ Reviews'],['policy','📜 Policy']].map(([t,l])=>(
            <button key={t} className={`pdp-tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{l}</button>
          ))}
        </div>

        <div className="pdp-tab-panel">

          {tab==='description' && (
            <div className="pdp-description">
              <p>{product.description}</p>
              <div className="pdp-specs-grid">
                {[
                  ['Product Name', product.name],
                  ['Brand', product.brand],
                  ['Category', product.category],
                  ['Fabric', product.fabric],
                  ['Color', product.color],
                  ['Occasion', product.occasion],
                  ['Available Sizes', product.size?.join(', ')],
                  ['Gender', product.gender==='men'?'Men':'Women'],
                  ['Price/Day', `₹${product.pricePerDay}`],
                  ['Deposit (Refundable)', `₹${product.deposit?.toLocaleString()}`],
                ].map(([k,v])=> v ? (
                  <div key={k} className="pdp-spec">
                    <span>{k}</span>
                    <strong style={{textTransform:'capitalize'}}>{v}</strong>
                  </div>
                ) : null)}
              </div>
            </div>
          )}

          {tab==='features' && (
            <div className="pdp-features">
              <h3>What's Included with This Outfit</h3>
              <div className="pdp-features-grid">
                {(product.features||[]).map((feat,i)=>(
                  <div key={i} className="pdp-feature-item">
                    <span className="pdp-feature-check">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
              <h3 style={{marginTop:28}}>ReWearHub Service Guarantee</h3>
              <div className="pdp-features-grid">
                {['Professional Dry Cleaning','Quality Inspection','Secure Packaging','On-Time Delivery','Free Return Pickup','Deposit Refund within 3–5 days'].map((f,i)=>(
                  <div key={i} className="pdp-feature-item pdp-feature-item--service">
                    <span className="pdp-feature-check pdp-feature-check--blue">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='reviews' && (
            <div className="pdp-reviews-section">
              <div className="pdp-rating-overview">
                <div className="pdp-rating-big">
                  <span className="pdp-rating-num">{product.rating}</span>
                  <div className="pdp-rating-stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5-Math.round(product.rating))}</div>
                  <span className="pdp-rating-count">{product.reviewCount?.toLocaleString()} reviews</span>
                </div>
                <div className="pdp-rating-bars">
                  {ratingDist.map(r=><StarBar key={r.label} label={r.label} pct={r.pct}/>)}
                </div>
              </div>
              <div className="pdp-reviews-list">
                {mockReviews.map(review=>(
                  <div key={review.id} className="pdp-review-card">
                    <div className="pdp-review-header">
                      <div className="pdp-reviewer-avatar">{review.avatar||review.user[0]}</div>
                      <div className="pdp-reviewer-info">
                        <strong>{review.user}</strong>
                        {review.verified && <span className="pdp-verified">✓ Verified Rental</span>}
                      </div>
                      <span className="pdp-review-date">{review.date}</span>
                    </div>
                    <div className="pdp-review-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                    <p className="pdp-review-text">{review.comment}</p>
                    <div className="pdp-review-helpful">
                      <span>Helpful?</span>
                      <button>👍 Yes ({review.helpful})</button>
                      <button>👎 No</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='policy' && (
            <div className="pdp-policy">
              {[
                {icon:'🚚',title:'Free Delivery',desc:'We deliver your rental to your doorstep for free, 2–3 days before your event date. Same-day delivery available in select cities at ₹99 extra.'},
                {icon:'✅',title:'Quality Guarantee',desc:'Every item is professionally dry-cleaned, steam-ironed, and quality inspected before dispatch. You receive it in showroom-perfect condition, always.'},
                {icon:'↩️',title:'Easy Returns',desc:'Schedule a free doorstep pickup anytime within your rental period. Our team collects and you are done — no trips to any shop.'},
                {icon:'💰',title:'Deposit Refund',desc:`Your security deposit of ₹${(product.deposit||0).toLocaleString()} is 100% refundable within 3–5 business days of the item being returned in good condition.`},
                {icon:'⏰',title:'Late Return Policy',desc:`If you return late, you will be charged ₹${Math.round((product.pricePerDay||0)*1.5).toLocaleString()} per extra day. We notify you via SMS and email as your return date approaches.`},
                {icon:'🔧',title:'Damage Policy',desc:'Minor wear is covered. Significant damage (stains, tears, missing accessories) may result in partial deductions from your deposit, assessed by our quality team.'},
              ].map(p=>(
                <div key={p.title} className="pdp-policy-item">
                  <span className="pdp-policy-icon">{p.icon}</span>
                  <div><h4>{p.title}</h4><p>{p.desc}</p></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Similar */}
      {similar.length>0 && (
        <div className="container pdp-similar">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <h2 className="section-title">Similar Products</h2>
            <Link to={`/rent?category=${product.category}`} className="see-all-link">See All →</Link>
          </div>
          <div className="product-grid">
            {similar.map(p=><SimilarCard key={p.id} p={p}/>)}
          </div>
        </div>
      )}
      <div style={{height:40}}/>
    </div>
  );
};

export default ProductDetail;
