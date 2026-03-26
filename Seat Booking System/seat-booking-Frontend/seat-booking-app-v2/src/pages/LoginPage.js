import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';
 
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
 
  React.useEffect(() => {
    if (user) navigate(user.role === 'ADMIN' ? '/admin' : '/portal', { replace: true });
  }, [user, navigate]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      const userData = res.data;
      login(userData);
      if (userData.role === 'ADMIN') navigate('/admin', { replace: true });
      else navigate('/portal', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Invalid credentials. Please try again.';
      setError(typeof msg === 'string' ? msg : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '40px 36px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
 
        {/* ── Unique SeatSync Logo ── */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 20,
          }}>
            {/* Seat icon */}
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #d4af37, #b8960a)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 4px 16px rgba(212,175,55,0.4)',
            }}>🎭</div>
 
            {/* Brand name */}
            <div style={{ lineHeight: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{
                  fontSize: 26, fontWeight: 900, letterSpacing: '-1px',
                  background: 'linear-gradient(135deg, #d4af37, #f0d060)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Seat</span>
                <span style={{
                  fontSize: 26, fontWeight: 900, letterSpacing: '-1px',
                  color: 'var(--text-primary)',
                }}>Sync</span>
              </div>
              <div style={{
                fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
                color: 'var(--text-muted)', fontWeight: 600, marginTop: 1,
              }}>Book · Lock · Enjoy</div>
            </div>
          </div>
 
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px' }}>
            Welcome back
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
            Sign in to your account to continue
          </p>
        </div>
 
        {/* Error */}
        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}
 
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
 
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <div style={{ textAlign: 'right', marginTop: 6 }}>
              <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Forgot password?
              </Link>
            </div>
          </div>
 
          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
 
        <div className="login-divider"><span>or</span></div>
 
        <p className="login-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
 
        {/* Access Portals */}
        <div style={{
          marginTop: 24, padding: '16px',
          borderRadius: 10,
          background: 'rgba(212,175,55,0.05)',
          border: '1px solid rgba(212,175,55,0.15)',
        }}>
          <p style={{
            fontSize: 11, color: 'var(--text-secondary)',
            marginBottom: 8, fontWeight: 700,
            letterSpacing: '0.8px', textTransform: 'uppercase',
          }}>
            Access Portals
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--gold)' }}>Admin</strong> — Manage shows, venues & schedules<br />
            <strong style={{ color: 'var(--teal)' }}>User</strong> — Browse & book your seats
          </p>
        </div>
      </div>
    </div>
  );
}
