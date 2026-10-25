import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-enter section d-flex align-items-center justify-content-center" style={{ minHeight: '70vh', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: '6rem', lineHeight: 1, marginBottom: '1rem' }}>🎭</div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Scene Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist. Let's get you back to the movies.
        </p>
        <Link to="/" className="btn-cinema" style={{ fontSize: '1rem' }}>
          🏠 Back to Home
        </Link>
      </div>
    </div>
  );
}
