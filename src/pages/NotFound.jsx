import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 140px)', padding: 'var(--space-8)' }}>
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-2)' }}>🧭</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: 'var(--space-2)' }}>Page Not Found</h1>
        <p style={{ color: 'var(--slate-500)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
          The requested path does not exist.
        </p>
        <Link to="/" className="btn btn-primary btn-md" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span>Return Home</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </main>
  );
}
