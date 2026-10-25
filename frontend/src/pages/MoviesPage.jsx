import { useState, useEffect, useCallback } from 'react';
import { getMovies, getMovieFilters } from '../api';
import MovieCard from '../components/MovieCard';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({ genres: [], languages: [] });
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getMovieFilters()
      .then((res) => setFilters(res.data))
      .catch(console.error);
  }, []);

  const fetchMovies = useCallback(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (search) params.search = search;
    if (genre) params.genre = genre;
    if (language) params.language = language;

    getMovies(params)
      .then((res) => { setMovies(res.data.movies || []); setTotal(res.data.total || 0); })
      .catch(() => setError('Failed to load movies. Is the backend running?'))
      .finally(() => setLoading(false));
  }, [search, genre, language]);

  useEffect(() => {
    const timer = setTimeout(fetchMovies, 350);
    return () => clearTimeout(timer);
  }, [fetchMovies]);

  const clearFilters = () => { setSearch(''); setGenre(''); setLanguage(''); };
  const hasFilters = search || genre || language;

  return (
    <div className="page-enter section">
      <div className="container">
        {/* Header */}
        <div className="section-divider" />
        <h1 className="section-title">All Movies</h1>
        <p className="section-subtitle">{total} movie{total !== 1 ? 's' : ''} available</p>

        {/* Search & Filters */}
        <div className="d-flex gap-2 flex-wrap mb-4 align-items-center">
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>🔍</span>
            <input
              id="movie-search"
              type="text"
              className="search-bar"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>
          <select id="genre-filter" className="filter-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All Genres</option>
            {filters.genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <select id="language-filter" className="filter-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">All Languages</option>
            {filters.languages.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          {hasFilters && (
            <button className="btn-ghost" onClick={clearFilters} style={{ fontSize: '0.85rem' }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : error ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3>Backend Unavailable</h3>
            <p>{error}</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
            <h3>No Movies Found</h3>
            <p>Try adjusting your search or filters.</p>
            {hasFilters && <button className="btn-cinema mt-3" onClick={clearFilters}>Clear Filters</button>}
          </div>
        ) : (
          <div className="row g-3">
            {movies.map((movie) => (
              <div key={movie._id} className="col-6 col-md-4 col-lg-3">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
