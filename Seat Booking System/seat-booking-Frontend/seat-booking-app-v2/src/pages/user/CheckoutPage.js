import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking, processPayment } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
 
const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI', icon: '📱' },
  { id: 'CARD', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'NETBANKING', label: 'Net Banking', icon: '🏦' },
  { id: 'WALLET', label: 'Wallet', icon: '👛' },
];
 
export default function CheckoutPage() {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
 
  const { schedule, show, venueName, selectedSeats = [], totalAmount = 0 } = state || {};
 
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
 
  if (!state || !schedule) {
    return (
      <div className="user-page">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <p>No booking data found. Please select seats first.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/portal/shows')}>
            Browse Shows
          </button>
        </div>
      </div>
    );
  }
 
  // ── Discount Calculations ─────────────────────────────────────────────────────
  const seatCount = selectedSeats.length;
 
  let discountPercent = 0;
  let discountLabel = '';
 
  if (seatCount >= 5) {
    discountPercent = 10;
    discountLabel = '10% off on 5+ tickets';
  } else if (seatCount === 4) {
    discountPercent = 5;
    discountLabel = '5% off on 4 tickets';
  }
 
  const discountAmount = Math.round(totalAmount * (discountPercent / 100));
  const afterDiscount = totalAmount - discountAmount;
  const convenience = Math.round(afterDiscount * 0.02);
  const gst = Math.round(afterDiscount * 0.18);
  const grandTotal = afterDiscount + convenience + gst;
 
  // ── Book & Pay ────────────────────────────────────────────────────────────────
  const handleConfirmBooking = async () => {
    setError('');
    setProcessing(true);
    try {
      const bookingRes = await createBooking({
        userId: user.userId,
        scheduleId: schedule.scheduleId,
        seatNumbers: selectedSeats.map(s => s.seatNumber),
        totalAmount: grandTotal,
        bookingStatus: 'CONFIRMED',
      });
      const booking = bookingRes.data;
 
      await processPayment({
        bookingId: booking.bookingId,
        amount: grandTotal,
        paymentMode: paymentMethod,
        paymentStatus: 'SUCCESS',
      });
 
      navigate(`/portal/booking-confirm/${booking.bookingId}`, {
        state: {
          booking, schedule, show, venueName, selectedSeats,
          grandTotal, paymentMethod,
          discountAmount, discountPercent, discountLabel,
        },
        replace: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    }
    setProcessing(false);
  };
 
  return (
    <div className="user-page fade-in">
      <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 13, marginBottom: 24 }} onClick={() => navigate(-1)}>
        ← Back to Seat Selection
      </button>
 
      <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Checkout</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 14 }}>Review your order and complete payment</p>
 
      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}
 
      {/* ── Discount Banner ── */}
      {seatCount > 0 && (
        <div style={{ marginBottom: 20 }}>
          {discountPercent > 0 ? (
            <div style={{ background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.25)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>🏷️</span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--teal)' }}>{discountLabel} — You save ₹{discountAmount}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Discount applied automatically</div>
              </div>
            </div>
          ) : seatCount === 3 ? (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🎟️</span>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Add <strong style={{ color: 'var(--gold)' }}>1 more seat</strong> to unlock 5% discount!
              </div>
            </div>
          ) : seatCount < 4 ? (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🎟️</span>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Book <strong style={{ color: 'var(--gold)' }}>4 seats</strong> for 5% off ·{' '}
                <strong style={{ color: 'var(--gold)' }}>5 seats</strong> for 10% off
              </div>
            </div>
          ) : null}
        </div>
      )}
 
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
 
        {/* ── Left ── */}
        <div>
          {/* Order Details */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              Order Details
            </h3>
            <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Show</div>
                <div style={{ fontWeight: 600 }}>{show?.title || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date & Time</div>
                <div style={{ fontWeight: 600 }}>{schedule.showDate} at {schedule.showTime}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Venue</div>
                <div style={{ fontWeight: 600 }}>{venueName || `Venue #${schedule.venueId}`}</div>
              </div>
            </div>
            <div className="gold-line" />
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seats</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedSeats.map(s => (
                <span key={s.seatId} style={{ background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.25)', borderRadius: 6, padding: '4px 10px', fontSize: 13, fontWeight: 600, color: 'var(--teal)' }}>
                  {s.seatNumber} ({s.seatType}) — ₹{s.price}
                </span>
              ))}
            </div>
          </div>
 
          {/* Payment Method */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              Payment Method
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
              {PAYMENT_METHODS.map(m => (
                <div key={m.id} onClick={() => setPaymentMethod(m.id)} style={{
                  padding: '14px', borderRadius: 10, cursor: 'pointer',
                  border: paymentMethod === m.id ? '2px solid var(--gold)' : '1px solid var(--border)',
                  background: paymentMethod === m.id ? 'var(--gold-dim)' : 'transparent',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: paymentMethod === m.id ? 600 : 400, color: paymentMethod === m.id ? 'var(--gold)' : 'var(--text-secondary)' }}>
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
 
            {paymentMethod === 'UPI' && (
              <div className="form-group">
                <label>UPI ID</label>
                <input className="form-control" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
              </div>
            )}
            {paymentMethod === 'CARD' && (
              <>
                <div className="form-group">
                  <label>Card Number</label>
                  <input className="form-control" placeholder="1234 5678 9012 3456" maxLength={19}
                    value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())} />
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input className="form-control" placeholder="Full Name" value={cardName} onChange={e => setCardName(e.target.value)} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Expiry</label>
                    <input className="form-control" placeholder="MM/YY" maxLength={5} value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input className="form-control" placeholder="•••" maxLength={4} type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value)} />
                  </div>
                </div>
              </>
            )}
            {(paymentMethod === 'NETBANKING' || paymentMethod === 'WALLET') && (
              <div className="alert alert-info">You will be redirected to complete payment after confirming.</div>
            )}
          </div>
        </div>
 
        {/* ── Right: Price Breakdown ── */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 88 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              Price Breakdown
            </h3>
 
            {selectedSeats.map(s => (
              <div key={s.seatId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                <span>Seat {s.seatNumber}</span>
                <span>₹{s.price || 0}</span>
              </div>
            ))}
 
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
 
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
              <span>Subtotal</span><span>₹{totalAmount}</span>
            </div>
 
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--teal)', marginBottom: 8 }}>
                <span>Discount ({discountPercent}%)</span>
                <span>− ₹{discountAmount}</span>
              </div>
            )}
 
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
              <span>Convenience (2%)</span><span>₹{convenience}</span>
            </div>
 
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
              <span>GST (18%)</span><span>₹{gst}</span>
            </div>
 
            <div style={{ height: 1, background: 'var(--border-accent)', margin: '8px 0' }} />
 
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--gold)' }}>₹{grandTotal}</span>
            </div>
 
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: 15 }}
              onClick={handleConfirmBooking}
              disabled={processing}
            >
              {processing ? 'Processing...' : `Pay ₹${grandTotal} →`}
            </button>
 
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
              🔒 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}