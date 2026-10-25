import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovie, getShowsByMovie } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FALLBACK = 'https://via.placeholder.com/400x600/111118/e50914?text=No+Poster';

// Helper to determine if a show has already passed relative to current time
const isShowExpired = (show) => {
  if (!show) return false;
  if (show.isExpired !== undefined) return show.isExpired;
  if (!show.date || !show.time) return false;

  const showDate = new Date(show.date);
  const now = new Date();

  const showYear = showDate.getFullYear();
  const showMonth = showDate.getMonth();
  const showDay = showDate.getDate();

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const nowDay = now.getDate();

  if (
    showYear < nowYear ||
    (showYear === nowYear && showMonth < nowMonth) ||
    (showYear === nowYear && showMonth === nowMonth && showDay < nowDay)
  ) {
    return true;
  }

  if (
    showYear > nowYear ||
    (showYear === nowYear && showMonth > nowMonth) ||
    (showYear === nowYear && showMonth === nowMonth && showDay > nowDay)
  ) {
    return false;
  }

  const match = show.time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return false;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const showDateTime = new Date(showYear, showMonth, showDay, hours, minutes, 0, 0);
  return showDateTime <= now;
};

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    Promise.all([getMovie(id), getShowsByMovie(id)])
      .then(([mRes, sRes]) => {
        setMovie(mRes.data.movie);
        setShows(sRes.data.shows || []);
      })
      .catch(() => navigate('/movies'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="loading-spinner" style={{ minHeight: '70vh' }}><div className="spinner" /></div>;
  if (!movie) return null;

  // Group shows by date
  const showsByDate = shows.reduce((acc, show) => {
    const date = new Date(show.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(show);
    return acc;
  }, {});

  const duration = `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`;

  const handleBookNow = () => {
    if (!selectedShow) { toast.error('Please select a showtime first!'); return; }
    if (isShowExpired(selectedShow)) {
      toast.error('This show has already started or ended. Please choose an upcoming show.');
      return;
    }
    if (!user) { toast.error('Please login to book tickets.'); navigate('/login'); return; }
    navigate(`/shows/${selectedShow._id}/seats`);
  };

  return (
    <div className="page-enter">
      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(to bottom, rgba(24, 19, 43, 0.4) 0%, var(--bg-dark) 100%), url(${movie.poster || FALLBACK}) center/cover no-repeat`,
        minHeight: '320px',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '2rem',
      }}>
        <div className="container" style={{ paddingTop: '3rem' }} />
      </div>

      <div className="container" style={{ marginTop: '-80px', position: 'relative', paddingBottom: '4rem' }}>
        <div className="row g-4">
          {/* Poster */}
          <div className="col-md-3 col-sm-4">
            <img
              src={movie.poster || FALLBACK}
              alt={movie.title}
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
              style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.7)' }}
            />
          </div>

          {/* Details */}
          <div className="col-md-9 col-sm-8">
            <div className="d-flex flex-wrap gap-2 mb-2 mt-4 mt-md-0">
              {movie.genre?.map((g) => <span key={g} className="badge-genre">{g}</span>)}
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '0.5rem' }}>{movie.title}</h1>

            <div className="d-flex flex-wrap gap-3 mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {movie.rating > 0 && (
                <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1rem' }}>
                  ★ {movie.rating.toFixed(1)} / 10
                </span>
              )}
              <span>⏱ {duration}</span>
              {movie.director && <span>🎬 {movie.director}</span>}
              {movie.languages?.map((l) => <span key={l} className="badge-lang">{l}</span>)}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.2rem', maxWidth: '700px' }}>
              {movie.description}
            </p>

            {movie.cast?.length > 0 && (
              <div className="mb-3">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Cast: </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{movie.cast.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Shows Section */}
        <div className="mt-4">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>🎟️ Select Showtime</h2>

          {Object.keys(showsByDate).length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
              <h3>No Shows Available</h3>
              <p>No upcoming shows found for this movie. Check back later!</p>
            </div>
          ) : (
            Object.entries(showsByDate).map(([date, dateShows]) => (
              <div key={date} className="mb-4">
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '1rem' }}>
                  📅 {date}
                </h3>
                <div className="d-flex flex-wrap gap-3">
                  {dateShows.map((show) => {
                    const theatre = show.theatre;
                    const totalSeats = theatre?.rows * theatre?.seatsPerRow || 100;
                    const bookedCount = show.bookedSeats?.length || 0;
                    const available = totalSeats - bookedCount;
                    const isExpired = isShowExpired(show);
                    const isSel = selectedShow?._id === show._id && !isExpired;

                    return (
                      <div
                        key={show._id}
                        style={{
                          background: isExpired ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg-elevated)',
                          border: `1.5px solid ${isSel ? 'var(--primary)' : isExpired ? 'rgba(255,255,255,0.06)' : 'var(--border)'}`,
                          borderRadius: 'var(--radius)',
                          padding: '1rem 1.2rem',
                          cursor: isExpired ? 'not-allowed' : 'pointer',
                          opacity: isExpired ? 0.45 : 1,
                          transition: 'all 0.2s',
                          minWidth: '220px',
                          boxShadow: isSel ? '0 0 16px var(--primary-glow)' : 'none',
                          position: 'relative',
                        }}
                        onClick={() => {
                          if (isExpired) {
                            toast.error(`The ${show.time} show has already started. Please select an upcoming show.`);
                            return;
                          }
                          setSelectedShow(show);
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: isExpired ? 'var(--text-muted)' : 'inherit' }}>
                            {show.time}
                          </span>
                          {isExpired ? (
                            <span style={{
                              fontSize: '0.68rem',
                              background: 'rgba(229, 9, 20, 0.15)',
                              color: '#ff4d4f',
                              border: '1px solid rgba(229, 9, 20, 0.3)',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Expired
                            </span>
                          ) : (
                            <span style={{
                              fontSize: '0.68rem',
                              background: 'rgba(0, 200, 81, 0.15)',
                              color: '#00c851',
                              border: '1px solid rgba(0, 200, 81, 0.3)',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Available
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                          {theatre?.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: isExpired ? '#ff7875' : 'var(--text-muted)' }}>
                          {isExpired ? 'Booking closed' : `${theatre?.city} · ${available} seats left`}
                        </div>
                        <div style={{ color: isExpired ? 'var(--text-muted)' : 'var(--gold)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.4rem' }}>
                          ₹{show.price}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Book Button */}
        {Object.keys(showsByDate).length > 0 && (
          <div className="mt-3">
            <button
              id="book-now-btn"
              className="btn-cinema"
              onClick={handleBookNow}
              disabled={!selectedShow || isShowExpired(selectedShow)}
              style={{
                fontSize: '1rem',
                padding: '0.85rem 2.5rem',
                opacity: (!selectedShow || isShowExpired(selectedShow)) ? 0.6 : 1,
                cursor: (!selectedShow || isShowExpired(selectedShow)) ? 'not-allowed' : 'pointer'
              }}
            >
              🎟️ {selectedShow && !isShowExpired(selectedShow) ? `Book for ${selectedShow.time}` : 'Select an Upcoming Show & Book'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
