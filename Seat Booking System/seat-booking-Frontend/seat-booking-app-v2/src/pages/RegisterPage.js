import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../styles/login.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phoneNo: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, phoneNo: form.phoneNo, password: form.password, role: 'USER' });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="hero-logo">
          <div className="hero-logo-icon">🎭</div>
          <div className="hero-logo-text">SeatSync</div>
        </div>
        <h1 className="hero-title">Join the<br /><span>Experience.</span></h1>
        <p className="hero-subtitle">Create your free account and start booking your favorite events in seconds.</p>
        <div className="hero-features">
          {['Free account forever', 'Exclusive early access', 'Booking history', 'Instant notifications'].map((f) => (
            <div className="hero-feature" key={f}><div className="hero-feature-dot" /><span>{f}</span></div>
          ))}
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-inner">
          <h2>Create Account</h2>
          <p className="login-tagline">Sign up and start booking today</p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" type="text" className="form-control" placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phoneNo" type="tel" className="form-control" placeholder="+91 98765 43210" value={form.phoneNo} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" className="form-control" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" className="form-control" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="login-footer" style={{ marginTop: 24 }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
