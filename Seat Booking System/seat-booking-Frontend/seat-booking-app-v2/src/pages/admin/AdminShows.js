import React, { useEffect, useState } from 'react';
import { getAllShows, createShow, updateShow, deleteShow } from '../../services/api';

// Backend entity fields: showId, title, showType, genre, duration, language
const EMPTY = { title: '', genre: '', duration: '', language: '', showType: 'MOVIE' };

export default function AdminShows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchShows = async () => {
    setLoading(true);
    try { const r = await getAllShows(); setShows(r.data || []); } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchShows(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ title: s.title, genre: s.genre, duration: s.duration, language: s.language, showType: s.showType });
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
      if (editing) await updateShow(editing.showId, form);
      else await createShow(form);
      closeModal();
      fetchShows();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save show.');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try { await deleteShow(id); fetchShows(); } catch {}
    setDeleteId(null);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Shows</h1>
          <p className="page-title-sub">Manage all movies, events, and concerts</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Show</button>
      </div>

      {loading ? <div className="spinner" /> : shows.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🎬</div><p>No shows yet.</p></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead><tr>
              <th>Title</th><th>Type</th><th>Genre</th><th>Language</th><th>Duration</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {shows.map((s) => (
                <tr key={s.showId}>
                  <td>{s.title}</td>
                  <td><span className="badge badge-gold">{s.showType}</span></td>
                  <td>{s.genre || '—'}</td>
                  <td>{s.language || '—'}</td>
                  <td>{s.duration ? `${s.duration} min` : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setDeleteId(s.showId)}>Delete</button>
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
            <h2 style={{ marginBottom: 6, fontSize: '1.5rem' }}>{editing ? 'Edit Show' : 'Add Show'}</h2>
            <div className="gold-line" />
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Title *</label>
                <input name="title" className="form-control" placeholder="e.g. Avengers: Endgame" value={form.title} onChange={handleChange} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Type</label>
                  <select name="showType" className="form-control" value={form.showType} onChange={handleChange}>
                    <option value="MOVIE">Movie</option>
                    <option value="EVENT">Event</option>
                    <option value="CONCERT">Concert</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <input name="genre" className="form-control" placeholder="e.g. Action" value={form.genre} onChange={handleChange} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Language</label>
                  <input name="language" className="form-control" placeholder="e.g. English" value={form.language} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Duration (min)</label>
                  <input name="duration" type="number" className="form-control" placeholder="e.g. 150" value={form.duration} onChange={handleChange} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Show' : 'Add Show'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 380 }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>Delete Show?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This action cannot be undone.</p>
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
