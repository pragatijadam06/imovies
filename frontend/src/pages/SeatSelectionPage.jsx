import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShow } from '../api';
import toast from 'react-hot-toast';

export default function SeatSelectionPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    getShow(showId)
      .then((res) => {
        const s = res.data.show;
        if (s.isExpired) {
          toast.error(`The ${s.time} show has already started. Bookings are closed.`);
          navigate(`/movies/${s.movie?._id || ''}`);
          return;
        }
        setShow(s);
      })
      .catch(() => navigate('/movies'))
      .finally(() => setLoading(false));
  }, [showId, navigate]);

  if (loading) return <div className="loading-spinner" style={{ minHeight: '70vh' }}><div className="spinner" /></div>;
  if (!show) return null;

  const { theatre, movie } = show;
  const rows = theatre?.rows || 8;
  const seatsPerRow = theatre?.seatsPerRow || 10;
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, rows);

  const getSeatId = (row, col) => `${row}${col}`;

  const toggleSeat = (seatId) => {
    if (show.bookedSeats?.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const getSeatStatus = (seatId) => {
    if (show.bookedSeats?.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const totalPrice = selectedSeats.length * show.price;
  const duration = `${Math.floor(movie?.duration / 60)}h ${movie?.duration % 60}m`;

  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    navigate('/booking/confirm', {
      state: {
        showId: show._id,
        seats: selectedSeats,
        totalPrice,
        movie,
        show,
        theatre,
      },
    });
  };

  return (
    <div className="page-enter section">
      <div className="container">
        {/* Header */}
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {movie?.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              {theatre?.name}, {theatre?.city} · {new Date(show.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })} · {show.time} · {duration}
            </p>
          </div>
          <div className="col-auto">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price per seat</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>₹{show.price}</div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Seat Map */}
          <div className="col-lg-8">
            <div className="seat-map-wrapper">
              <div className="screen-bar" />

              {rowLabels.map((rowLabel) => (
                <div key={rowLabel} className="seat-row">
                  <span className="row-label">{rowLabel}</span>
                  <div className="d-flex gap-1 flex-wrap" style={{ flex: 1 }}>
                    {Array.from({ length: seatsPerRow }, (_, i) => {
                      const col = i + 1;
                      const seatId = getSeatId(rowLabel, col);
                      const status = getSeatStatus(seatId);
                      return (
                        <button
                          key={seatId}
                          id={`seat-${seatId}`}
                          className={`seat-btn ${status}`}
                          onClick={() => toggleSeat(seatId)}
                          title={`Seat ${seatId} - ${status}`}
                          aria-label={`Seat ${seatId} ${status}`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                  <span className="row-label">{rowLabel}</span>
                </div>
              ))}

              {/* Legend */}
              <div className="d-flex gap-4 justify-content-center mt-3 flex-wrap">
                {[
                  { cls: 'available', label: 'Available' },
                  { cls: 'selected', label: 'Selected' },
                  { cls: 'booked', label: 'Booked' },
                ].map((item) => (
                  <div key={item.cls} className="d-flex align-items-center gap-2">
                    <div className={`seat-btn ${item.cls}`} style={{ width: '24px', height: '20px', borderRadius: '3px', pointerEvents: 'none' }} />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="col-lg-4">
            <div className="summary-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem' }}>Booking Summary</h3>

              <div className="summary-row">
                <span className="summary-label">Movie</span>
                <span className="summary-value">{movie?.title}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Theatre</span>
                <span className="summary-value" style={{ fontSize: '0.85rem' }}>{theatre?.name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Show</span>
                <span className="summary-value">{show.time}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Date</span>
                <span className="summary-value">
                  {new Date(show.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Selected Seats</span>
                <span className="summary-value">
                  {selectedSeats.length > 0
                    ? selectedSeats.sort().join(', ')
                    : <span style={{ color: 'var(--text-muted)' }}>None selected</span>}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Tickets</span>
                <span className="summary-value">{selectedSeats.length} × ₹{show.price}</span>
              </div>
              <div className="summary-row" style={{ borderBottom: 'none', marginTop: '0.5rem' }}>
                <span className="summary-label" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
                <span className="summary-total">₹{totalPrice}</span>
              </div>

              <button
                id="proceed-booking-btn"
                className="btn-cinema w-100 mt-3"
                disabled={selectedSeats.length === 0}
                onClick={handleProceed}
                style={{ justifyContent: 'center', fontSize: '1rem', padding: '0.85rem' }}
              >
                Proceed to Confirm →
              </button>

              {selectedSeats.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.75rem' }}>
                  Click on seats above to select them
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
