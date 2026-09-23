import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRelocation } from '../context/RelocationContext';

export default function Navbar() {
  const { college, showToast } = useRelocation();
  const location = useLocation();

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
        <nav className="header-actions">

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
        </nav>

      </div>
    </header>
  );
}
