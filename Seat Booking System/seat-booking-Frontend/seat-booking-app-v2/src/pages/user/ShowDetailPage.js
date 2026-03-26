import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShowById, getSchedulesByShow, getAllVenues } from '../../services/api';
 
export default function ShowDetailPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
 
  const [show, setShow] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, sc, v] = await Promise.allSettled([
          getShowById(showId),
          getSchedulesByShow(showId),
          getAllVenues(),
        ]);
        if (s.status === 'fulfilled') setShow(s.value.data);
        if (sc.status === 'fulfilled') {
          const scData = sc.value.data || [];
 
          // ── Filter out past dates ──────────────────────────────────────────
          const today = new Date();
          today.setHours(0, 0, 0, 0);
 
          const futureSchedules = scData.filter(sc => {
            const showDate = new Date(sc.showDate);
            showDate.setHours(0, 0, 0, 0);
 
            // If today — only show if time hasn't passed yet
            if (showDate.getTime() === today.getTime()) {
              const now = new Date();
              const [h, m] = (sc.showTime || '00:00').split(':');
              const showDateTime = new Date();
              showDateTime.setHours(parseInt(h), parseInt(m), 0, 0);
              return showDateTime > now;
            }
 
            return showDate > today;
          });
 
          setSchedules(futureSchedules);
 
          // Auto select first available future date
          if (futureSchedules.length > 0) {
            const dates = [...new Set(futureSchedules.map(s => s.showDate).filter(Boolean))].sort();
            if (dates.length > 0) setSelectedDate(dates[0]);
          }
        }
        if (v.status === 'fulfilled') setVenues(v.value.data || []);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [showId]);
 
  const getVenueName = (venueId) => venues.find(v => v.venueId === venueId)?.venueName || `Venue #${venueId}`;
  const getVenueCity = (venueId) => venues.find(v => v.venueId === venueId)?.city || '';
 
  // Get unique sorted future dates only
  const allDates = [...new Set(schedules.map(s => s.showDate).filter(Boolean))].sort();
 
  const schedulesForDate = selectedDate
    ? schedules.filter(s => s.showDate === selectedDate)
    : [];
 
  const groupedByVenue = schedulesForDate.reduce((acc, s) => {
    const key = s.venueId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});
 
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase(),
      date: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    };
  };
 
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };
 
  const isToday = (dateStr) => new Date(dateStr).toDateString() === new Date().toDateString();
  const isTomorrow = (dateStr) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(dateStr).toDateString() === tomorrow.toDateString();
  };
 
  if (loading) return <div className="user-page"><div className="spinner" /></div>;
  if (!show) return (
    <div className="user-page">
      <div className="empty-state"><div className="empty-icon">❌</div><p>Show not found.</p></div>
    </div>
  );
 
  return (
    <div className="fade-in" style={{ minHeight: '100vh' }}>
 
      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0d14 0%, #1a1206 60%, #0d0d14 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '32px 0 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <button className="btn btn-ghost"
            style={{ padding: '6px 12px', fontSize: 13, marginBottom: 20 }}
            onClick={() => navigate(-1)}>
            ← Back
          </button>
 
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap', paddingBottom: 28 }}>
            {/* Poster */}
            <div style={{
              width: 130, height: 180, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(26,188,156,0.08))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52,
              border: '1px solid var(--border)',
            }}>
              {show.showType === 'MOVIE' ? '🎬' : show.showType === 'CONCERT' ? '🎵' : '🎪'}
            </div>
 
            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span className="badge badge-gold">{show.showType}</span>
                {show.language && <span className="badge badge-gray">{show.language}</span>}
                {show.duration > 0 && <span className="badge badge-gray">{show.duration}m</span>}
              </div>
              <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>{show.title}</h1>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: 14 }}>
                {show.genre && <span>🎭 {show.genre}</span>}
                {show.language && <span>🌐 {show.language}</span>}
                {show.duration > 0 && <span>⏱ {show.duration} min</span>}
              </div>
            </div>
          </div>
        </div>
 
        {/* ── Date Selector Row ── */}
        {allDates.length > 0 ? (
          <div style={{ borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
              <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
                {allDates.map(date => {
                  const { day, date: d, month } = formatDate(date);
                  const isSelected = selectedDate === date;
                  const label = isToday(date) ? 'TODAY' : isTomorrow(date) ? 'TOMORROW' : null;
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      style={{
                        padding: '14px 20px',
                        background: 'none', border: 'none',
                        borderBottom: isSelected ? '3px solid var(--gold)' : '3px solid transparent',
                        cursor: 'pointer', textAlign: 'center',
                        minWidth: 72, transition: 'all 0.15s', flexShrink: 0,
                      }}
                    >
                      {label && (
                        <div style={{ fontSize: 9, fontWeight: 700, color: isSelected ? 'var(--gold)' : 'var(--teal)', letterSpacing: '1px', marginBottom: 2 }}>
                          {label}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: isSelected ? 'var(--gold)' : 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px' }}>
                        {day}
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: isSelected ? 'var(--gold)' : 'var(--text-primary)', lineHeight: 1.2 }}>
                        {d}
                      </div>
                      <div style={{ fontSize: 11, color: isSelected ? 'var(--gold)' : 'var(--text-muted)', fontWeight: 600 }}>
                        {month}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // ── No future schedules banner ──
          <div style={{ borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)',
                borderRadius: 8, padding: '8px 16px',
                fontSize: 13, color: '#e74c3c',
              }}>
                📅 No upcoming shows scheduled. Check back later!
              </div>
            </div>
          </div>
        )}
      </div>
 
      {/* ── Venue + Time Slots ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
 
        {allDates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <p>No upcoming schedules for this show.</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
              All shows for this title have already ended.
            </p>
          </div>
        ) : (
          <>
            {/* Filter bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                {Object.keys(groupedByVenue).length} venue{Object.keys(groupedByVenue).length !== 1 ? 's' : ''} available
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--teal)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
                  Available
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#e74c3c' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e74c3c', display: 'inline-block' }} />
                  Fast Filling
                </span>
              </div>
            </div>
 
            {schedulesForDate.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>No shows available on this date.</p>
              </div>
            ) : (
              Object.entries(groupedByVenue).map(([venueId, venueSchedules]) => (
                <div key={venueId} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '20px 24px', marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                        {getVenueName(parseInt(venueId))}
                      </h3>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        📍 {getVenueCity(parseInt(venueId))}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 8px', color: 'var(--text-muted)' }}>
                      Cancellation Available
                    </span>
                  </div>
 
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {venueSchedules
                      .sort((a, b) => (a.showTime || '').localeCompare(b.showTime || ''))
                      .map(s => {
                        const isFastFilling = s.scheduleId % 3 === 0;
                        return (
                          <button
                            key={s.scheduleId}
                            onClick={() => navigate(`/portal/seats/${s.scheduleId}`, {
                              state: { schedule: s, show, venues }
                            })}
                            style={{
                              padding: '10px 18px',
                              background: 'transparent',
                              border: `1px solid ${isFastFilling ? '#e74c3c' : 'var(--teal)'}`,
                              borderRadius: 8, cursor: 'pointer',
                              transition: 'all 0.15s', textAlign: 'center', minWidth: 90,
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = isFastFilling ? 'rgba(192,57,43,0.12)' : 'rgba(26,188,156,0.12)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div style={{ fontSize: 15, fontWeight: 700, color: isFastFilling ? '#e74c3c' : 'var(--teal)' }}>
                              {formatTime(s.showTime)}
                            </div>
                            {isFastFilling && (
                              <div style={{ fontSize: 9, color: '#e74c3c', fontWeight: 600, letterSpacing: '0.5px', marginTop: 2 }}>
                                FAST FILLING
                              </div>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}