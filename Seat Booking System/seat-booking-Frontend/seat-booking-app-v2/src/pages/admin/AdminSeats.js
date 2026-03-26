import React, { useEffect, useState } from 'react';
import { getAllVenues, getSeatsByVenue, createSeat, updateSeat, deleteSeat } from '../../services/api';
 
const EMPTY = { venueId: '', seatNumber: '', seatType: 'STANDARD', price: '' };
 
export default function AdminSeats() {
  const [venues, setVenues] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bulkModal, setBulkModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
 
  // ── Bulk form — 3 sections ──────────────────────────────────────────────────
  const [bulk, setBulk] = useState({
    premiumRows: 2, premiumSeatsPerRow: 6, premiumPrice: 250,
    vipRows: 2,     vipSeatsPerRow: 6,     vipPrice: 300,
    standardRows: 2,standardSeatsPerRow: 6,standardPrice: 200,
  });
 
  useEffect(() => {
    getAllVenues().then(r => setVenues(r.data || [])).catch(() => {});
  }, []);
 
  const fetchSeats = async (venueId) => {
    if (!venueId) { setSeats([]); return; }
    setLoading(true);
    try { const r = await getSeatsByVenue(venueId); setSeats(r.data || []); } catch {}
    setLoading(false);
  };
 
  const handleVenueChange = (e) => { setSelectedVenue(e.target.value); fetchSeats(e.target.value); };
  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, venueId: selectedVenue }); setError(''); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ venueId: s.venueId, seatNumber: s.seatNumber, seatType: s.seatType, price: s.price }); setError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setError(''); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editing) await updateSeat(editing.seatId, form);
      else await createSeat(form);
      closeModal();
      fetchSeats(selectedVenue);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save seat.');
    }
    setSaving(false);
  };
 
  // ── Bulk Add — PREMIUM rows first, then VIP, then STANDARD ─────────────────
  const handleBulkAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
 
    const sections = [
      { type: 'PREMIUM',  rows: parseInt(bulk.premiumRows),  seatsPerRow: parseInt(bulk.premiumSeatsPerRow),  price: parseFloat(bulk.premiumPrice)  },
      { type: 'VIP',      rows: parseInt(bulk.vipRows),      seatsPerRow: parseInt(bulk.vipSeatsPerRow),      price: parseFloat(bulk.vipPrice)      },
      { type: 'STANDARD', rows: parseInt(bulk.standardRows), seatsPerRow: parseInt(bulk.standardSeatsPerRow), price: parseFloat(bulk.standardPrice) },
    ];
 
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let rowIndex = 0;
 
    try {
      for (const section of sections) {
        for (let r = 0; r < section.rows; r++) {
          for (let s = 1; s <= section.seatsPerRow; s++) {
            await createSeat({
              venueId: selectedVenue,
              seatNumber: `${rowLabels[rowIndex]}${s}`,
              seatType: section.type,
              price: section.price,
            });
          }
          rowIndex++;
        }
      }
      setBulkModal(false);
      fetchSeats(selectedVenue);
    } catch {
      setError('Failed to add some seats.');
    }
    setSaving(false);
  };
 
  const handleDelete = async (id) => {
    try { await deleteSeat(id); fetchSeats(selectedVenue); } catch {}
    setDeleteId(null);
  };
 
  const seatTypeBadge = (t) => ({ VIP: 'badge-gold', PREMIUM: 'badge-teal', STANDARD: 'badge-gray', RECLINER: 'badge-gold' }[t] || 'badge-gray');
 
  // Group seats by type
  const premiumSeats = seats.filter(s => s.seatType === 'PREMIUM');
  const vipSeats     = seats.filter(s => s.seatType === 'VIP');
  const standardSeats = seats.filter(s => s.seatType === 'STANDARD' || !s.seatType);
 
  // Preview row letters
  const pEnd = parseInt(bulk.premiumRows || 0);
  const vEnd = pEnd + parseInt(bulk.vipRows || 0);
  const sEnd = vEnd + parseInt(bulk.standardRows || 0);
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const totalBulkSeats =
    (parseInt(bulk.premiumRows || 0) * parseInt(bulk.premiumSeatsPerRow || 0)) +
    (parseInt(bulk.vipRows || 0)     * parseInt(bulk.vipSeatsPerRow || 0)) +
    (parseInt(bulk.standardRows || 0)* parseInt(bulk.standardSeatsPerRow || 0));
 
  return (
    <div className="fade-in">
      <div className="page-header">
        <div><h1>Seat Management</h1><p className="page-title-sub">Configure seating for each venue</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setBulkModal(true)} disabled={!selectedVenue}>⚡ Bulk Add</button>
          <button className="btn btn-primary" onClick={openAdd} disabled={!selectedVenue}>+ Add Seat</button>
        </div>
      </div>
 
      {/* Venue Selector */}
      <div className="card" style={{ marginBottom: 28, padding: '20px 24px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Select Venue</label>
          <select className="form-control" value={selectedVenue} onChange={handleVenueChange} style={{ maxWidth: 400 }}>
            <option value="">Choose a venue...</option>
            {venues.map(v => <option key={v.venueId} value={v.venueId}>{v.venueName} — {v.city}</option>)}
          </select>
        </div>
      </div>
 
      {/* Seat Stats */}
      {selectedVenue && seats.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Total', value: seats.length, color: 'var(--text-secondary)' },
            { label: 'Premium', value: premiumSeats.length, color: '#9b59b6' },
            { label: 'VIP', value: vipSeats.length, color: 'var(--gold)' },
            { label: 'Standard', value: standardSeats.length, color: 'var(--teal)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
 
      {/* Seats Display */}
      {!selectedVenue ? (
        <div className="empty-state"><div className="empty-icon">💺</div><p>Select a venue to manage seats</p></div>
      ) : loading ? <div className="spinner" /> : seats.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">💺</div><p>No seats yet. Use ⚡ Bulk Add to create Premium, VIP and Standard seats.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'PREMIUM',  seats: premiumSeats,  color: '#9b59b6',        bg: 'rgba(155,89,182,0.08)',  border: 'rgba(155,89,182,0.3)'  },
            { label: 'VIP',      seats: vipSeats,      color: 'var(--gold)',     bg: 'rgba(212,175,55,0.08)', border: 'rgba(212,175,55,0.3)'  },
            { label: 'STANDARD', seats: standardSeats, color: 'var(--teal)',     bg: 'rgba(26,188,156,0.06)', border: 'rgba(26,188,156,0.2)'  },
          ].map(section => section.seats.length === 0 ? null : (
            <div key={section.label} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: section.bg, border: `1px solid ${section.border}`, borderRadius: 20, padding: '4px 16px', fontSize: 12, fontWeight: 700, color: section.color, letterSpacing: 1 }}>
                    {section.label}
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{section.seats.length} seats</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {section.seats.sort((a, b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true })).map(seat => (
                  <div key={seat.seatId} style={{
                    background: section.bg, border: `1px solid ${section.border}`,
                    borderRadius: 8, padding: '8px 12px', minWidth: 72, textAlign: 'center', position: 'relative'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: section.color }}>{seat.seatNumber}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>₹{seat.price}</div>
                    <button onClick={() => setDeleteId(seat.seatId)}
                      style={{ position: 'absolute', top: 2, right: 4, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11 }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
 
          {/* Table view */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>All Seats</h3>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Seat Number</th><th>Type</th><th>Price</th><th>Actions</th></tr></thead>
                <tbody>
                  {seats.map(s => (
                    <tr key={s.seatId}>
                      <td><strong>{s.seatNumber}</strong></td>
                      <td><span className={`badge ${seatTypeBadge(s.seatType)}`}>{s.seatType}</span></td>
                      <td>{s.price ? `₹${s.price}` : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => openEdit(s)}>Edit</button>
                          <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => setDeleteId(s.seatId)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
 
      {/* ── Bulk Add Modal ── */}
      {bulkModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setBulkModal(false)}>
          <div className="modal-box" style={{ maxWidth: 680 }}>
            <button className="modal-close" onClick={() => setBulkModal(false)}>✕</button>
            <h2 style={{ marginBottom: 6, fontSize: '1.5rem' }}>⚡ Bulk Add Seats</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 12 }}>
              Adds Premium rows first (A, B...), then VIP, then Standard — automatically.
            </p>
            <div className="gold-line" />
            {error && <div className="alert alert-error">{error}</div>}
 
            <form onSubmit={handleBulkAdd}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
 
                {/* PREMIUM */}
                <div style={{ background: 'rgba(155,89,182,0.08)', border: '1px solid rgba(155,89,182,0.3)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 700, color: '#9b59b6', marginBottom: 12, fontSize: 13 }}>🟣 PREMIUM</div>
                  <div className="form-group">
                    <label>Rows</label>
                    <input type="number" className="form-control" min="0" max="10"
                      value={bulk.premiumRows} onChange={e => setBulk({ ...bulk, premiumRows: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Seats / Row</label>
                    <input type="number" className="form-control" min="1" max="20"
                      value={bulk.premiumSeatsPerRow} onChange={e => setBulk({ ...bulk, premiumSeatsPerRow: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Price (₹)</label>
                    <input type="number" className="form-control"
                      value={bulk.premiumPrice} onChange={e => setBulk({ ...bulk, premiumPrice: e.target.value })} />
                  </div>
                </div>
 
                {/* VIP */}
                <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: 12, fontSize: 13 }}>🟡 VIP</div>
                  <div className="form-group">
                    <label>Rows</label>
                    <input type="number" className="form-control" min="0" max="10"
                      value={bulk.vipRows} onChange={e => setBulk({ ...bulk, vipRows: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Seats / Row</label>
                    <input type="number" className="form-control" min="1" max="20"
                      value={bulk.vipSeatsPerRow} onChange={e => setBulk({ ...bulk, vipSeatsPerRow: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Price (₹)</label>
                    <input type="number" className="form-control"
                      value={bulk.vipPrice} onChange={e => setBulk({ ...bulk, vipPrice: e.target.value })} />
                  </div>
                </div>
 
                {/* STANDARD */}
                <div style={{ background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.3)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 700, color: 'var(--teal)', marginBottom: 12, fontSize: 13 }}>🟢 STANDARD</div>
                  <div className="form-group">
                    <label>Rows</label>
                    <input type="number" className="form-control" min="0" max="10"
                      value={bulk.standardRows} onChange={e => setBulk({ ...bulk, standardRows: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Seats / Row</label>
                    <input type="number" className="form-control" min="1" max="20"
                      value={bulk.standardSeatsPerRow} onChange={e => setBulk({ ...bulk, standardSeatsPerRow: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Price (₹)</label>
                    <input type="number" className="form-control"
                      value={bulk.standardPrice} onChange={e => setBulk({ ...bulk, standardPrice: e.target.value })} />
                  </div>
                </div>
              </div>
 
              {/* Preview */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>Row layout:</span>
                {pEnd > 0 && <span style={{ color: '#9b59b6' }}>PREMIUM: {rowLabels[0]}–{rowLabels[pEnd - 1]} </span>}
                {parseInt(bulk.vipRows) > 0 && <span style={{ color: 'var(--gold)', marginLeft: 8 }}>VIP: {rowLabels[pEnd]}–{rowLabels[vEnd - 1]} </span>}
                {parseInt(bulk.standardRows) > 0 && <span style={{ color: 'var(--teal)', marginLeft: 8 }}>STANDARD: {rowLabels[vEnd]}–{rowLabels[sEnd - 1]} </span>}
                <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>({totalBulkSeats} total seats)</span>
              </div>
 
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setBulkModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Creating seats...' : `⚡ Create ${totalBulkSeats} Seats`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
 
      {/* ── Single Add/Edit Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h2 style={{ marginBottom: 6, fontSize: '1.5rem' }}>{editing ? 'Edit Seat' : 'Add Seat'}</h2>
            <div className="gold-line" />
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Venue</label>
                <select name="venueId" className="form-control" value={form.venueId} onChange={handleChange} required>
                  <option value="">Select venue</option>
                  {venues.map(v => <option key={v.venueId} value={v.venueId}>{v.venueName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Seat Number</label>
                <input name="seatNumber" className="form-control" placeholder="e.g. A1" value={form.seatNumber} onChange={handleChange} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Seat Type</label>
                  <select name="seatType" className="form-control" value={form.seatType} onChange={handleChange}>
                    <option value="PREMIUM">Premium</option>
                    <option value="VIP">VIP</option>
                    <option value="STANDARD">Standard</option>
                    <option value="RECLINER">Recliner</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input name="price" type="number" className="form-control" placeholder="e.g. 250" value={form.price} onChange={handleChange} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Add Seat'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
 
      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 380 }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>Delete Seat?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This seat will be permanently removed.</p>
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