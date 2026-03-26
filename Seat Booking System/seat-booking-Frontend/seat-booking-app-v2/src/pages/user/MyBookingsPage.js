import React, { useEffect, useState } from 'react';
import { getBookingsByUser, requestCancellation, getAllShows, getSchedulesByShow } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
 
export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [refundInfo, setRefundInfo] = useState(null);
  const [scheduleMap, setScheduleMap] = useState({}); // ← NEW
 
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const r = await getBookingsByUser(user.userId);
      setBookings(r.data || []);
 
      // ── Build scheduleId → { showTitle, showDate, showTime } map ──────────
      const showsRes = await getAllShows();
      const allShows = showsRes.data || [];
      const map = {};
      await Promise.all(allShows.map(async (show) => {
        try {
          const scRes = await getSchedulesByShow(show.showId);
          (scRes.data || []).forEach(sc => {
            map[sc.scheduleId] = {
              showTitle: show.title,
              showDate: sc.showDate,
              showTime: sc.showTime,
            };
          });
        } catch {}
      }));
      setScheduleMap(map);
    } catch {}
    setLoading(false);
  };
 
  useEffect(() => { fetchBookings(); }, []);
 
  const handleCancel = async () => {
    if (!cancelModal) return;
    setCancelling(true);
    try {
      const res = await requestCancellation({
        bookingId: cancelModal.bookingId,
        reason: cancelReason
      });
      const refund = res.data?.refundAmount || 0;
      setRefundInfo({ bookingId: cancelModal.bookingId, refund });
      setCancelModal(null);
      setCancelReason('');
      fetchBookings();
    } catch {}
    setCancelling(false);
  };
 
  const FILTERS = ['ALL', 'CONFIRMED', 'CANCELLED'];
  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.bookingStatus === filter);
  const statusStyle = (s) => ({ CONFIRMED: 'badge-teal', CANCELLED: 'badge-red', PENDING: 'badge-gold' }[s] || 'badge-gray');
 
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };
 
  return (
    <div className="user-page fade-in">
      <div className="page-header">
        <div>
          <h1>My Bookings</h1>
          <p className="page-title-sub">All your booking history</p>
        </div>
      </div>
 
      {/* Refund confirmation banner */}
      {refundInfo && (
        <div style={{
          background: refundInfo.refund > 0 ? 'rgba(26,188,156,0.08)' : 'rgba(192,57,43,0.08)',
          border: `1px solid ${refundInfo.refund > 0 ? 'rgba(26,188,156,0.3)' : 'rgba(192,57,43,0.3)'}`,
          borderRadius: 12, padding: '16px 20px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <span style={{ fontSize: 28 }}>{refundInfo.refund > 0 ? '✅' : '❌'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: refundInfo.refund > 0 ? 'var(--teal)' : '#e74c3c', marginBottom: 4 }}>
              Booking #{refundInfo.bookingId} Cancelled
            </div>
            {refundInfo.refund > 0 ? (
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                Refund of <strong style={{ color: 'var(--gold)' }}>₹{refundInfo.refund}</strong> will be
                processed to your original payment method within 5–7 business days.
              </div>
            ) : (
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                No refund applicable as per cancellation policy.
              </div>
            )}
          </div>
          <button onClick={() => setRefundInfo(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>
            ✕
          </button>
        </div>
      )}
 
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '7px 16px', fontSize: 13 }}>
            {f === 'ALL'
              ? `All (${bookings.length})`
              : `${f} (${bookings.filter(b => b.bookingStatus === f).length})`}
          </button>
        ))}
      </div>
 
      {loading ? <div className="spinner" /> : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <p>No bookings found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(b => {
            // ── Get show info from map ──────────────────────────────────────
            const schedInfo = scheduleMap[b.scheduleId];
            const showTitle = schedInfo?.showTitle || `Schedule #${b.scheduleId}`;
            const showDate  = schedInfo?.showDate  || null;
            const showTime  = schedInfo?.showTime  || null;
 
            return (
              <div key={b.bookingId} className="card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-muted)' }}>
                        #{b.bookingId}
                      </span>
                      <span className={`badge ${statusStyle(b.bookingStatus)}`}>
                        {b.bookingStatus}
                      </span>
                    </div>
 
                    {/* ── Show title instead of Schedule #X ── */}
                    <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{showTitle}</h3>
 
                    {/* ── Show date + time ── */}
                    {showDate && (
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        📅 {showDate}{showTime ? ` at ${formatTime(showTime)}` : ''}
                      </div>
                    )}
 
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      🕐 {b.bookingDate ? new Date(b.bookingDate).toLocaleString() : '—'}
                    </div>
 
                    {/* Seat Numbers */}
                    {Array.isArray(b.seatNumbers) && b.seatNumbers.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {b.seatNumbers.map((sn, idx) => (
                          <span key={`${b.bookingId}-${idx}`} style={{
                            background: 'rgba(212,175,55,0.08)',
                            border: '1px solid var(--border-accent)',
                            borderRadius: 6, padding: '3px 10px',
                            fontSize: 12, fontWeight: 600, color: 'var(--gold)'
                          }}>
                            {sn}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
 
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: 20, fontWeight: 800, color: 'var(--gold)',
                      fontFamily: 'var(--font-display)', marginBottom: 8
                    }}>
                      ₹{b.totalAmount}
                    </div>
                    {b.bookingStatus !== 'CANCELLED' && (
                      <button className="btn btn-danger"
                        style={{ padding: '6px 14px', fontSize: 12 }}
                        onClick={() => setCancelModal(b)}>
                        Request Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
 
      {/* Cancel Modal */}
      {cancelModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={() => setCancelModal(null)}>✕</button>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>
              Cancel Booking #{cancelModal.bookingId}?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              This action cannot be undone.
            </p>
            <div className="form-group">
              <label>Reason (optional)</label>
              <textarea className="form-control" rows={3}
                placeholder="Let us know why..."
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => setCancelModal(null)} disabled={cancelling}>
                Keep Booking
              </button>
              <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Submitting...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}