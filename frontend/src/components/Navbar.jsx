import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar-cinema">
      <div className="container d-flex align-items-center justify-content-between flex-wrap gap-2">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          🎬 IMovies
        </Link>

        {/* Mobile toggle */}
        <button
          className="btn-ghost d-md-none"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ padding: '0.4rem 0.7rem', fontSize: '1.2rem' }}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div
          className={`d-flex align-items-center gap-2 flex-wrap ${menuOpen ? 'd-flex' : 'd-none d-md-flex'}`}
          style={{ gap: '0.25rem' }}
        >
          <NavLink
            to="/movies"
            className={({ isActive }) => `nav-link-cinema ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Movies
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) => `nav-link-cinema ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                My Bookings
              </NavLink>
              <span className="nav-link-cinema" style={{ color: 'var(--text-muted)', cursor: 'default' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn-outline-cinema" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `nav-link-cinema ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
              <Link to="/register" className="btn-cinema" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }} onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
