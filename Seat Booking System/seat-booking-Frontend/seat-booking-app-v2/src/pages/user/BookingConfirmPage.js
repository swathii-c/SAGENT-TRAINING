import React from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

export default function BookingConfirmPage() {
  const { bookingId } = useParams();
  const { state } = useLocation();

  const { 
  booking, schedule, show, venueName, selectedSeats = [], 
  grandTotal, paymentMethod,
  discountAmount = 0, 
  discountPercent = 0, 
  discountLabel = '', 
  freePopcorn = false 
} = state || {};

  if (!state) {
    return (
      <div className="user-page">
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <p>Booking not found.</p>
          <Link to="/portal" className="btn btn-primary" style={{ marginTop: 16 }}>Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Success Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(26,188,156,0.12), rgba(212,175,55,0.08))', border: '1px solid rgba(26,188,156,0.25)', borderRadius: 20, padding: '48px 40px', textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), #0e8c72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px', boxShadow: '0 0 40px rgba(26,188,156,0.4)' }}>
          ✓
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Your tickets are ready.</p>
        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-accent)', borderRadius: 8, padding: '8px 20px', marginTop: 16, fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: 'var(--gold)', letterSpacing: '2px' }}>
          #{bookingId}
        </div>
      </div>

      {(freePopcorn || discountPercent > 0) && (
  <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
    {freePopcorn && (
      <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-accent)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 32 }}>🍿</span>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: 15 }}>2 Free Popcorns Included!</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Show Booking ID <strong>#{bookingId}</strong> at the counter
          </div>
        </div>
      </div>
    )}
    {discountPercent > 0 && (
      <div style={{ background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.25)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 32 }}>🏷️</span>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--teal)', fontSize: 15 }}>You saved ₹{discountAmount}!</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{discountLabel}</div>
        </div>
      </div>
    )}
  </div>
)}

      {/* Ticket Card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-accent)', borderRadius: 20, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(26,188,156,0.06))', padding: '24px 28px', borderBottom: '1px dashed var(--border)' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{show?.title || `Schedule #${schedule?.scheduleId}`}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {schedule?.showDate} at {schedule?.showTime}
          </p>
        </div>

        <div style={{ padding: '24px 28px' }}>
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Venue</div>
              <div style={{ fontWeight: 600 }}>{venueName || `Venue #${schedule?.venueId}`}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Payment</div>
              <div style={{ fontWeight: 600 }}>{paymentMethod}</div>
              <div style={{ fontSize: 12, color: 'var(--teal)' }}>✓ Success</div>
            </div>
          </div>

          <div className="gold-line" />

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>Seats</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedSeats.map(s => (
                <div key={s.seatId} style={{ background: 'var(--gold-dim)', border: '1px solid var(--border-accent)', borderRadius: 8, padding: '8px 14px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: 14 }}>{s.seatNumber}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.seatType} · ₹{s.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="gold-line" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Paid</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>₹{grandTotal}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px dashed var(--border)', padding: '16px 28px', display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border)' }} />)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/portal/my-bookings" className="btn btn-primary">View My Bookings</Link>
        <Link to="/portal/shows" className="btn btn-secondary">Book Another Show</Link>
        <Link to="/portal" className="btn btn-ghost">Go Home</Link>
      </div>
    </div>
  );
}
