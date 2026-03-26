import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const navItems = [
  { to: '/admin', icon: '◈', label: 'Dashboard', end: true },
  { to: '/admin/shows', icon: '🎬', label: 'Shows' },
  { to: '/admin/venues', icon: '🏛️', label: 'Venues' },
  { to: '/admin/schedules', icon: '📅', label: 'Schedules' },
  { to: '/admin/seats', icon: '💺', label: 'Seats' },
  { to: '/admin/bookings', icon: '🎫', label: 'Bookings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎭</div>
          <div>
            <div className="sidebar-logo-text">SeatSync</div>
            <span className="sidebar-logo-role">Admin Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-avatar">{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div className="sidebar-user-name">{user?.name || 'Admin'}</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>⬡</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <span className="admin-topbar-title">
            <strong>SeatSync</strong> — Admin Control Panel
          </span>
          <span className="badge badge-gold">ADMIN</span>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
