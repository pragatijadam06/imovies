import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../api';
import MovieCard from '../components/MovieCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies({ limit: 6 })
      .then((res) => setFeatured(res.data.movies || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div style={{ marginBottom: '1rem' }}>
                <span className="badge-genre" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                  🎬 Now Booking
                </span>
              </div>
              <h1 className="display-font" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.1, marginBottom: '1.2rem' }}>
                Your Cinema,<br />
                <span style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Your Story.
                </span>
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7, maxWidth: '480px' }}>
                Book tickets for the latest blockbusters, choose your seats, and experience cinema magic. Fast, simple, unforgettable.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/movies" className="btn-cinema" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                  🎟️ Browse Movies
                </Link>
                <Link to="/register" className="btn-outline-cinema" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                  Create Account
                </Link>
              </div>

              {/* Stats */}
              <div className="d-flex gap-4 mt-4 flex-wrap">
                {[
                  { num: '8+', label: 'Movies' },
                  { num: '4', label: 'Theatres' },
                  { num: '3', label: 'Cities' },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{s.num}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-flex justify-content-center" style={{ position: 'relative' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', transform: 'perspective(600px) rotateY(-8deg)', maxWidth: '420px' }}>
                {featured.slice(0, 4).map((m, i) => (
                  <div key={m._id} style={{
                    borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)',
                    transform: i % 2 === 0 ? 'translateY(-8px)' : 'translateY(8px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
                  }}>
                    <img
                      src={m.poster || 'https://via.placeholder.com/200x300/111118/e50914?text=Movie'}
                      alt={m.title}
                      style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300/111118/e50914?text=Movie'; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="row g-4 text-center">
            {[
              { icon: '🎭', title: 'Choose Your Movie', desc: 'Browse from a handpicked selection of the best films playing now.' },
              { icon: '🪑', title: 'Pick Your Seats', desc: 'Interactive seat map lets you choose exactly where you want to sit.' },
              { icon: '✅', title: 'Confirm & Enjoy', desc: 'Instant booking confirmation with a unique reference code. Easy!' },
            ].map((f) => (
              <div key={f.title} className="col-md-4">
                <div className="card-cinema p-4 h-100">
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Movies ── */}
      <section className="section">
        <div className="container">
          <div className="section-divider" />
          <h2 className="section-title">Now Showing</h2>
          <p className="section-subtitle">Catch the latest blockbusters on the big screen</p>

          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <p>No movies found. Please seed the database.</p>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {featured.map((movie) => (
                  <div key={movie._id} className="col-6 col-md-4 col-lg-2">
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link to="/movies" className="btn-outline-cinema">
                  View All Movies →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
