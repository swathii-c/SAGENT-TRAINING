import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  getScheduleById, getSeatsByVenue,
  lockSeat, unlockSeat, getAllVenues, getAllBookings
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
 
const LOCK_MINUTES = 3;
 
// ── Auto-assign seat type based on row letter ─────────────────────────────────
// Rows A, B → PREMIUM | Rows C, D → VIP | Rows E+ → STANDARD
function inferSeatType(seat) {
  if (seat.seatType && seat.seatType !== 'STANDARD') return seat.seatType;
  const row = seat.seatNumber?.match(/^([A-Za-z]+)/)?.[1]?.toUpperCase();
  if (!row) return seat.seatType || 'STANDARD';
  if (['A', 'B'].includes(row)) return 'PREMIUM';
  if (['C', 'D'].includes(row)) return 'VIP';
  return 'STANDARD';
}
 
// ── Seat Grid Component ────────────────────────────────────────────────────────
function SeatGrid({ seats, selectedSeats, bookedSeatIds, lockedSeatIds, onSeatClick, currentUserId }) {
 
  const getRow = (seatNumber) => {
    if (!seatNumber) return '?';
    const match = seatNumber.match(/^([A-Za-z]+)/);
    return match ? match[1].toUpperCase() : '?';
  };
 
  // Apply inferred seat type to all seats
  const enrichedSeats = seats.map(s => ({ ...s, seatType: inferSeatType(s) }));
 
  const grouped = enrichedSeats.reduce((acc, seat) => {
    const row = getRow(seat.seatNumber);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});
 
  const getRowType = (row) => {
    const rowSeats = grouped[row] || [];
    if (rowSeats.length === 0) return 3;
    const type = rowSeats[0].seatType;
    if (type === 'PREMIUM') return 0;
    if (type === 'VIP') return 1;
    return 2;
  };
 
  const sortedRows = Object.keys(grouped).sort((a, b) => {
    const typeDiff = getRowType(a) - getRowType(b);
    if (typeDiff !== 0) return typeDiff;
    return a.localeCompare(b);
  });
 
  const getStatus = (seat) => {
    if (bookedSeatIds?.includes(seat.seatId)) return 'booked';
    if (lockedSeatIds?.includes(seat.seatId)) return 'locked';
    if (selectedSeats?.some(s => s.seatId === seat.seatId)) return 'selected';
    return 'available';
  };
 
  const getSeatStyle = (seat) => {
    const status = getStatus(seat);
    const type = seat.seatType;
    const base = {
      width: 34, height: 30,
      borderRadius: '5px 5px 3px 3px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.15s',
      border: '1px solid transparent',
    };
 
    if (status === 'booked') return { ...base, background: 'rgba(192,57,43,0.25)', borderColor: 'rgba(192,57,43,0.4)', cursor: 'not-allowed', opacity: 0.6 };
    if (status === 'locked') return { ...base, background: 'rgba(255,165,0,0.2)', borderColor: 'rgba(255,165,0,0.4)', cursor: 'not-allowed', opacity: 0.7 };
 
    if (status === 'selected') {
      if (type === 'VIP')     return { ...base, background: 'var(--gold)',  borderColor: 'var(--gold)',  color: '#0a0a0f', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(212,175,55,0.5)' };
      if (type === 'PREMIUM') return { ...base, background: '#9b59b6',      borderColor: '#9b59b6',      color: 'white',   transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(155,89,182,0.4)' };
      return { ...base, background: 'var(--teal)', borderColor: 'var(--teal)', color: 'white', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(26,188,156,0.4)' };
    }
 
    if (type === 'VIP')     return { ...base, background: 'rgba(212,175,55,0.1)',  borderColor: 'rgba(212,175,55,0.3)'  };
    if (type === 'PREMIUM') return { ...base, background: 'rgba(155,89,182,0.1)',  borderColor: 'rgba(155,89,182,0.3)'  };
    return { ...base, background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)' };
  };
 
  const premiumRows  = sortedRows.filter(r => grouped[r][0]?.seatType === 'PREMIUM');
  const vipRows      = sortedRows.filter(r => grouped[r][0]?.seatType === 'VIP');
  const standardRows = sortedRows.filter(r =>
    grouped[r][0]?.seatType === 'STANDARD' ||
    grouped[r][0]?.seatType === 'REGULAR'  ||
    grouped[r][0]?.seatType === 'RECLINER' ||
    !grouped[r][0]?.seatType
  );
 
  const sections = [
    { label: 'PREMIUM',  rows: premiumRows,  color: '#9b59b6',     bg: 'rgba(155,89,182,0.08)' },
    { label: 'VIP',      rows: vipRows,      color: 'var(--gold)', bg: 'rgba(212,175,55,0.06)' },
    { label: 'STANDARD', rows: standardRows, color: 'var(--teal)', bg: 'rgba(26,188,156,0.04)' },
  ];
 
  const renderRow = (row, sectionColor) => {
    const rowSeats = grouped[row].sort((a, b) => {
      const na = parseInt(a.seatNumber.replace(/\D/g, '')) || 0;
      const nb = parseInt(b.seatNumber.replace(/\D/g, '')) || 0;
      return na - nb;
    });
    return (
      <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6, justifyContent: 'center' }}>
        <div style={{ width: 24, textAlign: 'center', fontSize: 11, fontWeight: 700, color: sectionColor, flexShrink: 0 }}>{row}</div>
        {rowSeats.map((seat, idx) => {
          const status = getStatus(seat);
          const isDisabled = status === 'booked' || status === 'locked';
          return (
            <React.Fragment key={seat.seatId}>
              {idx > 0 && idx % 5 === 0 && <div style={{ width: 16, flexShrink: 0 }} />}
              <div
                style={getSeatStyle(seat)}
                title={`${seat.seatNumber} • ${seat.seatType} • ₹${seat.price}\nStatus: ${status.toUpperCase()}`}
                onClick={() => !isDisabled && onSeatClick && onSeatClick(seat)}
              >
                {status === 'selected' ? '✓' : status === 'booked' ? '✕' : ''}
              </div>
            </React.Fragment>
          );
        })}
        <div style={{ width: 24, textAlign: 'center', fontSize: 11, fontWeight: 700, color: sectionColor, flexShrink: 0 }}>{row}</div>
      </div>
    );
  };
 
  return (
    <div>
      {/* Screen */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          height: 5,
          background: 'linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent)',
          borderRadius: 3, maxWidth: 480, margin: '0 auto 8px',
          boxShadow: '0 2px 16px rgba(212,175,55,0.4)'
        }} />
        <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
          Screen / Stage
        </div>
      </div>
 
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        {[
          { label: 'Available', bg: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.15)' },
          { label: 'Selected',  bg: 'var(--teal)',            border: 'var(--teal)'             },
          { label: 'Sold',      bg: 'rgba(192,57,43,0.25)',   border: 'rgba(192,57,43,0.4)'     },
          { label: 'Locked',    bg: 'rgba(255,165,0,0.2)',    border: 'rgba(255,165,0,0.4)'     },
          { label: 'VIP',       bg: 'rgba(212,175,55,0.1)',   border: 'rgba(212,175,55,0.3)'    },
          { label: 'Premium',   bg: 'rgba(155,89,182,0.1)',   border: 'rgba(155,89,182,0.3)'    },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <div style={{ width: 20, height: 16, borderRadius: '3px 3px 2px 2px', background: l.bg, border: `1px solid ${l.border}` }} />
            {l.label}
          </div>
        ))}
      </div>
 
      {/* Sections */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        {enrichedSeats.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
            No seats configured for this venue
          </div>
        ) : (
          sections.map(section => section.rows.length === 0 ? null : (
            <div key={section.label} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, justifyContent: 'center' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)', maxWidth: 80 }} />
                <div style={{
                  background: section.bg,
                  border: `1px solid ${section.color}`,
                  borderRadius: 20, padding: '4px 16px',
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '1.5px', textTransform: 'uppercase',
                  color: section.color,
                }}>
                  {section.label}
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)', maxWidth: 80 }} />
              </div>
              {section.rows.map(row => renderRow(row, section.color))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
 
// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SeatSelectionPage() {
  const { scheduleId } = useParams();
  const { state }      = useLocation();
  const { user }       = useAuth();
  const navigate       = useNavigate();
 
  const passedSchedule = state?.schedule || null;
  const passedShow     = state?.show     || null;
 
  const [schedule, setSchedule]           = useState(passedSchedule);
  const [show]                             = useState(passedShow);
  const [venues, setVenues]               = useState([]);
  const [seats, setSeats]                 = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeatIds, setBookedSeatIds] = useState([]);
  const [lockedSeatIds, setLockedSeatIds] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [lockTimer, setLockTimer]         = useState(null);
  const timerRef                           = useRef(null);
  const myLockedSeatIds                    = useRef([]);
 
  const getVenueName = useCallback((venueId) => {
    if (!venueId) return '—';
    const found = venues.find(v => String(v.venueId) === String(venueId));
    return found ? found.venueName : `Venue #${venueId}`;
  }, [venues]);
 
  const fetchSeats = useCallback(async (venueId) => {
    if (!venueId) return;
    try {
      const sr = await getSeatsByVenue(venueId);
      const allSeats = sr.data || [];
 
      // Apply inferred seat type
      const enriched = allSeats.map(s => ({ ...s, seatType: inferSeatType(s) }));
      setSeats(enriched);
 
      // Get bookings for THIS schedule only
      const bookingsRes = await getAllBookings();
      const allBookings = bookingsRes.data || [];
 
      const bookedSeatNumbers = allBookings
        .filter(b =>
          String(b.scheduleId) === String(scheduleId) &&
          b.bookingStatus === 'CONFIRMED'
        )
        .flatMap(b => b.seatNumbers || []);
 
      const booked = enriched
        .filter(s => bookedSeatNumbers.includes(s.seatNumber))
        .map(s => s.seatId);
 
      // ── FIX: Only count locks for THIS schedule that are still valid ──
      const now = new Date();
      const locked = enriched
        .filter(s =>
          s.status === 'LOCKED' &&
          String(s.lockedByUserId) !== String(user?.userId) &&
          String(s.lockedForScheduleId) === String(scheduleId) &&
          s.lockedUntil && new Date(s.lockedUntil) > now
        )
        .map(s => s.seatId);
 
      setBookedSeatIds(booked);
      setLockedSeatIds(locked);
    } catch {
      setError('Failed to load seats.');
    }
  }, [user, scheduleId]);
 
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let sc = passedSchedule;
      if (!sc) {
        const r = await getScheduleById(scheduleId);
        sc = r.data;
      }
      setSchedule(sc);
      const vr = await getAllVenues();
      setVenues(vr.data || []);
      const venueId = sc?.venueId;
      if (venueId) {
        await fetchSeats(venueId);
      } else {
        setError('This schedule has no venue linked. Please contact admin.');
      }
    } catch {
      setError('Failed to load seat data. Please try again.');
    }
    setLoading(false);
  }, [scheduleId, passedSchedule, fetchSeats]);
 
  useEffect(() => { fetchData(); }, []);
 
  // 3 min timer
  useEffect(() => {
    if (selectedSeats.length > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      const end = Date.now() + LOCK_MINUTES * 60 * 1000;
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.floor((end - Date.now()) / 1000));
        setLockTimer(remaining);
        if (remaining === 0) {
          clearInterval(timerRef.current);
          handleReleaseAll();
          setError('Your seat reservation expired. Please select seats again.');
        }
      }, 1000);
    }
    if (selectedSeats.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setLockTimer(null);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [selectedSeats.length]);
 
  const handleSeatClick = async (seat) => {
    const alreadySelected = selectedSeats.find(s => s.seatId === seat.seatId);
    if (alreadySelected) {
      try { await unlockSeat(seat.seatId, user.userId); } catch {}
      myLockedSeatIds.current = myLockedSeatIds.current.filter(id => id !== seat.seatId);
      setSelectedSeats(prev => prev.filter(s => s.seatId !== seat.seatId));
      if (schedule?.venueId) fetchSeats(schedule.venueId);
    } else {
      try {
        await lockSeat(seat.seatId, user.userId, parseInt(scheduleId));
        myLockedSeatIds.current = [...myLockedSeatIds.current, seat.seatId];
        setSelectedSeats(prev => [...prev, seat]);
        setError('');
        if (schedule?.venueId) fetchSeats(schedule.venueId);
      } catch {
        setError('This seat was just taken. Please choose another.');
        setTimeout(() => setError(''), 3000);
        if (schedule?.venueId) fetchSeats(schedule.venueId);
      }
    }
  };
 
  const handleReleaseAll = async () => {
    try { await Promise.allSettled(myLockedSeatIds.current.map(seatId => unlockSeat(seatId, user.userId))); } catch {}
    myLockedSeatIds.current = [];
    setSelectedSeats([]);
    if (schedule?.venueId) fetchSeats(schedule.venueId);
  };
 
  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    const totalAmount = selectedSeats.reduce((s, seat) => s + (parseFloat(seat.price) || 0), 0);
    navigate('/portal/checkout', {
      state: { schedule, show, venueName: getVenueName(schedule?.venueId), selectedSeats, totalAmount }
    });
  };
 
  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const totalAmount = selectedSeats.reduce((s, seat) => s + (parseFloat(seat.price) || 0), 0);
 
  // ── FIX: availableCount uses filtered lockedSeatIds (schedule-specific only) ──
  const availableCount = seats.filter(s =>
    !bookedSeatIds.includes(s.seatId) &&
    !lockedSeatIds.includes(s.seatId) &&
    !selectedSeats.find(sel => sel.seatId === s.seatId)
  ).length;
  const soldCount   = bookedSeatIds.length;
  const lockedCount = selectedSeats.length;
 
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );
 
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }} className="fade-in">
 
      <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 13, marginBottom: 20 }}
        onClick={() => { handleReleaseAll(); navigate(-1); }}>
        ← Back
      </button>
 
      {/* Show Info */}
      <div className="card" style={{ marginBottom: 20, padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 6 }}>{show?.title || `Schedule #${scheduleId}`}</h2>
            <div style={{ display: 'flex', gap: 20, color: 'var(--text-secondary)', fontSize: 13, flexWrap: 'wrap' }}>
              <span>📅 {schedule?.showDate} at {schedule?.showTime}</span>
              <span>📍 {getVenueName(schedule?.venueId)}</span>
            </div>
          </div>
          {lockTimer !== null && (
            <div style={{
              background: lockTimer < 60 ? 'rgba(192,57,43,0.15)' : 'rgba(212,175,55,0.1)',
              border: `2px solid ${lockTimer < 60 ? 'rgba(192,57,43,0.5)' : 'var(--border-accent)'}`,
              borderRadius: 10, padding: '10px 20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>🔒 Seats held for</div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: lockTimer < 60 ? '#e74c3c' : 'var(--gold)' }}>
                {fmt(lockTimer)}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>minutes</div>
            </div>
          )}
        </div>
      </div>
 
      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total',    value: seats.length,        color: 'var(--text-secondary)' },
          { label: 'Available',value: availableCount,      color: 'var(--teal)'           },
          { label: 'Sold',     value: soldCount,           color: '#e74c3c'               },
          { label: 'Locked',   value: lockedCount,         color: 'orange'                },
          { label: 'Selected', value: selectedSeats.length,color: 'var(--gold)'           },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
 
      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
 
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
 
        {/* Seat Grid */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 20px' }}>
          <SeatGrid
            seats={seats}
            selectedSeats={selectedSeats}
            bookedSeatIds={bookedSeatIds}
            lockedSeatIds={lockedSeatIds}
            onSeatClick={handleSeatClick}
            currentUserId={user?.userId}
          />
        </div>
 
        {/* Booking Summary */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-accent)', borderRadius: 16, padding: 20, position: 'sticky', top: 80 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
            Booking Summary
          </h3>
 
          {selectedSeats.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              Click on any available seat to select it
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                  Selected ({selectedSeats.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedSeats.map(s => (
                    <span key={s.seatId} onClick={() => handleSeatClick(s)} title="Click to deselect"
                      style={{ background: 'rgba(26,188,156,0.12)', border: '1px solid rgba(26,188,156,0.3)', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: 'var(--teal)', cursor: 'pointer' }}>
                      {s.seatNumber} ×
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
              {selectedSeats.map(s => (
                <div key={s.seatId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  <span>{s.seatNumber} <span style={{ fontSize: 11, opacity: 0.6 }}>({s.seatType})</span></span>
                  <span>₹{s.price || 0}</span>
                </div>
              ))}
              <div style={{ height: 1, background: 'var(--border-accent)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--gold)' }}>₹{totalAmount}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
                Taxes & discounts applied at checkout
              </div>
            </>
          )}
 
          <button className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: 14, marginTop: 16 }}
            disabled={selectedSeats.length === 0} onClick={handleProceed}>
            Proceed to Checkout →
          </button>
 
          {selectedSeats.length > 0 && (
            <button className="btn btn-ghost" style={{ width: '100%', padding: '10px', fontSize: 13, marginTop: 8 }} onClick={handleReleaseAll}>
              Clear Selection
            </button>
          )}
 
          {seats.length > 0 && (
            <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, fontWeight: 600 }}>
                Seat Pricing
              </div>
              {['PREMIUM', 'VIP', 'STANDARD'].map(type => {
                const typeSeat = seats.find(s => s.seatType === type);
                if (!typeSeat) return null;
                const typeColor = { VIP: 'var(--gold)', PREMIUM: '#9b59b6', STANDARD: 'var(--text-secondary)' }[type];
                return (
                  <div key={type} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: typeColor, fontWeight: 600 }}>{type}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>₹{typeSeat?.price || '—'}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 