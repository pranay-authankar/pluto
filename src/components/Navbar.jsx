import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRelocation } from '../context/RelocationContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { college, showToast } = useRelocation();
  const { user, studentName, logout, openAuthModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isCollegeSelected = Boolean(college && college.trim());
  const isActive = (path) => location.pathname === path;

  const handleNavClick = (e, path, label) => {
    if (!isCollegeSelected) {
      e.preventDefault();
      if (showToast) {
        showToast(
          'Select your college first',
          `Please select your college to unlock ${label}.`,
          'warning'
        );
      }
    }
  };

  const handleLogout = async () => {
    const res = await logout();
    if (res.success && showToast) {
      showToast('Signed Out', 'You have been successfully logged out.', 'primary');
    }
    navigate('/login', { replace: true });
  };

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container header-container">
        
        {/* Brand Logo → / */}
        <Link to="/" className="brand" aria-label="Pluto Home">
          <div className="brand-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="6"></circle>
              <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-25 12 12)"></ellipse>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">Pluto</span>
            <span className="brand-tag">Your World Away From Home.</span>
          </div>
        </Link>

        {/* Global Navbar Items */}
        <nav className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>

          {/* Nearby → /nearby */}
          <Link
            to={isCollegeSelected ? '/nearby' : '#'}
            onClick={(e) => handleNavClick(e, '/nearby', 'Nearby Places')}
            className={`nav-link ${isActive('/nearby') ? 'active' : ''} ${!isCollegeSelected ? 'nav-disabled' : ''}`}
            aria-disabled={!isCollegeSelected}
            title={!isCollegeSelected ? 'Select your college first to unlock Nearby spots' : 'Explore Nearby Campus Services'}
          >
            {!isCollegeSelected && <span className="nav-lock-icon" aria-hidden="true">🔒</span>}
            Nearby
          </Link>

          {/* Requirements → /requirements */}
          <Link
            to={isCollegeSelected ? '/requirements' : '#'}
            onClick={(e) => handleNavClick(e, '/requirements', 'Student Requirements')}
            className={`nav-link ${isActive('/requirements') ? 'active' : ''} ${!isCollegeSelected ? 'nav-disabled' : ''}`}
            aria-disabled={!isCollegeSelected}
            title={!isCollegeSelected ? 'Select your college first to configure Requirements' : 'Submit or Edit Student Requirements'}
          >
            {!isCollegeSelected && <span className="nav-lock-icon" aria-hidden="true">🔒</span>}
            Requirements
          </Link>

          {/* Persistent College Indicator Chip */}
          {college ? (
            <Link to="/" className="badge badge-primary" style={{ padding: '0.35rem 0.75rem', gap: '5px', textDecoration: 'none' }} title="Current Campus Context">
              <span>🎓</span>
              <span>{college}</span>
            </Link>
          ) : (
            <Link to="/" className="badge" style={{ padding: '0.35rem 0.75rem', gap: '5px', textDecoration: 'none', background: 'var(--slate-100)', color: 'var(--slate-600)' }} title="Select your college">
              <span>🎓</span>
              <span>Select College</span>
            </Link>
          )}

          {/* Firebase Authentication: Logged-in User Email & Logout / Log In Button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.25rem' }}>
              <div
                className="badge"
                style={{
                  padding: '0.35rem 0.75rem',
                  gap: '6px',
                  background: 'var(--primary-50, #eef2ff)',
                  color: 'var(--primary-700, #4338ca)',
                  border: '1px solid var(--primary-200, #c7d2fe)',
                  maxWidth: '190px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={`Logged in as ${studentName ? `${studentName} (${user.email})` : user.email}`}
              >
                <span>👤</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {studentName || user.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{
                  padding: '0.32rem 0.65rem',
                  fontSize: '0.785rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                title="Log out of your account"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.25rem' }}>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="btn btn-primary"
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.825rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
            </div>
          )}
        </nav>

      </div>
    </header>
  );
}

