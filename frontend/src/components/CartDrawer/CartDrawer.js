import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateRentalDays, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const deposit = cart.reduce((s, i) => s + (i.deposit || 0), 0);
  const grandTotal = cartTotal + deposit;

  const handleCheckout = () => { setCartOpen(false); navigate('/checkout'); };

  return (
    <>
      {cartOpen && <div className="cart-overlay" onClick={() => setCartOpen(false)} />}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer__header">
          <div>
            <h2>My Cart</h2>
            {cart.length > 0 && <span className="cart-count-badge">{cart.length} item{cart.length > 1 ? 's' : ''}</span>}
          </div>
          <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty__icon">🛍️</div>
            <h3>Your cart is empty</h3>
            <p>Add some stylish outfits to get started!</p>
            <button className="btn btn-primary" onClick={() => { setCartOpen(false); navigate('/rent'); }}>
              Explore Collection
            </button>
          </div>
        ) : (
          <>
            {/* Delivery Banner */}
            <div className="cart-delivery-banner">
              🚚 <strong>FREE Delivery</strong> on all rentals above ₹299
            </div>

            {/* Items */}
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item__img" />
                  <div className="cart-item__info">
                    <h4 className="cart-item__name">{item.name}</h4>
                    <p className="cart-item__cat">{item.category}</p>
                    <div className="cart-item__price-row">
                      <span className="cart-item__price">₹{item.pricePerDay}/day</span>
                    </div>

                    {/* Days selector */}
                    <div className="cart-item__days-wrap">
                      <span>Rental Days:</span>
                      <div className="cart-item__days">
                        <button onClick={() => updateRentalDays(item.id, Math.max(1, item.rentalDays - 1))}>−</button>
                        <span>{item.rentalDays}</span>
                        <button onClick={() => updateRentalDays(item.id, Math.min(30, item.rentalDays + 1))}>+</button>
                      </div>
                    </div>

                    <div className="cart-item__subtotal">
                      Subtotal: <strong>₹{item.pricePerDay * item.rentalDays}</strong>
                    </div>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>🗑️</button>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="cart-summary">
              <div className="cart-summary__title">Price Summary</div>
              <div className="cart-summary__row">
                <span>Rental Total ({cart.length} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="cart-summary__row">
                <span>Refundable Deposit</span>
                <span>₹{deposit}</span>
              </div>
              <div className="cart-summary__row">
                <span>Delivery</span>
                <span style={{ color: '#27ae60', fontWeight: 700 }}>FREE</span>
              </div>
              <div className="cart-summary__row total">
                <span>Total Payable</span>
                <span>₹{grandTotal}</span>
              </div>
              <p className="cart-deposit-note">* Deposit is 100% refundable on safe return</p>
            </div>

            {/* Footer */}
            <div className="cart-drawer__footer">
              <div className="cart-footer__total">
                <div>
                  <span className="cart-footer__label">Total</span>
                  <span className="cart-footer__amount">₹{grandTotal}</span>
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleCheckout} style={{ flex: 1 }}>
                  Place Order →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
