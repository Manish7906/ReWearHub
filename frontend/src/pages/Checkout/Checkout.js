import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId] = useState('RWH' + Math.floor(Math.random() * 90000 + 10000));
  const [address, setAddress] = useState({ name: '', phone: '', line1: '', city: '', state: '', pincode: '' });
  const [payment, setPayment] = useState('card');

  const deposit = cart.reduce((s, i) => s + (i.deposit || 0), 0);
  const total = cartTotal + deposit;

  const upd = e => setAddress(a => ({ ...a, [e.target.name]: e.target.value }));

  const placeOrder = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
    clearCart();
    toast.success('🎉 Order placed successfully!');
  };

  if (cart.length === 0 && !success) return (
    <div className="checkout-page container" style={{ paddingTop: 60, textAlign: 'center' }}>
      <h2>Your cart is empty</h2>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/rent')}>Browse Clothes</button>
    </div>
  );

  if (success) return (
    <div className="checkout-page">
      <div className="container checkout-success">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Order Confirmed! 🎉</h2>
          <p>Your rental order has been placed. Get ready to look amazing!</p>
          <div className="success-details">
            <div className="success-detail"><span>Order ID</span><strong>#{orderId}</strong></div>
            <div className="success-detail"><span>Total Paid</span><strong style={{ color: '#f43397' }}>₹{total}</strong></div>
            <div className="success-detail"><span>Estimated Delivery</span><strong>2–3 Business Days</strong></div>
            <div className="success-detail"><span>Deposit (Refundable)</span><strong>₹{deposit}</strong></div>
          </div>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>Track Order</button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      {/* Progress */}
      <div className="checkout-progress">
        <div className="container checkout-progress__inner">
          {['Delivery', 'Payment', 'Review'].map((s, i) => (
            <div key={s} className={`cp-step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="cp-step__circle">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{s}</span>
              {i < 2 && <div className={`cp-step__line ${step > i + 1 ? 'done' : ''}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="container checkout-layout">
        {/* Main */}
        <div className="checkout-main">
          {step === 1 && (
            <div className="checkout-section">
              <h3>📍 Delivery Address</h3>
              <div className="form-row">
                <div className="form-group"><label>Full Name *</label><input name="name" placeholder="Recipient name" value={address.name} onChange={upd} required /></div>
                <div className="form-group"><label>Phone *</label><input name="phone" placeholder="+91 9999999999" value={address.phone} onChange={upd} required /></div>
              </div>
              <div className="form-group"><label>Address Line *</label><input name="line1" placeholder="Building, Street, Area" value={address.line1} onChange={upd} required /></div>
              <div className="form-row">
                <div className="form-group"><label>City *</label><input name="city" placeholder="City" value={address.city} onChange={upd} required /></div>
                <div className="form-group"><label>State *</label><input name="state" placeholder="State" value={address.state} onChange={upd} required /></div>
                <div className="form-group"><label>PIN Code *</label><input name="pincode" placeholder="400001" value={address.pincode} onChange={upd} required /></div>
              </div>
              <button className="btn btn-primary" onClick={() => address.name && address.phone && address.line1 && address.city ? setStep(2) : alert('Please fill all fields')}>
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-section">
              <h3>💳 Payment Method</h3>
              <div className="payment-options">
                {[{ id: 'card', icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                  { id: 'upi', icon: '📱', label: 'UPI', sub: 'GPay, PhonePe, Paytm' },
                  { id: 'netbanking', icon: '🏦', label: 'Net Banking', sub: 'All major banks' },
                  { id: 'cod', icon: '💵', label: 'Cash on Delivery', sub: 'Pay when you receive' },
                ].map(opt => (
                  <label key={opt.id} className={`payment-opt ${payment === opt.id ? 'active' : ''}`}>
                    <input type="radio" name="payment" value={opt.id} checked={payment === opt.id} onChange={() => setPayment(opt.id)} />
                    <span className="payment-opt__icon">{opt.icon}</span>
                    <div>
                      <strong>{opt.label}</strong>
                      <small>{opt.sub}</small>
                    </div>
                    {payment === opt.id && <span className="payment-opt__check">✓</span>}
                  </label>
                ))}
              </div>

              {payment === 'card' && (
                <div className="card-fields">
                  <div className="form-group"><label>Card Number</label><input placeholder="1234 5678 9012 3456" maxLength="19" /></div>
                  <div className="form-row">
                    <div className="form-group"><label>Expiry</label><input placeholder="MM/YY" /></div>
                    <div className="form-group"><label>CVV</label><input type="password" placeholder="•••" maxLength="3" /></div>
                  </div>
                  <div className="form-group"><label>Name on Card</label><input placeholder="Your Name" /></div>
                </div>
              )}
              {payment === 'upi' && (
                <div className="form-group" style={{ marginTop: 16 }}><label>UPI ID</label><input placeholder="yourname@paytm" /></div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>Review Order →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="checkout-section">
              <h3>🛍️ Review Your Order</h3>
              <div className="review-address">
                <span>📍</span>
                <div>
                  <strong>{address.name} · {address.phone}</strong>
                  <p>{address.line1}, {address.city}, {address.state} - {address.pincode}</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>Edit</button>
              </div>

              <div className="review-items">
                {cart.map(item => (
                  <div key={item.id} className="review-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.rentalDays} days rental</p>
                      {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                    </div>
                    <span>₹{item.pricePerDay * item.rentalDays}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={placeOrder} disabled={loading}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing...
                    </span>
                  ) : `Pay ₹${total} & Place Order`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="checkout-sidebar">
          <div className="checkout-summary">
            <h3>Price Breakdown</h3>
            {cart.map(item => (
              <div key={item.id} className="cs-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <small>{item.rentalDays} days</small>
                </div>
                <span>₹{item.pricePerDay * item.rentalDays}</span>
              </div>
            ))}
            <div className="cs-divider" />
            <div className="cs-row"><span>Rental Total</span><span>₹{cartTotal}</span></div>
            <div className="cs-row"><span>Deposit (refundable)</span><span>₹{deposit}</span></div>
            <div className="cs-row"><span>Delivery</span><span style={{ color: '#27ae60', fontWeight: 800 }}>FREE</span></div>
            <div className="cs-divider" />
            <div className="cs-row total"><span>Total</span><span>₹{total}</span></div>
            <p className="cs-note">* Security deposit fully refundable after safe return</p>
          </div>
          <div className="checkout-trust">
            <div>🔒 100% Secure Payment</div>
            <div>✅ Quality Guaranteed</div>
            <div>🚚 Free Delivery</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
