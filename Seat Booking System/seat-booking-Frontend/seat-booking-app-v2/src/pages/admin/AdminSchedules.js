import React, { useEffect, useState } from 'react';
import { getAllSchedules, getAllShows, getAllVenues, createSchedule, updateSchedule, deleteSchedule } from '../../services/api';

// Backend entity fields: scheduleId, showId, venueId, showDate (LocalDate), showTime (LocalTime)
const EMPTY = { showId: '', venueId: '', showDate: '', showTime: '' };

export default function AdminSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [shows, setShows] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sc, sh, v] = await Promise.allSettled([getAllSchedules(), getAllShows(), getAllVenues()]);
      if (sc.status === 'fulfilled') setSchedules(sc.value.data || []);
      if (sh.status === 'fulfilled') setShows(sh.value.data || []);
      if (v.status === 'fulfilled') setVenues(v.value.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({
      showId: s.showId || '',
      venueId: s.venueId || '',
      showDate: s.showDate || '',
      showTime: s.showTime || '',
    });
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
      if (editing) await updateSchedule(editing.scheduleId, form);
      else await createSchedule(form);
      closeModal();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save schedule.');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try { await deleteSchedule(id); fetchAll(); } catch {}
    setDeleteId(null);
  };

  // Helper lookups since schedule only stores IDs
  const getShowTitle = (s) => shows.find(sh => sh.showId === s.showId)?.title || `Show #${s.showId}`;
  const getVenueName = (s) => venues.find(v => v.venueId === s.venueId)?.venueName || `Venue #${s.venueId}`;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Show Schedules</h1>
          <p className="page-title-sub">Create and manage show timings at venues</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ New Schedule</button>
      </div>

      {loading ? <div className="spinner" /> : schedules.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📅</div><p>No schedules yet.</p></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead><tr>
              <th>Show</th><th>Venue</th><th>Date</th><th>Time</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.scheduleId}>
                  <td>{getShowTitle(s)}</td>
                  <td>{getVenueName(s)}</td>
                  <td>{s.showDate || '—'}</td>
                  <td>{s.showTime || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setDeleteId(s.scheduleId)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h2 style={{ marginBottom: 6, fontSize: '1.5rem' }}>{editing ? 'Edit Schedule' : 'Create Schedule'}</h2>
            <div className="gold-line" />
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Show *</label>
                <select name="showId" className="form-control" value={form.showId} onChange={handleChange} required>
                  <option value="">Select a show</option>
                  {shows.map(s => <option key={s.showId} value={s.showId}>{s.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Venue *</label>
                <select name="venueId" className="form-control" value={form.venueId} onChange={handleChange} required>
                  <option value="">Select a venue</option>
                  {venues.map(v => <option key={v.venueId} value={v.venueId}>{v.venueName} — {v.city}</option>)}
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Date *</label>
                  <input name="showDate" type="date" className="form-control" value={form.showDate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input name="showTime" type="time" className="form-control" value={form.showTime} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 380 }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>Delete Schedule?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This cannot be undone.</p>
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
