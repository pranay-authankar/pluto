import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRelocation } from '../context/RelocationContext';
import { useAuth } from '../context/AuthContext';
import { indianColleges } from '../data/mockData';

const POPULAR_INDIAN_COLLEGES = [
  'IIT Bombay',
  'IIT Delhi',
  'BITS Pilani',
  'IIT Madras',
  'Delhi University (DU)',
  'VIT Vellore'
];

// College location metadata for mock display
const COLLEGE_LOCATIONS = {
  'IIT Bombay': 'Mumbai, Maharashtra',
  'IIT Delhi': 'New Delhi, Delhi',
  'BITS Pilani': 'Pilani, Rajasthan',
  'IIT Madras': 'Chennai, Tamil Nadu',
  'Delhi University (DU)': 'New Delhi, Delhi',
  'IIT Kharagpur': 'Kharagpur, West Bengal',
  'IISc Bangalore': 'Bengaluru, Karnataka',
  'IIT Roorkee': 'Roorkee, Uttarakhand',
  'VIT Vellore': 'Vellore, Tamil Nadu',
  'Manipal University (MAHE)': 'Manipal, Karnataka',
  'SRM Institute of Science and Technology': 'Chennai, Tamil Nadu',
  'IIT Guwahati': 'Guwahati, Assam',
  'NIT Trichy': 'Tiruchirappalli, Tamil Nadu',
  'Jadavpur University': 'Kolkata, West Bengal',
  'Anna University': 'Chennai, Tamil Nadu'
};

