import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';
 
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
 
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
 
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/users/forgot-password', {
        email,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errData = err.response?.data;
      const errMsg = typeof errData === 'string'
        ? errData
        : errData?.message || 'No account found with this email.';
      setError(errMsg);
    }
    setLoading(false);
  };
 
  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="hero-logo">
          <div className="hero-logo-icon">🎭</div>
          <div className="hero-logo-text">SeatSync</div>
        </div>
        <h1 className="hero-title">Forgot your<br /><span>Password?</span></h1>
        <p className="hero-subtitle">
          Enter your registered email and set a new password instantly.
        </p>
        <div className="hero-features">
          {['Enter your email', 'Set new password', 'Login immediately'].map(f => (
            <div className="hero-feature" key={f}>
              <div className="hero-feature-dot" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>
 
      <div className="login-form-panel">
        <div className="login-form-inner">
          {!success ? (
            <>
              <h2>Reset Password</h2>
              <p className="login-tagline">Enter your email and new password</p>
 
              {error && <div className="alert alert-error">{error}</div>}
 
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary login-submit"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--teal), #0e8c72)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, margin: '0 auto 20px',
                boxShadow: '0 0 40px rgba(26,188,156,0.4)'
              }}>✓</div>
              <h2 style={{ marginBottom: 12 }}>Password Reset!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                Your password has been updated successfully.
              </p>
              <div className="alert alert-success">
                Redirecting to login...
              </div>
            </div>
          )}
 
          <p className="login-footer" style={{ marginTop: 24 }}>
            Remember your password? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}