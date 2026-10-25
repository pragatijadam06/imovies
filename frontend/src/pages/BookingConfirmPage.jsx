import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../api';
import toast from 'react-hot-toast';

export default function BookingConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [loading, setLoading] = useState(false);

  if (!state || !state.showId) {
    navigate('/movies');
    return null;
  }

  const { showId, seats, totalPrice, movie, show, theatre } = state;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await createBooking({ showId, seats });
      const booking = res.data.booking;
      toast.success('Booking confirmed! 🎉');
      navigate(`/booking/success/${booking._id}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter section">
      <div className="container" style={{ maxWidth: '680px' }}>
        <div className="section-divider" />
        <h1 className="section-title">Confirm Your Booking</h1>

        {/* Demo notice */}
        <div style={{
          background: 'rgba(255, 136, 0, 0.1)',
          border: '1px solid rgba(255, 136, 0, 0.3)',
          borderRadius: 'var(--radius)',
          padding: '0.85rem 1.2rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.7rem'
        }}>
          <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
          <div>
            <strong style={{ color: '#ff8800', fontSize: '0.9rem' }}>Demo Booking Flow</strong>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              No real payment is processed. This is a demonstration of the booking system.
            </p>
          </div>
        </div>

        <div className="summary-card mb-3">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>
            Booking Details
          </h3>
          {[
            { label: 'Movie', value: movie?.title },
            { label: 'Theatre', value: `${theatre?.name}, ${theatre?.city}` },
            { label: 'Date', value: new Date(show?.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Showtime', value: show?.time },
            { label: 'Seats', value: [...seats].sort().join(', ') },
            { label: `${seats.length} Ticket${seats.length > 1 ? 's' : ''} × ₹${show?.price}`, value: `₹${totalPrice}` },
          ].map((row) => (
            <div key={row.label} className="summary-row">
              <span className="summary-label">{row.label}</span>
              <span className="summary-value">{row.value}</span>
            </div>
          ))}
          <div className="summary-row" style={{ borderBottom: 'none', marginTop: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total Amount</span>
            <span className="summary-total">₹{totalPrice}</span>
          </div>
        </div>

        <div className="d-flex gap-3 flex-wrap">
          <button
            id="confirm-booking-btn"
            className="btn-cinema"
            onClick={handleConfirm}
            disabled={loading}
            style={{ flex: 1, justifyContent: 'center', fontSize: '1rem', padding: '0.9rem' }}
          >
            {loading ? '⏳ Processing...' : '✅ Confirm Booking (Demo)'}
          </button>
          <button
            className="btn-ghost"
            onClick={() => navigate(-1)}
            disabled={loading}
            style={{ padding: '0.9rem 1.5rem' }}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
