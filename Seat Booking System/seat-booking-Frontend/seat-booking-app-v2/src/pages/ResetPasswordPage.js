import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';
 
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 4) { setError('Password must be at least 4 characters.'); return; }
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/users/reset-password', { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const errData = err.response?.data;
const errMsg = typeof errData === 'string'
  ? errData
  : errData?.message || 'Invalid or expired reset link. Please request a new one.';
setError(errMsg);
    }
    setLoading(false);
  };
 
  if (!token) {
    return (
      <div className="login-page">
        <div className="login-form-panel" style={{ width: '100%' }}>
          <div className="login-form-inner">
            <div className="alert alert-error">Invalid reset link. Please request a new one.</div>
            <Link to="/forgot-password" className="btn btn-primary" style={{ width: '100%', marginTop: 16, display: 'block', textAlign: 'center' }}>
              Request Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="hero-logo">
          <div className="hero-logo-icon">🎭</div>
          <div className="hero-logo-text">SeatSync</div>
        </div>
        <h1 className="hero-title">Create a new<br /><span>Password.</span></h1>
        <p className="hero-subtitle">Choose a strong password to keep your SeatSync account secure.</p>
        <div className="hero-features">
          {['At least 4 characters', 'Mix of letters & numbers', 'Don\'t share your password'].map(f => (
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
              <h2>New Password</h2>
              <p className="login-tagline">Enter your new password below</p>
 
              {error && <div className="alert alert-error">{error}</div>}
 
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" className="form-control" placeholder="••••••••"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" className="form-control" placeholder="••••••••"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), #0e8c72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px', boxShadow: '0 0 40px rgba(26,188,156,0.4)' }}>
                ✓
              </div>
              <h2 style={{ marginBottom: 12 }}>Password Reset!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                Your password has been reset successfully.
              </p>
              <div className="alert alert-success">Redirecting to login in 3 seconds...</div>
            </div>
          )}
 
          <p className="login-footer" style={{ marginTop: 24 }}>
            <Link to="/login">← Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}