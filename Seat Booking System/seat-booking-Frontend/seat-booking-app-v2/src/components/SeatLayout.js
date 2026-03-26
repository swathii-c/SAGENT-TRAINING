import React from 'react';
import '../styles/seats.css';

// Seats entity: seatId, seatNumber, seatType, price, venueId
// No "row" field — derive row from first character of seatNumber (e.g. "A1" → row "A")

const TYPE_CLASS = { VIP: 'vip', PREMIUM: 'premium', RECLINER: 'recliner', STANDARD: 'standard' };

export default function SeatLayout({ seats, selectedSeats, bookedSeatIds, lockedSeatIds, onSeatClick }) {
  // Derive row from seatNumber prefix (letters before the number)
  const getRow = (seatNumber) => {
    if (!seatNumber) return '?';
    const match = seatNumber.match(/^([A-Za-z]+)/);
    return match ? match[1].toUpperCase() : '?';
  };

  // Group by derived row
  const grouped = seats.reduce((acc, seat) => {
    const row = getRow(seat.seatNumber);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(grouped).sort();

  const getSeatStatus = (seat) => {
    if (bookedSeatIds?.includes(seat.seatId)) return 'booked';
    if (lockedSeatIds?.includes(seat.seatId)) return 'locked';
    if (selectedSeats?.some(s => s.seatId === seat.seatId)) return 'selected';
    return 'available';
  };

  const getSeatClass = (seat) => {
    const status = getSeatStatus(seat);
    const typeClass = TYPE_CLASS[seat.seatType] || 'standard';
    return `seat ${typeClass} ${status}`;
  };

  return (
    <div>
      {/* Screen */}
      <div className="screen-container">
        <div className="screen-bar" />
        <div className="screen-label">Screen / Stage</div>
      </div>

      {/* Legend */}
      <div className="seat-legend">
        {[
          { label: 'Available', bg: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.12)' },
          { label: 'Selected', bg: 'var(--teal)', border: 'var(--teal)' },
          { label: 'Locked', bg: 'rgba(255,165,0,0.2)', border: 'rgba(255,165,0,0.4)' },
          { label: 'VIP', bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.3)' },
          { label: 'Premium', bg: 'rgba(155,89,182,0.12)', border: 'rgba(155,89,182,0.3)' },
        ].map(l => (
          <div className="legend-item" key={l.label}>
            <div className="legend-seat" style={{ background: l.bg, borderColor: l.border }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Seat Grid */}
      <div className="seat-grid-wrapper">
        {sortedRows.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
            No seats configured for this venue
          </div>
        ) : sortedRows.map(row => {
          const rowSeats = grouped[row].sort((a, b) => {
            // Sort numerically by the number part of seatNumber
            const numA = parseInt(a.seatNumber.replace(/\D/g, '')) || 0;
            const numB = parseInt(b.seatNumber.replace(/\D/g, '')) || 0;
            return numA - numB;
          });

          return (
            <div className="seat-row" key={row}>
              <div className="seat-row-label">{row}</div>
              {rowSeats.map((seat, idx) => {
                const status = getSeatStatus(seat);
                const isDisabled = status === 'booked' || status === 'locked';
                return (
                  <React.Fragment key={seat.seatId}>
                    {idx > 0 && idx % 5 === 0 && <div className="seat-gap" />}
                    <div
                      className={getSeatClass(seat)}
                      title={`${seat.seatNumber} (${seat.seatType}) — ₹${seat.price || '?'}\n${status}`}
                      onClick={() => !isDisabled && onSeatClick && onSeatClick(seat)}
                      style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                    >
                      {status === 'selected' && '✓'}
                    </div>
                  </React.Fragment>
                );
              })}
              <div className="seat-row-label">{row}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
