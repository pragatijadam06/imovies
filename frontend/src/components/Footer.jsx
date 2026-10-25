import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="logo mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              🎬 IMovies
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
              Your premium destination for movie ticket booking. Experience cinema like never before.
            </p>
          </div>
          <div className="col-md-2 offset-md-2">
            <h6 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Navigate</h6>
            <div className="d-flex flex-column gap-2">
              <Link to="/" className="nav-link-cinema" style={{ padding: '0.1rem 0', fontSize: '0.88rem' }}>Home</Link>
              <Link to="/movies" className="nav-link-cinema" style={{ padding: '0.1rem 0', fontSize: '0.88rem' }}>Movies</Link>
              <Link to="/my-bookings" className="nav-link-cinema" style={{ padding: '0.1rem 0', fontSize: '0.88rem' }}>My Bookings</Link>
            </div>
          </div>
          <div className="col-md-2">
            <h6 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Account</h6>
            <div className="d-flex flex-column gap-2">
              <Link to="/login" className="nav-link-cinema" style={{ padding: '0.1rem 0', fontSize: '0.88rem' }}>Login</Link>
              <Link to="/register" className="nav-link-cinema" style={{ padding: '0.1rem 0', fontSize: '0.88rem' }}>Register</Link>
            </div>
          </div>
          <div className="col-md-2">
            <h6 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Cities</h6>
            <div className="d-flex flex-column gap-1" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              <span>Bangalore</span>
              <span>Chennai</span>
              <span>Hyderabad</span>
              <span>Mumbai</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
            © 2024 IMovies. All rights reserved. | Demo Project — No real payments processed.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['🎬', '🎭', '🍿'].map((emoji, i) => (
              <span key={i} style={{ fontSize: '1.2rem', opacity: 0.5 }}>{emoji}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
