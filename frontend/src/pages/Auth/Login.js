import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(form.email, form.password);
    setLoading(false);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left__content">
          <div className="auth-logo">
            <div className="auth-logo__icon">✦</div>
            <span>ReWear<b>Hub</b></span>
          </div>
          <h2>India's #1<br />Fashion Rental<br />Platform</h2>
          <div className="auth-features">
            {['5,000+ Premium Outfits', 'Free Delivery', 'Celebrity Looks', 'Earn Rewards'].map(f => (
              <div key={f} className="auth-feature"><span>✓</span>{f}</div>
            ))}
          </div>
          <div className="auth-left__emoji">👗</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1>Welcome Back! 👋</h1>
          <p className="auth-subtitle">Sign in to continue renting</p>

          <div className="auth-demo-box">
            <span>🧪 Demo Account:</span>
            <button onClick={() => setForm({ email: 'demo@rewear.com', password: 'demo123' })}>
              Use demo@rewear.com / demo123
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input type={showPass ? 'text' : 'password'} placeholder="Enter password"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" className="password-toggle" onClick={() => setShowPass(s => !s)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="auth-forgot"><Link to="#">Forgot Password?</Link></div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Sign In →'}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>
          <div className="auth-socials">
            <button className="social-btn">🔍 Continue with Google</button>
            <button className="social-btn">📘 Continue with Facebook</button>
          </div>

          <p className="auth-switch">New to ReWearHub? <Link to="/signup">Create Account →</Link></p>
        </div>
      </div>
    </div>
  );
};

export const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { alert('Passwords do not match'); return; }
    setLoading(true);
    const ok = await signup({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    setLoading(false);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left__content">
          <div className="auth-logo">
            <div className="auth-logo__icon">✦</div>
            <span>ReWear<b>Hub</b></span>
          </div>
          <h2>Join 50,000+<br />Fashion Lovers<br />Today!</h2>
          <div className="auth-features">
            {['Free Sign Up', '50 Welcome Points', 'Exclusive Deals', 'Celebrity Looks Access'].map(f => (
              <div key={f} className="auth-feature"><span>✓</span>{f}</div>
            ))}
          </div>
          <div className="auth-left__emoji">✨</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1>Create Account 🎉</h1>
          <p className="auth-subtitle">Start renting in minutes</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" placeholder="Your name" value={form.name} onChange={update} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" placeholder="+91 9999999999" value={form.phone} onChange={update} required />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={update} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <div className="password-input">
                  <input type={showPass ? 'text' : 'password'} name="password"
                    placeholder="Min. 6 characters" value={form.password} onChange={update} required minLength="6" />
                  <button type="button" className="password-toggle" onClick={() => setShowPass(s => !s)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={update} required />
              </div>
            </div>
            <p className="auth-terms">
              By signing up, you agree to our <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link>
            </p>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Sign In →</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
