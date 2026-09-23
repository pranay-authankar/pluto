import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--slate-50, #f8fafc)',
          gap: '1rem',
          fontFamily: 'var(--font-family-sans, sans-serif)'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--primary-gradient, linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 24px var(--primary-glow, rgba(79, 70, 229, 0.25))',
            animation: 'plutoPulse 1.8s ease-in-out infinite'
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="6"></circle>
            <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-25 12 12)"></ellipse>
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900, #0f172a)' }}>
            Pluto
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500, #64748b)', marginTop: '2px' }}>
            Away From Home.
          </div>
        </div>

        <style>{`
          @keyframes plutoPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.06); opacity: 0.85; }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
