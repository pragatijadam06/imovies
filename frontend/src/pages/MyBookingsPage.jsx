import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../api';
import toast from 'react-hot-toast';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    getMyBookings()
      .then((res) => setBookings(res.data.bookings || []))
      .catch(() => toast.error('Failed to load bookings.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled.');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="page-enter section">
      <div className="container">
        <div className="section-divider" />
        <h1 className="section-title">My Bookings</h1>
        <p className="section-subtitle">Your complete booking history</p>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🎟️</div>
            <h3>No Bookings Yet</h3>
            <p>You haven't booked any tickets. Start exploring movies!</p>
            <Link to="/movies" className="btn-cinema mt-3 d-inline-flex">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {bookings.map((booking) => {
              const show = booking.show;
              const movie = show?.movie;
              const theatre = show?.theatre;
              const isCancelled = booking.status === 'cancelled';

              return (
                <div key={booking._id} className="booking-item" style={{ opacity: isCancelled ? 0.7 : 1 }}>
                  {/* Poster thumb */}
                  {movie?.poster && (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      onError={(e) => { e.target.style.display = 'none'; }}
                      style={{ width: '60px', height: '88px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                    />
                  )}

                  {/* Main info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{movie?.title || 'Unknown Movie'}</h3>
                      <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      {theatre?.name}, {theatre?.city}
                    </div>
                    <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span>📅 {show?.date ? new Date(show.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                      <span>🕐 {show?.time}</span>
                      <span>🪑 {[...booking.seats].sort().join(', ')}</span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="d-flex flex-column align-items-end gap-2 flex-shrink-0">
                    <span className="booking-ref">{booking.bookingRef}</span>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gold)' }}>₹{booking.totalPrice}</div>
                    {!isCancelled && (
                      <button
                        id={`cancel-booking-${booking._id}`}
                        className="btn-ghost"
                        style={{ fontSize: '0.78rem', padding: '0.3rem 0.8rem', color: 'var(--danger)' }}
                        disabled={cancelling === booking._id}
                        onClick={() => handleCancel(booking._id)}
                      >
                        {cancelling === booking._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
