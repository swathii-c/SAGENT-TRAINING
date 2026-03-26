import React, { useEffect, useState } from 'react';
import { getAllBookings, cancelBooking } from '../../services/api';

// Booking entity: bookingId, userId, scheduleId, seatNumbers (List<String>), totalAmount, bookingStatus, bookingDate

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try { const r = await getAllBookings(); setBookings(r.data || []); } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    setCancelling(true);
    try { await cancelBooking(id); fetchBookings(); } catch {}
    setCancelling(false);
    setCancelId(null);
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    return String(b.bookingId).includes(q) || String(b.userId).includes(q) || String(b.scheduleId).includes(q);
  });

  const statusBadge = (s) => ({ CONFIRMED: 'badge-teal', CANCELLED: 'badge-red', PENDING: 'badge-gold' }[s] || 'badge-gray');

  const totalRevenue = bookings
    .filter(b => b.bookingStatus === 'CONFIRMED')
    .reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div><h1>Bookings</h1><p className="page-title-sub">Overview of all customer bookings</p></div>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Bookings', value: bookings.length, icon: '🎫' },
          { label: 'Confirmed', value: bookings.filter(b => b.bookingStatus === 'CONFIRMED').length, icon: '✅' },
          { label: 'Cancelled', value: bookings.filter(b => b.bookingStatus === 'CANCELLED').length, icon: '❌' },
          { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div className="stat-number" style={{ fontSize: '1.8rem' }}>{loading ? '–' : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <input className="form-control" style={{ maxWidth: 360 }}
          placeholder="Search by booking ID, user ID, schedule ID..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="spinner" /> : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🎫</div><p>No bookings found.</p></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>ID</th><th>User ID</th><th>Schedule ID</th><th>Seats</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.bookingId}>
                  <td>#{b.bookingId}</td>
                  <td>#{b.userId}</td>
                  <td>#{b.scheduleId}</td>
                  <td style={{ fontSize: 12 }}>{Array.isArray(b.seatNumbers) ? b.seatNumbers.join(', ') : '—'}</td>
                  <td style={{ color: 'var(--gold)', fontWeight: 600 }}>₹{b.totalAmount}</td>
                  <td><span className={`badge ${statusBadge(b.bookingStatus)}`}>{b.bookingStatus}</span></td>
                  <td style={{ fontSize: 12 }}>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : '—'}</td>
                  <td>
                    {b.bookingStatus !== 'CANCELLED' && (
                      <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setCancelId(b.bookingId)}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cancelId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 380 }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>Cancel Booking #{cancelId}?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This will cancel the booking.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setCancelId(null)} disabled={cancelling}>Keep</button>
              <button className="btn btn-danger" onClick={() => handleCancel(cancelId)} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
