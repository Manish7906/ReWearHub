import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './Donation.css';

const Donation = () => {
  const [form, setForm] = useState({ donorName: '', donorEmail: '', donorPhone: '', clothesType: '', quantity: '', condition: '', description: '', pickupAddress: '', preferredPickupDate: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    toast.success('🎉 Donation submitted! You earned 50 reward points!');
  };

  if (submitted) return (
    <div className="donate-page">
      <div className="container donate-success">
        <div className="donate-success__card">
          <div className="donate-success__icon">♻️</div>
          <h2>Thank You for Donating!</h2>
          <p>Your donation request has been received. Our team will contact you within 24 hours to arrange free pickup.</p>
          <div className="donate-success__reward">
            <span>🎁</span>
            <div>
              <strong>+50 Reward Points Added</strong>
              <small>Use them on your next rental!</small>
            </div>
          </div>
          <div className="donate-success__steps">
            {['Request Submitted ✓', 'Team Review (24h)', 'Free Pickup Scheduled', 'Points Credited'].map((s, i) => (
              <div key={s} className={`ds-step ${i === 0 ? 'done' : ''}`}>
                <div className="ds-step__circle">{i === 0 ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Donate More Clothes</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="donate-page">
      {/* Hero */}
      <div className="donate-hero">
        <div className="container donate-hero__inner">
          <div className="donate-hero__content">
            <span className="badge badge-green">♻️ Give Back</span>
            <h1>Donate Clothes,<br /><span>Earn Rewards!</span></h1>
            <p>Give your unused clothes a second life. We pick them up for free and credit 50 reward points instantly.</p>
            <div className="donate-hero__highlights">
              <div>🚚 <strong>Free Pickup</strong></div>
              <div>⭐ <strong>50 Points</strong></div>
              <div>❤️ <strong>Help Others</strong></div>
            </div>
          </div>
          <div className="donate-hero__stats">
            {[{ num: '2,400+', label: 'Items Donated' }, { num: '180+', label: 'NGO Partners' }, { num: '₹5L+', label: 'Value Donated' }].map(s => (
              <div key={s.label} className="donate-stat-box">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container donate-layout">
        {/* How it works */}
        <div className="donate-how">
          <h3>How Donation Works</h3>
          {[
            { icon: '📝', step: '1', title: 'Fill the Form', desc: 'Tell us what you want to donate' },
            { icon: '📞', step: '2', title: 'We Contact You', desc: 'Team calls within 24 hours' },
            { icon: '🚚', step: '3', title: 'Free Pickup', desc: 'We collect from your doorstep' },
            { icon: '🎁', step: '4', title: 'Earn Points', desc: '50 points credited instantly' },
          ].map(s => (
            <div key={s.step} className="donate-step">
              <div className="donate-step__icon">{s.icon}</div>
              <div>
                <strong>{s.title}</strong>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}

          <div className="donate-accepted">
            <h4>We Accept</h4>
            {['Ethnic Wear', 'Formal Wear', 'Casual Clothes', 'Kids Clothing', 'Accessories', 'Sarees & Lehengas'].map(item => (
              <span key={item} className="tag" style={{ margin: '4px 4px 0 0' }}>✓ {item}</span>
            ))}
          </div>
        </div>

        {/* Form */}
        <form className="donate-form" onSubmit={handleSubmit}>
          <div className="donate-form__header">
            <h3>Donation Request Form</h3>
            <p>Fields marked * are required</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="donorName" placeholder="Your full name" value={form.donorName} onChange={update} required />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input name="donorPhone" placeholder="+91 9999999999" value={form.donorPhone} onChange={update} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="donorEmail" placeholder="your@email.com" value={form.donorEmail} onChange={update} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type of Clothes *</label>
              <select name="clothesType" value={form.clothesType} onChange={update} required>
                <option value="">Select type</option>
                {['Ethnic Wear', 'Formal Wear', 'Casual Wear', 'Kids Clothing', 'Accessories', 'Mixed'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity (approx.) *</label>
              <input type="number" name="quantity" placeholder="No. of items" min="1" value={form.quantity} onChange={update} required />
            </div>
          </div>

          <div className="form-group">
            <label>Condition *</label>
            <div className="condition-pills">
              {['BRAND_NEW', 'EXCELLENT', 'GOOD', 'FAIR'].map(c => (
                <label key={c} className={`condition-pill ${form.condition === c ? 'active' : ''}`}>
                  <input type="radio" name="condition" value={c} checked={form.condition === c} onChange={update} required />
                  <span>{c.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" placeholder="Describe the clothes (colors, brands, sizes...)" value={form.description} onChange={update} />
          </div>

          <div className="form-group">
            <label>Pickup Address *</label>
            <textarea name="pickupAddress" rows="2" placeholder="Full address for free pickup" value={form.pickupAddress} onChange={update} required />
          </div>

          <div className="form-group">
            <label>Preferred Pickup Date</label>
            <input type="date" name="preferredPickupDate" value={form.preferredPickupDate} onChange={update}
              min={new Date().toISOString().split('T')[0]} />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? '⏳ Submitting...' : '♻️ Submit Donation Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Donation;
