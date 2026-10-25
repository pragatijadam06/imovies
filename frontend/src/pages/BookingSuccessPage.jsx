import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBooking } from '../api';

export default function BookingSuccessPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooking(bookingId)
      .then((res) => setBooking(res.data.booking))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <div className="loading-spinner" style={{ minHeight: '70vh' }}><div className="spinner" /></div>;
  if (!booking) return <div className="empty-state" style={{ minHeight: '60vh' }}><h3>Booking not found</h3></div>;

  const { show } = booking;
  const movie = show?.movie;
  const theatre = show?.theatre;

  return (
    <div className="page-enter section">
      <div className="container" style={{ maxWidth: '620px', textAlign: 'center' }}>

        {/* Success Icon */}
        <div className="confirm-icon">
          <span style={{ fontSize: '2.5rem' }}>✅</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Your seats are reserved. Enjoy the movie! 🍿
        </p>

        {/* Booking Reference */}
        <div style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: 'var(--radius)', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking Reference</div>
          <div style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '3px' }}>
            {booking.bookingRef}
          </div>
        </div>

        {/* Details */}
        <div className="summary-card text-start mb-4">
          {[
            { label: '🎬 Movie', value: movie?.title },
            { label: '🏛️ Theatre', value: `${theatre?.name}, ${theatre?.city}` },
            { label: '📅 Date', value: new Date(show?.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: '🕐 Time', value: show?.time },
            { label: '🪑 Seats', value: [...booking.seats].sort().join(', ') },
            { label: '💰 Total Paid', value: `₹${booking.totalPrice}` },
            { label: '📋 Status', value: <span className={`status-badge status-${booking.status}`}>{booking.status}</span> },
          ].map((row) => (
            <div key={row.label} className="summary-row">
              <span className="summary-label">{row.label}</span>
              <span className="summary-value">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/my-bookings" className="btn-cinema" id="view-bookings-link">
            📋 My Bookings
          </Link>
          <Link to="/movies" className="btn-outline-cinema">
            🎬 Browse More Movies
          </Link>
        </div>
      </div>
    </div>
  );
}
