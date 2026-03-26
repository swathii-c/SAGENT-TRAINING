import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllShows, getAllVenues, getAllSchedules, getAllBookings } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ shows: 0, venues: 0, schedules: 0, bookings: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, v, sc, b] = await Promise.allSettled([
          getAllShows(), getAllVenues(), getAllSchedules(), getAllBookings()
        ]);
        setStats({
          shows: s.status === 'fulfilled' ? (s.value.data?.length || 0) : 0,
          venues: v.status === 'fulfilled' ? (v.value.data?.length || 0) : 0,
          schedules: sc.status === 'fulfilled' ? (sc.value.data?.length || 0) : 0,
          bookings: b.status === 'fulfilled' ? (b.value.data?.length || 0) : 0,
        });
        if (b.status === 'fulfilled') {
          setRecentBookings((b.value.data || []).slice(0, 5));
        }
      } catch {}
      setLoading(false);
    };
    fetchAll();
  }, []);

  const quickLinks = [
    { to: '/admin/shows', icon: '🎬', label: 'Add Show', desc: 'Create a new movie or event' },
    { to: '/admin/venues', icon: '🏛️', label: 'Add Venue', desc: 'Register a new venue' },
    { to: '/admin/schedules', icon: '📅', label: 'New Schedule', desc: 'Schedule a show at a venue' },
    { to: '/admin/seats', icon: '💺', label: 'Add Seats', desc: 'Configure venue seating' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-title-sub">Welcome back, {user?.name} — here's your overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 36 }}>
        {[
          { label: 'Total Shows', value: stats.shows, icon: '🎬' },
          { label: 'Venues', value: stats.venues, icon: '🏛️' },
          { label: 'Schedules', value: stats.schedules, icon: '📅' },
          { label: 'Bookings', value: stats.bookings, icon: '🎫' },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>{s.icon}</div>
            <div className="stat-number">{loading ? '–' : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: '1.1rem', marginBottom: 16, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        Quick Actions
      </h2>
      <div className="grid-4" style={{ marginBottom: 40 }}>
        {quickLinks.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            style={{ textDecoration: 'none' }}
          >
            <div className="card" style={{ cursor: 'pointer', height: '100%' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{q.icon}</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{q.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{q.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Recent Bookings
        </h2>
        <Link to="/admin/bookings" className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }}>View All</Link>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Show</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No bookings yet</td></tr>
            ) : recentBookings.map((b) => (
              <tr key={b.bookingId}>
                <td>#{b.bookingId}</td>
                <td>{b.user?.name || b.userId || '—'}</td>
                <td>{b.showSchedule?.show?.name || b.scheduleId || '—'}</td>
                <td>
                  <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-teal' : b.status === 'CANCELLED' ? 'badge-red' : 'badge-gold'}`}>
                    {b.status || 'PENDING'}
                  </span>
                </td>
                <td>₹{b.totalAmount || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
