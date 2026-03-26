import React, { useEffect, useState } from 'react';
import { getAllVenues, createVenue, updateVenue, deleteVenue, getSeatsByVenue } from '../../services/api';
 
const EMPTY = { venueName: '', address: '', city: '', state: '', capacity: '' };
 
export default function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [seatData, setSeatData] = useState({}); // { venueId: { total, vip, premium, regular } }
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
 
  const fetchSeatData = async (venueList) => {
    const data = {};
    await Promise.allSettled(
      venueList.map(async (v) => {
        try {
          const r = await getSeatsByVenue(v.venueId);
          const seats = r.data || [];
          data[v.venueId] = {
            total: seats.length,
            vip: seats.filter(s => s.seatType === 'VIP').length,
            premium: seats.filter(s => s.seatType === 'PREMIUM').length,
            regular: seats.filter(s => s.seatType === 'STANDARD' || s.seatType === 'REGULAR' || s.seatType === 'RECLINER').length,
          };
        } catch {
          data[v.venueId] = { total: 0, vip: 0, premium: 0, regular: 0 };
        }
      })
    );
    setSeatData(data);
  };
 
  const fetchVenues = async () => {
    setLoading(true);
    try {
      const r = await getAllVenues();
      const venueList = r.data || [];
      setVenues(venueList);
      fetchSeatData(venueList);
    } catch {}
    setLoading(false);
  };
 
  useEffect(() => { fetchVenues(); }, []);
 
  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (v) => {
    setEditing(v);
    setForm({ venueName: v.venueName, address: v.address, city: v.city, state: v.state, capacity: v.capacity });
    setError('');
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); setError(''); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editing) await updateVenue(editing.venueId, form);
      else await createVenue(form);
      closeModal();
      fetchVenues();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save venue.');
    }
    setSaving(false);
  };
 
  const handleDelete = async (id) => {
    try { await deleteVenue(id); fetchVenues(); } catch {}
    setDeleteId(null);
  };
 
  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Venues</h1>
          <p className="page-title-sub">Manage theatres, stadiums, and event spaces</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Venue</button>
      </div>
 
      {loading ? <div className="spinner" /> : venues.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🏛️</div><p>No venues yet.</p></div>
      ) : (
        <div className="grid-3">
          {venues.map((v) => {
            const sd = seatData[v.venueId];
            const capacity = parseInt(v.capacity) || 0;
            const total = sd?.total ?? '...';
            const fillPercent = (capacity > 0 && sd) ? Math.min(100, Math.round((sd.total / capacity) * 100)) : 0;
            const fillColor = fillPercent >= 80 ? '#e74c3c' : fillPercent >= 50 ? 'orange' : 'var(--teal)';
 
            return (
              <div className="card" key={v.venueId}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span className="badge badge-teal">VENUE</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => openEdit(v)}>Edit</button>
                    <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => setDeleteId(v.venueId)}>✕</button>
                  </div>
                </div>
 
                {/* Venue Info */}
                <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>{v.venueName}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>📍 {v.city}, {v.state}</p>
                {v.address && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{v.address}</p>}
 
                <div className="gold-line" />
 
                {/* Total + capacity */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 13, color: fillColor, fontWeight: 600 }}>
                      🪑 {total} seats configured
                    </p>
                    {capacity > 0 && (
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        Venue capacity: {capacity}
                      </p>
                    )}
                  </div>
                  {capacity > 0 && sd && (
                    <span style={{ fontSize: 12, color: fillColor, fontWeight: 700 }}>{fillPercent}%</span>
                  )}
                </div>
 
                {/* Fill bar */}
                {capacity > 0 && sd && (
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 4, overflow: 'hidden', marginBottom: 14 }}>
                    <div style={{ height: '100%', width: `${fillPercent}%`, background: fillColor, borderRadius: 4, transition: 'width 0.5s ease' }} />
                  </div>
                )}
 
                {/* ── 3 Category Breakdown ── */}
                {sd && sd.total > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {/* VIP */}
                    <div style={{
                      background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: 10, padding: '10px 8px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 16, marginBottom: 4 }}>👑</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>
                        {sd.vip}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.5px', marginTop: 3, textTransform: 'uppercase' }}>
                        VIP
                      </div>
                    </div>
 
                    {/* Premium */}
                    <div style={{
                      background: 'rgba(155,89,182,0.08)', border: '1px solid rgba(155,89,182,0.2)',
                      borderRadius: 10, padding: '10px 8px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 16, marginBottom: 4 }}>⭐</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#9b59b6', lineHeight: 1 }}>
                        {sd.premium}
                      </div>
                      <div style={{ fontSize: 10, color: '#9b59b6', fontWeight: 600, letterSpacing: '0.5px', marginTop: 3, textTransform: 'uppercase' }}>
                        Premium
                      </div>
                    </div>
 
                    {/* Regular */}
                    <div style={{
                      background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.2)',
                      borderRadius: 10, padding: '10px 8px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 16, marginBottom: 4 }}>🪑</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--teal)', lineHeight: 1 }}>
                        {sd.regular}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.5px', marginTop: 3, textTransform: 'uppercase' }}>
                        Regular
                      </div>
                    </div>
                  </div>
                ) : sd && sd.total === 0 ? (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>
                    No seats added yet — go to Seats to configure
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>
                    Loading seat info...
                  </div>
                )}
 
                {/* Overflow warning */}
                {sd && capacity > 0 && sd.total > capacity && (
                  <p style={{ fontSize: 11, color: '#e74c3c', marginTop: 10, textAlign: 'center' }}>
                    ⚠️ Seats configured exceed venue capacity!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
 
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h2 style={{ marginBottom: 6, fontSize: '1.5rem' }}>{editing ? 'Edit Venue' : 'Add Venue'}</h2>
            <div className="gold-line" />
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Venue Name *</label>
                <input name="venueName" className="form-control" placeholder="e.g. PVR Cinemas" value={form.venueName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input name="address" className="form-control" placeholder="Street address" value={form.address} onChange={handleChange} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>City *</label>
                  <input name="city" className="form-control" placeholder="e.g. Chennai" value={form.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" className="form-control" placeholder="e.g. Tamil Nadu" value={form.state} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Total Capacity</label>
                <input name="capacity" type="number" className="form-control" placeholder="e.g. 300" value={form.capacity} onChange={handleChange} />
              </div>
              <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid var(--border-accent)', borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  💡 After adding the venue, go to <strong style={{ color: 'var(--gold)' }}>Seats</strong> to add VIP, Premium, and Regular seats separately.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Venue' : 'Add Venue'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
 
      {/* Delete Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 380 }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>Delete Venue?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              This will remove the venue and all its seat configurations.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}