export default function Home() {
  const { college, setCollege, showToast } = useRelocation();
  const { studentName, user } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChangingCollege, setIsChangingCollege] = useState(false);
  const [highlightLocked, setHighlightLocked] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const searchBoxRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const isCollegeSelected = Boolean(college && college.trim());

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered colleges list based on search input
  const filteredColleges = indianColleges.filter((item) =>
    item.toLowerCase().includes(searchInput.toLowerCase().trim())
  );

  // Keyboard navigation for dropdown
  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filteredColleges.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredColleges.length - 1));
    } else if (e.key === 'Enter' && focusedIndex >= 0 && filteredColleges[focusedIndex]) {
      e.preventDefault();
      handleSelectCollege(filteredColleges[focusedIndex]);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setFocusedIndex(-1);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('.college-dropdown-item');
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  // Select college: keeps context visible, does NOT redirect, does NOT open requirements form
  const handleSelectCollege = (name) => {
    setCollege(name);
    setSearchInput('');
    setIsDropdownOpen(false);
    setIsChangingCollege(false);
    setFocusedIndex(-1);

    if (showToast) {
      showToast('College Selected', `${name} set as current location. Options unlocked!`, 'success');
    }
  };

  const handleClearSearch = (e) => {
    e.stopPropagation();
    setSearchInput('');
    if (inputRef.current) inputRef.current.focus();
  };

  // Click handler for the 4 main option cards
  const handleOptionClick = (route) => {
    if (!isCollegeSelected) {
      setHighlightLocked(true);
      setTimeout(() => setHighlightLocked(false), 900);
      if (showToast) {
        showToast('Select your college first', 'Choose your college above to explore options around campus.', 'warning');
      }
      if (inputRef.current) {
        inputRef.current.focus();
      } else if (searchBoxRef.current) {
        searchBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    navigate(route);
  };

  return (
    <main className="main-content college-first-page">
      {/* Subtle Ambient Background */}
      <div className="college-first-bg" aria-hidden="true"></div>

      <div className="container college-first-container">
        
        {/* =========================================================================
            HEADER & HERO: Clean, focused, minimal text
           ========================================================================= */}
        <section className="college-first-hero">
          
          {/* Welcome Student Greeting */}
          <div
            className="student-welcome-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              background: 'var(--primary-50, #eef2ff)',
              border: '1px solid var(--primary-200, #c7d2fe)',
              color: 'var(--primary-700, #4338ca)',
              fontSize: '0.925rem',
              fontWeight: 700,
              marginBottom: '1rem',
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.08)'
            }}
          >
            <span>👋</span>
            <span>{studentName === 'Hey there' ? 'Hey there' : `Welcome, ${studentName || (user?.email ? user.email.split('@')[0] : 'Student')}`}</span>
          </div>

          {/* Status Badge */}
          <div className="campus-context-pill">
            <span className={`pulse-indicator ${isCollegeSelected ? 'pulse-active' : 'pulse-inactive'}`}></span>
            <span className="campus-context-text">
              {isCollegeSelected ? `Campus Anchor: ${college}` : 'Step 1: Choose Your College'}
            </span>
          </div>

          <h1 className="college-first-title">
            Select your <span className="title-accent">college</span>
          </h1>

          <p className="college-first-subtitle">
            {isCollegeSelected
              ? `Everything you need near ${college}. Choose any option below.`
              : 'Pick your college to unlock verified rooms, food, flatmates, and campus essentials.'}
          </p>

          {/* =========================================================================
              ACTIVE CONTEXT DISPLAY OR COLLEGE SELECTOR
             ========================================================================= */}
          {isCollegeSelected && !isChangingCollege ? (
            /* Selected College Context Banner */
            <div className="college-active-card">
              <div className="active-card-main">
                <div className="active-campus-icon" aria-hidden="true">🎓</div>
                <div className="active-campus-details">
                  <div className="active-campus-header">
                    <span className="active-campus-name">{college}</span>
                    <span className="active-campus-status">Active Campus</span>
                  </div>
                  <div className="active-campus-location">
                    📍 {COLLEGE_LOCATIONS[college] || 'India'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-switch-college"
                onClick={() => {
                  setIsChangingCollege(true);
                  setIsDropdownOpen(true);
                  setTimeout(() => {
                    if (inputRef.current) inputRef.current.focus();
                  }, 50);
                }}
                aria-label="Change selected college"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                  <path d="M16 21h5v-5"></path>
                </svg>
                Change College
              </button>
            </div>
          ) : (
            /* Searchable College Dropdown / Input */
            <div
              className={`college-selector-wrapper ${highlightLocked ? 'selector-shake-highlight' : ''}`}
              ref={searchBoxRef}
            >
              <div className="college-selector-box">
                <div className="selector-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  className="college-selector-input"
                  placeholder="Type your college name (e.g. IIT Bombay, BITS Pilani)..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setIsDropdownOpen(true);
                    setFocusedIndex(0);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                  aria-label="Search Indian College"
                  autoComplete="off"
                />

                {searchInput && (
                  <button
                    type="button"
                    className="selector-clear-btn"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}

                {isChangingCollege && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm selector-cancel-btn"
                    onClick={() => {
                      setIsChangingCollege(false);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isDropdownOpen && (
                <div className="college-selector-dropdown" role="listbox" ref={listRef}>
                  <div className="dropdown-meta-header">
                    <span>Indian Colleges ({filteredColleges.length})</span>
                    <span className="dropdown-meta-hint">Use ↑↓ keys or click to select</span>
                  </div>

                  {filteredColleges.length === 0 ? (
                    <div className="dropdown-empty-state">
                      No colleges found matching "{searchInput}". Try another name.
                    </div>
                  ) : (
                    filteredColleges.map((cName, idx) => (
                      <div
                        key={cName}
                        className={`college-dropdown-item ${college === cName ? 'is-selected' : ''} ${focusedIndex === idx ? 'is-focused' : ''}`}
                        onClick={() => handleSelectCollege(cName)}
                        onMouseEnter={() => setFocusedIndex(idx)}
                        role="option"
                        aria-selected={college === cName}
                        tabIndex={-1}
                      >
                        <div className="dropdown-item-content">
                          <span className="dropdown-item-icon">🎓</span>
                          <div>
                            <div className="dropdown-item-title">{cName}</div>
                            <div className="dropdown-item-sub">
                              {COLLEGE_LOCATIONS[cName] || 'India'}
                            </div>
                          </div>
                        </div>
                        {college === cName ? (
                          <span className="dropdown-badge-active">Selected</span>
                        ) : (
                          <span className="dropdown-action-hint">Select</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Quick Popular Indian Campus Chips */}
              <div className="popular-campuses-bar">
                <span className="popular-label">Popular:</span>
                <div className="popular-chips-list">
                  {POPULAR_INDIAN_COLLEGES.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={`popular-chip ${college === name ? 'chip-active' : ''}`}
                      onClick={() => handleSelectCollege(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </section>

        {/* =========================================================================
            THE 4 MAIN OPTIONS: Rooms | Food | Room Partner | Nearby
            Inactive before college is selected; Active & interactive after.
           ========================================================================= */}
        <section className="college-features-section" aria-label="Campus Essentials">
          <div className="features-status-header">
            <span className="features-status-label">
              {isCollegeSelected
                ? `Available for ${college}`
                : 'Select your college to unlock features'}
            </span>
          </div>

          <div className="features-cards-grid">
            
            {/* 1. ROOMS */}
            <div
              className={`feature-card card-rooms ${isCollegeSelected ? 'feature-active' : 'feature-inactive'}`}
              onClick={() => handleOptionClick('/rooms')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleOptionClick('/rooms'); }}
              aria-label="Rooms feature"
            >
              <div className="feature-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h2 className="feature-title">Rooms</h2>
              <p className="feature-subtitle">Hostels & PGs</p>
              
              <div className="feature-footer">
                <span className="feature-pill">
                  {isCollegeSelected ? 'Near Campus' : '🔒 Locked'}
                </span>
                <span className="feature-arrow" aria-hidden="true">→</span>
              </div>
            </div>

            {/* 2. FOOD */}
            <div
              className={`feature-card card-food ${isCollegeSelected ? 'feature-active' : 'feature-inactive'}`}
              onClick={() => handleOptionClick('/food')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleOptionClick('/food'); }}
              aria-label="Food feature"
            >
              <div className="feature-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <h2 className="feature-title">Food</h2>
              <p className="feature-subtitle">Mess & Tiffins</p>
              
              <div className="feature-footer">
                <span className="feature-pill">
                  {isCollegeSelected ? 'Meal Plans' : '🔒 Locked'}
                </span>
                <span className="feature-arrow" aria-hidden="true">→</span>
              </div>
            </div>

            {/* 3. ROOM PARTNER */}
            <div
              className={`feature-card card-roommate ${isCollegeSelected ? 'feature-active' : 'feature-inactive'}`}
              onClick={() => handleOptionClick('/roommates')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleOptionClick('/roommates'); }}
              aria-label="Room Partner feature"
            >
              <div className="feature-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h2 className="feature-title">Room Partner</h2>
              <p className="feature-subtitle">Student Matches</p>
              
              <div className="feature-footer">
                <span className="feature-pill">
                  {isCollegeSelected ? 'Find Flatmates' : '🔒 Locked'}
                </span>
                <span className="feature-arrow" aria-hidden="true">→</span>
              </div>
            </div>

            {/* 4. NEARBY */}
            <div
              className={`feature-card card-nearby ${isCollegeSelected ? 'feature-active' : 'feature-inactive'}`}
              onClick={() => handleOptionClick('/nearby')}
              role="button"
              tabIndex={isCollegeSelected ? 0 : -1}
              aria-disabled={!isCollegeSelected}
              onKeyDown={(e) => { if (e.key === 'Enter') handleOptionClick('/nearby'); }}
              aria-label={isCollegeSelected ? 'Nearby campus essentials' : 'Nearby campus essentials (locked until college is selected)'}
              title={isCollegeSelected ? 'Explore spots near your college' : 'Select your college first to unlock Nearby'}
            >
              <div className="feature-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
              </div>
              <h2 className="feature-title">Nearby</h2>
              <p className="feature-subtitle">Campus Essentials</p>
              
              <div className="feature-footer">
                <span className="feature-pill">
                  {isCollegeSelected ? 'Walkable Spots' : '🔒 Locked'}
                </span>
                <span className="feature-arrow" aria-hidden="true">→</span>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            STUDENT REQUIREMENTS SECTION (Disabled until college selected)
           ========================================================================= */}
        <section className="college-requirements-banner-section" aria-label="Student Relocation Requirements">
          <div className={`home-requirements-card ${isCollegeSelected ? 'req-unlocked' : 'req-locked'}`}>
            <div className="home-requirements-info">
              <div className="home-requirements-badge">
                {isCollegeSelected ? '✓ Tailored Matching' : '🔒 Requirements Locked'}
              </div>
              <h3 className="home-requirements-title">
                {isCollegeSelected
                  ? `Personalize your stay near ${college}`
                  : 'Have specific relocation requirements?'}
              </h3>
              <p className="home-requirements-desc">
                {isCollegeSelected
                  ? `Set your target rent budget, single/shared room preference, meal choices, and walking distance radius.`
                  : 'Select your college above first to configure your budget, room type, and food requirements.'}
              </p>
            </div>

            <button
              type="button"
              className={`btn ${isCollegeSelected ? 'btn-primary' : 'btn-req-disabled'}`}
              onClick={() => handleOptionClick('/requirements')}
              aria-disabled={!isCollegeSelected}
              title={isCollegeSelected ? 'Open requirements form' : 'Select your college above to unlock Requirements'}
            >
              {isCollegeSelected ? (
                <>
                  <span>Set Requirements</span>
                  <span aria-hidden="true">→</span>
                </>
              ) : (
                <>
                  <span>🔒 Requirements (Disabled)</span>
                </>
              )}
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
