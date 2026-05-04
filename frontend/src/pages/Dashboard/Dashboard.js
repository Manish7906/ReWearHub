import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockOrders } from '../../utils/mockData';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const statusColor = { delivered: 'badge-green', out_for_delivery: 'badge-yellow', processing: 'badge-orange', returned: 'badge-blue' };
const statusLabel = { delivered: '✓ Delivered', out_for_delivery: '🚚 On the Way', processing: '⏳ Processing', returned: '↩ Returned' };

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  if (!user) return (
    <div className="dash-page container" style={{ paddingTop: 60, textAlign: 'center' }}>
      <h2>Please login to view dashboard</h2>
      <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ marginTop: 16 }}>Login</button>
    </div>
  );

  const tier = user.rewardPoints >= 1000 ? 'Platinum' : user.rewardPoints >= 500 ? 'Gold' : user.rewardPoints >= 100 ? 'Silver' : 'Bronze';
  const tierColor = { Platinum: '#3498db', Gold: '#f39c12', Silver: '#9b9bb4', Bronze: '#e67e22' }[tier];

  return (
    <div className="dash-page">
      {/* Profile Header */}
      <div className="dash-header">
        <div className="container dash-header__inner">
          <div className="dash-profile">
            <div className="dash-avatar">{user.name?.[0] || 'U'}</div>
            <div>
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <span className="dash-tier" style={{ background: tierColor }}>{tier} Member</span>
            </div>
          </div>
          <div className="dash-rewards-card">
            <span className="dash-rewards-card__icon">⭐</span>
            <div>
              <strong>{user.rewardPoints || 250}</strong>
              <small>Reward Points</small>
            </div>
            <div className="dash-rewards-card__val">≈ ₹{((user.rewardPoints || 250) * 0.5).toFixed(0)}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container">
          <div className="dash-tabs">
            {[['overview', '🏠 Overview'], ['orders', '📦 Orders'], ['rewards', '⭐ Rewards'], ['profile', '👤 Profile']].map(([t, l]) => (
              <button key={t} className={`dash-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container dash-content">
        {/* Overview */}
        {tab === 'overview' && (
          <>
            <div className="dash-stats">
              {[{ icon: '👗', val: '8', label: 'Total Rentals', color: '#fde8f3' },
                { icon: '🔄', val: '1', label: 'Active Rentals', color: '#e8f8ef' },
                { icon: '♻️', val: '3', label: 'Donations', color: '#f3e9f8' },
                { icon: '⭐', val: user.rewardPoints || 250, label: 'Points', color: '#fff9e6' },
              ].map(s => (
                <div key={s.label} className="dash-stat" style={{ background: s.color }}>
                  <span className="dash-stat__icon">{s.icon}</span>
                  <span className="dash-stat__val">{s.val}</span>
                  <span className="dash-stat__label">{s.label}</span>
                </div>
              ))}
            </div>

            <h3 className="dash-section-title">Recent Orders</h3>
            {mockOrders.map(order => (
              <div key={order.id} className="order-card">
                <img src={order.product.image} alt={order.product.name} className="order-card__img" />
                <div className="order-card__info">
                  <div className="order-card__top">
                    <h4>{order.product.name}</h4>
                    <span className={`badge ${statusColor[order.status]}`}>{statusLabel[order.status]}</span>
                  </div>
                  <p>Order #{order.id} · {order.rentalDays} days · ₹{order.totalAmount}</p>
                  <p className="order-card__dates">{order.orderDate} → {order.returnDate}</p>
                </div>
                <button className="order-card__track btn btn-outline btn-sm" onClick={() => navigate('/orders')}>Track</button>
              </div>
            ))}
          </>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <>
            <h3 className="dash-section-title">All Orders</h3>
            {mockOrders.map(order => (
              <div key={order.id} className="order-card">
                <img src={order.product.image} alt={order.product.name} className="order-card__img" />
                <div className="order-card__info">
                  <div className="order-card__top">
                    <h4>{order.product.name}</h4>
                    <span className={`badge ${statusColor[order.status]}`}>{statusLabel[order.status]}</span>
                  </div>
                  <p>#{order.id} · {order.rentalDays} days · ₹{order.totalAmount}</p>
                  <p className="order-card__dates">📅 {order.orderDate} → {order.returnDate}</p>
                  <p className="order-card__addr">📍 {order.deliveryAddress}</p>
                </div>
                <button className="order-card__track btn btn-outline btn-sm" onClick={() => navigate('/orders')}>Track →</button>
              </div>
            ))}
          </>
        )}

        {/* Rewards */}
        {tab === 'rewards' && (
          <div className="rewards-section">
            <div className="rewards-balance-card">
              <span>⭐</span>
              <div>
                <strong>{user.rewardPoints || 250} Points</strong>
                <small>Worth ₹{((user.rewardPoints || 250) * 0.5).toFixed(0)}</small>
              </div>
              <span className="rewards-tier-badge" style={{ background: tierColor }}>{tier}</span>
            </div>
            <h3 className="dash-section-title">Ways to Earn</h3>
            <div className="earn-grid">
              {[{ action: 'Complete a Rental', pts: '+10 pts', icon: '👗' },
                { action: 'Write a Review', pts: '+5 pts', icon: '⭐' },
                { action: 'Donate Clothes', pts: '+50 pts', icon: '♻️' },
                { action: 'Refer a Friend', pts: '+100 pts', icon: '👥' },
              ].map(e => (
                <div key={e.action} className="earn-card">
                  <span>{e.icon}</span>
                  <div><strong>{e.action}</strong><small>{e.pts}</small></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile */}
        {tab === 'profile' && (
          <div className="profile-section">
            <div className="profile-form-card">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input defaultValue={user.name} /></div>
                <div className="form-group"><label>Email</label><input type="email" defaultValue={user.email} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Phone</label><input placeholder="+91 9999999999" /></div>
                <div className="form-group"><label>City</label><input placeholder="Mumbai" /></div>
              </div>
              <div className="form-group"><label>Default Address</label><textarea rows="3" placeholder="Your full address..." /></div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary">Save Changes</button>
                <button className="btn btn-outline" style={{ color: '#e74c3c', borderColor: '#e74c3c' }} onClick={logout}>Logout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
