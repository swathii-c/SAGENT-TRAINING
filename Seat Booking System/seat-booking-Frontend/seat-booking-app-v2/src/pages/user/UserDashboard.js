import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllShows, getBookingsByUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, b] = await Promise.allSettled([
          getAllShows(),
          user?.userId ? getBookingsByUser(user.userId) : Promise.resolve({ data: [] }),
        ]);
        if (s.status === 'fulfilled') setShows((s.value.data || []).slice(0, 6));
        if (b.status === 'fulfilled') setBookings((b.value.data || []).slice(0, 3));
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const getTypeEmoji = (type) => ({ MOVIE: '🎬', CONCERT: '🎵', EVENT: '🎪' }[type] || '🎭');

  return (
    <div className="user-page fade-in">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 60%)',
        border: '1px solid var(--border)', borderRadius: 20, padding: '48px 40px',
        marginBottom: 48, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <p style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>Welcome back</p>
          <h1 style={{ fontSize: '2.4rem', marginBottom: 12 }}>{user?.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28, maxWidth: 500 }}>
            Discover and book your next unforgettable experience.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/portal/shows" className="btn btn-primary">Browse Shows →</Link>
            <Link to="/portal/my-bookings" className="btn btn-secondary">My Bookings</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 48 }}>
        {[
          { icon: '🎫', label: 'Total Bookings', value: bookings.length },
          { icon: '🎬', label: 'Shows Available', value: shows.length },
          { icon: '⭐', label: 'Member Since', value: new Date().getFullYear() },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
            <div className="stat-number">{loading ? '–' : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Featured Shows — using s.title and s.showType */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.4rem' }}>Now Showing</h2>
        <Link to="/portal/shows" className="btn btn-ghost" style={{ padding: '7px 16px', fontSize: 13 }}>View All</Link>
      </div>

      {loading ? <div className="spinner" /> : shows.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🎬</div><p>No shows available yet.</p></div>
      ) : (
        <div className="grid-3" style={{ marginBottom: 48 }}>
          {shows.map(s => (
            <Link key={s.showId} to={`/portal/shows/${s.showId}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', height: '100%' }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(26,188,156,0.05))', borderRadius: 12, padding: '28px 20px', textAlign: 'center', marginBottom: 16, fontSize: 40 }}>
                  {getTypeEmoji(s.showType)}
                </div>
                <span className="badge badge-gold" style={{ fontSize: 10 }}>{s.showType}</span>
                <h3 style={{ fontSize: '1rem', margin: '8px 0 6px' }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  {s.genre && `${s.genre} · `}{s.language && `${s.language} · `}{s.duration && `${s.duration} min`}
                </p>
                <div className="gold-line" />
                <p style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600 }}>Book Now →</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Recent Bookings — using b.bookingStatus */}
      {bookings.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.4rem' }}>Recent Bookings</h2>
            <Link to="/portal/my-bookings" className="btn btn-ghost" style={{ padding: '7px 16px', fontSize: 13 }}>View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bookings.map(b => (
              <div key={b.bookingId} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Booking #{b.bookingId}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Schedule #{b.scheduleId} · {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>₹{b.totalAmount}</span>
                  <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-teal' : b.bookingStatus === 'CANCELLED' ? 'badge-red' : 'badge-gold'}`}>
                    {b.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
