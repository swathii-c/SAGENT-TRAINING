import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/user.css';

const navLinks = [
  { to: '/portal', label: 'Home', end: true },
  { to: '/portal/shows', label: 'Shows' },
  { to: '/portal/my-bookings', label: 'My Bookings' },
];

export default function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="user-layout">
      <nav className="user-navbar">
        <div className="navbar-inner">
          <Link to="/portal" className="navbar-logo">
            <div className="navbar-logo-icon">🎭</div>
            <div className="navbar-logo-text">SeatSync</div>
          </Link>

          <div className="navbar-links">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="navbar-right">
            <Link to="/portal/notifications" className="navbar-notif-btn" title="Notifications">
              🔔
            </Link>

            <div
              className="navbar-user-menu"
              onClick={() => setShowDropdown(!showDropdown)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              tabIndex={0}
            >
              <div className="navbar-avatar">{initials}</div>
              <span className="navbar-username">{user?.name?.split(' ')[0]}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>▾</span>

              {showDropdown && (
                <div className="user-dropdown">
                  <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                  <Link to="/portal/my-bookings" className="dropdown-item">🎫 My Bookings</Link>
                  <Link to="/portal/notifications" className="dropdown-item">🔔 Notifications</Link>
                  <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
                  <button className="dropdown-item danger" onClick={handleLogout}>⬡ Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="user-content">
        <Outlet />
      </div>

      <footer className="user-footer">
        © 2025 SeatSync. All rights reserved.
      </footer>
    </div>
  );
}
