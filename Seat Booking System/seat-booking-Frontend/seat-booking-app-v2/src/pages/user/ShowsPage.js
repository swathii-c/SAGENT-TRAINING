import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllShows } from '../../services/api';
 
const TYPE_FILTERS = ['ALL', 'MOVIE', 'CONCERT', 'EVENT'];
const EMOJI = { MOVIE: '🎬', CONCERT: '🎵', EVENT: '🎪' };
 
export default function ShowsPage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
 
  useEffect(() => {
    getAllShows().then(r => setShows(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);
 
  // Get unique genres from shows dynamically
  const genres = ['ALL', ...new Set(shows.map(s => s.genre).filter(Boolean))];
 
  const filtered = shows.filter(s => {
    const matchType   = filter === 'ALL' || s.showType === filter;
    const matchGenre  = selectedGenre === 'ALL' || s.genre === selectedGenre;
    const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.genre?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchGenre && matchSearch;
  });
 
  return (
    <div className="user-page fade-in">
      <div className="page-header">
        <div>
          <h1>All Shows</h1>
          <p className="page-title-sub">Browse and book from {shows.length} available shows</p>
        </div>
      </div>
 
      {/* ── Filters Row ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
 
        {/* Type filter buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          {TYPE_FILTERS.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`btn ${filter === t ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '7px 16px', fontSize: 13 }}>
              {t === 'ALL' ? 'All' : `${EMOJI[t]} ${t}`}
            </button>
          ))}
        </div>
 
        {/* Genre dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{
            fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap'
          }}>
            Genre
          </label>
          <select
            className="form-control"
            value={selectedGenre}
            onChange={e => setSelectedGenre(e.target.value)}
            style={{ minWidth: 150 }}
          >
            {genres.map(g => (
              <option key={g} value={g}>
                {g === 'ALL' ? 'All Genres' : g}
              </option>
            ))}
          </select>
        </div>
 
        {/* Reset button */}
        {(selectedGenre !== 'ALL' || filter !== 'ALL' || search) && (
          <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }}
            onClick={() => { setSelectedGenre('ALL'); setFilter('ALL'); setSearch(''); }}>
            ✕ Reset
          </button>
        )}
 
        {/* Search + count */}
        <input className="form-control" style={{ maxWidth: 240, marginLeft: 'auto' }}
          placeholder="Search shows..." value={search} onChange={e => setSearch(e.target.value)} />
 
        <span style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {filtered.length} show{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>
 
      {/* ── Shows Grid ── */}
      {loading ? <div className="spinner" /> : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎭</div>
          <p>No shows match your filters.</p>
          <button className="btn btn-ghost" style={{ marginTop: 12 }}
            onClick={() => { setSelectedGenre('ALL'); setFilter('ALL'); setSearch(''); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(s => (
            <Link key={s.showId} to={`/portal/shows/${s.showId}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(26,188,156,0.06))',
                  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 52, height: 120, marginBottom: 16
                }}>
                  {EMOJI[s.showType] || '🎭'}
                </div>
                <div style={{ flex: 1 }}>
                  <span className="badge badge-gold" style={{ fontSize: 10, marginBottom: 8, display: 'inline-block' }}>
                    {s.showType}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{s.title}</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    {s.genre && (
                      <span style={{
                        background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.25)',
                        borderRadius: 20, padding: '2px 10px',
                        fontSize: 11, color: 'var(--teal)', fontWeight: 600,
                      }}>
                        {s.genre}
                      </span>
                    )}
                    {s.language && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {s.language}</span>}
                    {s.duration > 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {s.duration}m</span>}
                  </div>
                </div>
                <div className="gold-line" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Select schedule →</span>
                  <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600 }}>Book Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}