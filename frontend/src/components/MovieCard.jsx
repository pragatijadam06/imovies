import { Link } from 'react-router-dom';

const FALLBACK_POSTER = 'https://via.placeholder.com/300x450/111118/e50914?text=No+Poster';

export default function MovieCard({ movie }) {
  const poster = movie.poster || FALLBACK_POSTER;
  const genres = Array.isArray(movie.genre) ? movie.genre : [];
  const duration = movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : '';

  return (
    <Link to={`/movies/${movie._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="movie-card h-100">
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={poster}
            alt={movie.title}
            className="movie-card__poster"
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_POSTER; }}
          />
          <div className="movie-card__overlay">
            <span className="btn-cinema" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
              Book Now
            </span>
          </div>
          {movie.rating > 0 && (
            <div style={{
              position: 'absolute', top: '0.6rem', right: '0.6rem',
              background: 'rgba(0,0,0,0.8)', borderRadius: '6px',
              padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem'
            }}>
              <span style={{ color: '#f5c518', fontSize: '0.85rem' }}>★</span>
              <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 700 }}>{movie.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="movie-card__body">
          <h3 className="movie-card__title">{movie.title}</h3>
          <div className="movie-card__meta">
            {genres.slice(0, 2).map((g) => (
              <span key={g} className="badge-genre">{g}</span>
            ))}
            {duration && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{duration}</span>}
          </div>
          {Array.isArray(movie.languages) && movie.languages.length > 0 && (
            <div className="movie-card__meta mt-1">
              {movie.languages.slice(0, 3).map((l) => (
                <span key={l} className="badge-lang">{l}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
