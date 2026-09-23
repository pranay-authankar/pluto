import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRelocation } from '../context/RelocationContext';
import { roommatesData, vacantSharedRooms, indianColleges } from '../data/mockData';

const POPULAR_COLLEGES = [
  'IIT Bombay',
  'IIT Delhi',
  'BITS Pilani',
  'IIT Madras',
  'Delhi University (DU)',
  'VIT Vellore'
];

export default function Roommates() {
  const { college, collegeId, setCollege } = useRelocation();
  const navigate = useNavigate();

  const isCollegeSelected = Boolean(college && college.trim());

  // Persist active choice across page reloads/refreshes
  const [activeChoice, setActiveChoice] = useState(() => {
    try {
      return sessionStorage.getItem('roommates_active_choice') || 'have-room';
    } catch (e) {
      return 'have-room';
    }
  });

  // Filter state
  const [filterBudget, setFilterBudget] = useState('all');

  const handleChoiceChange = (choice) => {
    setActiveChoice(choice);
    try {
      sessionStorage.setItem('roommates_active_choice', choice);
    } catch (e) {}
  };

  // Helper to normalize college ID
  const getNormalizedId = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const currentCollegeId = collegeId || getNormalizedId(college);

  // College-specific filtered lists (Do NOT show results from other colleges)
  const filteredStudents = roommatesData.filter((student) => {
    if (!isCollegeSelected) return false;
    const studentCollegeId = student.collegeId || getNormalizedId(student.college);
    const matchesCollege = (currentCollegeId && studentCollegeId === currentCollegeId) || student.college === college;
    if (!matchesCollege) return false;

    if (filterBudget !== 'all' && student.budgetValue > parseInt(filterBudget, 10)) {
      return false;
    }
    return true;
  });

  const filteredRooms = vacantSharedRooms.filter((room) => {
    if (!isCollegeSelected) return false;
    const roomCollegeId = room.collegeId || getNormalizedId(room.college);
    const matchesCollege = (currentCollegeId && roomCollegeId === currentCollegeId) || room.college === college;
    if (!matchesCollege) return false;

    if (filterBudget !== 'all' && room.rentValue > parseInt(filterBudget, 10)) {
      return false;
    }
    return true;
  });

  return (
    <main className="main-content">
      <div className="roommates-page-shell">
        
        {/* Navigation & Header Status Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Home</span>
          </button>
          
          {/* Subtle College Context Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {isCollegeSelected ? (
              <>
                <div
                  className="badge badge-primary"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    padding: '0.4rem 0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 700
                  }}
                  title={`Filtered for ${college}`}
                >
                  <span>🎓</span>
                  <span>{college}</span>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-lg)' }}
                  onClick={() => navigate('/')}
                  title="Change your active college"
                >
                  Change
                </button>
              </>
            ) : (
              <button
                type="button"
                className="badge"
                style={{
                  fontSize: 'var(--font-size-xs)',
                  padding: '0.4rem 0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  background: 'var(--slate-100)',
                  color: 'var(--slate-600)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/')}
                title="Click to select college"
              >
                <span>🎓</span>
                <span>Select College</span>
              </button>
            )}

            <div className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>
              <span className="badge-dot"></span> Student Verified
            </div>
          </div>
        </div>

        {/* Page Title & Subtle College Context Subtitle */}
        <section className="roommates-header" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="roommates-title-group">
            <h1 className="roommates-title">Room Partner Finder</h1>
            <span className="roommates-subtitle">
              {isCollegeSelected ? (
                <>Verified student peers and vacant shared room openings near <strong style={{ color: 'var(--slate-800)' }}>{college}</strong></>
              ) : (
                'Find verified student peers and vacant shared room openings near your campus'
              )}
            </span>
          </div>
        </section>

        {/* Landing Page: Existing Two-Option Structure Unchanged */}
        <section className="roommate-choices-container" aria-label="Select your room search mode">
          {/* Choice 1: I Have a Room */}
          <button
            type="button"
            className={`choice-selector-card ${activeChoice === 'have-room' ? 'selected' : ''}`}
            onClick={() => handleChoiceChange('have-room')}
          >
            <div className="choice-icon-wrap">
              <span>🏠</span>
            </div>
            <div className="choice-content">
              <span className="choice-tag">Host / Lease Holder</span>
              <span className="choice-title">I Have a Room</span>
              <span className="choice-desc">
                {isCollegeSelected
                  ? `Find students looking for a room near ${college}`
                  : 'Find students looking for a room near campus'}
              </span>
            </div>
            <div className="choice-radio-indicator"></div>
          </button>

          {/* Choice 2: I Need a Room */}
          <button
            type="button"
            className={`choice-selector-card ${activeChoice === 'need-room' ? 'selected' : ''}`}
            onClick={() => handleChoiceChange('need-room')}
          >
            <div className="choice-icon-wrap">
              <span>🛏️</span>
            </div>
            <div className="choice-content">
              <span className="choice-tag">Seeking Accommodation</span>
              <span className="choice-title">I Need a Room</span>
              <span className="choice-desc">
                {isCollegeSelected
                  ? `Find vacant shared rooms near ${college} with roommates`
                  : 'Find vacant shared rooms near campus with roommates'}
              </span>
            </div>
            <div className="choice-radio-indicator"></div>
          </button>
        </section>

        {/* =========================================================================
            RESULTS AREA
            Case 1: No college selected → Ask student to select a college first.
            Case 2: College selected → Show college-specific results for active choice.
           ========================================================================= */}
        {!isCollegeSelected ? (
          <div
            style={{
              maxWidth: '680px',
              margin: 'var(--space-6) auto',
              textAlign: 'center',
              background: 'var(--color-white)',
              border: '1.5px solid var(--slate-200)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'clamp(2rem, 5vw, 3.5rem) var(--space-6)',
              boxShadow: '0 10px 30px -4px rgba(15, 23, 42, 0.08)'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-2xl)',
                background: 'var(--primary-50)',
                color: 'var(--primary-600)',
                fontSize: '1.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-3)',
                boxShadow: '0 4px 12px var(--primary-glow)'
              }}
              aria-hidden="true"
            >
              🎓
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)',
                fontWeight: 800,
                color: 'var(--slate-900)',
                marginBottom: 'var(--space-2)',
                letterSpacing: '-0.02em'
              }}
            >
              Select your college first
            </h2>

            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--slate-500)',
                lineHeight: 1.6,
                maxWidth: '480px',
                margin: '0 auto var(--space-5)'
              }}
            >
              Please select your college to view verified room partner matches and shared rooms near your campus.
            </p>

            {/* Quick College Selector Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {POPULAR_COLLEGES.map((cName) => (
                  <button
                    key={cName}
                    type="button"
                    className="campus-pill-btn"
                    onClick={() => setCollege(cName)}
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}
                  >
                    🎓 {cName}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-primary btn-md"
                onClick={() => navigate('/')}
                style={{
                  marginTop: 'var(--space-3)',
                  padding: '0.75rem 1.8rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: '0 4px 14px var(--primary-glow)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Or Select from Home Page</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Sub-bar with count and simple filter pills */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 800, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{activeChoice === 'have-room' ? 'Students Seeking a Room' : 'Available Vacant Shared Rooms'}</span>
                <span className="badge badge-secondary" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  {activeChoice === 'have-room' ? filteredStudents.length : filteredRooms.length} near {college}
                </span>
              </div>

              {/* Quick Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`food-filter-btn ${filterBudget === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterBudget('all')}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}
                >
                  All Budgets
                </button>
                <button
                  type="button"
                  className={`food-filter-btn ${filterBudget === '7500' ? 'active' : ''}`}
                  onClick={() => setFilterBudget('7500')}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}
                >
                  Under ₹7,500
                </button>
                <button
                  type="button"
                  className={`food-filter-btn ${filterBudget === '9000' ? 'active' : ''}`}
                  onClick={() => setFilterBudget('9000')}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}
                >
                  Under ₹9,000
                </button>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                  📍 {college}
                </span>
              </div>
            </div>

            {/* VIEW 1: I Have a Room → Students looking for a room near selected college */}
            {activeChoice === 'have-room' && (
              <section aria-label={`Students Seeking a Room near ${college}`}>
                {filteredStudents.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 'var(--space-12) var(--space-4)',
                      color: 'var(--slate-500)',
                      background: 'var(--color-white)',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--slate-200)'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🔍</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--slate-800)', marginBottom: '4px' }}>
                      No student profiles found near {college} with the selected budget
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-400)', marginBottom: 'var(--space-4)' }}>
                      Try selecting "All Budgets" or check back soon as more students join.
                    </div>
                    {filterBudget !== 'all' && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setFilterBudget('all')}
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="roommates-grid">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="partner-card"
                        onClick={() => navigate(`/roommates/${student.id}`)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/roommates/${student.id}`); }}
                      >
                        {/* Identity: Avatar & Details */}
                        <div className="partner-card-header">
                          <div className="partner-identity">
                            <div className="partner-avatar" style={{ background: student.avatarBg }}>
                              {student.initials}
                              <span className="partner-avatar-dot" title="Verified Student"></span>
                            </div>
                            <div>
                              <h2 className="partner-name">{student.name}</h2>
                              <span className="partner-college">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                                </svg>
                                <span>{student.college}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Metrics: Budget · Distance */}
                        <div className="partner-meta-row" style={{ background: 'var(--slate-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-100)' }}>
                          <div className="partner-meta-item">
                            <span className="meta-label" style={{ fontSize: '0.65rem' }}>Budget</span>
                            <span className="meta-val" style={{ color: 'var(--primary-700)', fontWeight: 800, fontSize: '1.1rem' }}>
                              {student.budgetINR}
                            </span>
                          </div>
                          <div className="partner-meta-item">
                            <span className="meta-label" style={{ fontSize: '0.65rem' }}>Preferred Distance</span>
                            <span className="meta-val" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                              {student.distance}
                            </span>
                          </div>
                        </div>

                        {/* Basic Tags */}
                        <div className="partner-tags-row">
                          {student.tags.map((tag, idx) => {
                            let tagClass = 'partner-tag';
                            let icon = '';
                            const lower = tag.toLowerCase();
                            if (lower.includes('non-veg')) {
                              tagClass += ' tag-nonveg';
                              icon = '🍗';
                            } else if (lower.includes('veg')) {
                              tagClass += ' tag-veg';
                              icon = '🌱';
                            } else if (lower.includes('quiet')) {
                              tagClass += ' tag-quiet';
                              icon = '🤫';
                            } else if (lower.includes('early')) {
                              tagClass += ' tag-early';
                              icon = '🌅';
                            } else if (lower.includes('shared')) {
                              tagClass += ' tag-shared';
                              icon = '👥';
                            } else if (lower.includes('night')) {
                              tagClass += ' tag-night';
                              icon = '🌙';
                            } else if (lower.includes('smoker')) {
                              tagClass += ' tag-veg';
                              icon = '🚭';
                            } else if (lower.includes('food')) {
                              tagClass += ' tag-early';
                              icon = '🍽️';
                            } else if (lower.includes('single')) {
                              tagClass += ' tag-shared';
                              icon = '🛏️';
                            }

                            return (
                              <span key={idx} className={tagClass}>
                                {icon && <span style={{ fontSize: '0.78rem' }}>{icon}</span>}
                                <span>{tag}</span>
                              </span>
                            );
                          })}
                        </div>

                        {/* View Action Button */}
                        <button
                          type="button"
                          className="btn-partner-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/roommates/${student.id}`);
                          }}
                        >
                          <span>View</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* VIEW 2: I Need a Room → Vacant shared rooms near selected college */}
            {activeChoice === 'need-room' && (
              <section aria-label={`Vacant Shared Rooms near ${college}`}>
                {filteredRooms.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 'var(--space-12) var(--space-4)',
                      color: 'var(--slate-500)',
                      background: 'var(--color-white)',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--slate-200)'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🛏️</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--slate-800)', marginBottom: '4px' }}>
                      No vacant shared rooms found near {college} with the selected budget
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-400)', marginBottom: 'var(--space-4)' }}>
                      Try selecting "All Budgets" or check back soon as more rooms become vacant.
                    </div>
                    {filterBudget !== 'all' && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setFilterBudget('all')}
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="roommates-grid">
                    {filteredRooms.map((item) => (
                      <div
                        key={item.id}
                        className="vacant-room-card"
                        onClick={() => navigate(`/roommates/${item.id}`)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/roommates/${item.id}`); }}
                      >
                        {/* Visual Thumbnail */}
                        <div className="vacant-room-img-wrap">
                          <img src={item.image} alt={item.room} className="vacant-room-img" />
                          <div style={{ position: 'absolute', top: 'var(--space-2-5)', left: 'var(--space-2-5)' }}>
                            <span className="badge badge-primary" style={{ fontSize: '0.7rem', backdropFilter: 'blur(4px)', background: 'rgba(37, 99, 235, 0.92)' }}>
                              {item.sharingType}
                            </span>
                          </div>
                          <div style={{ position: 'absolute', bottom: 'var(--space-2)', right: 'var(--space-2-5)', background: 'rgba(15, 23, 42, 0.82)', color: '#fff', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700 }}>
                            {item.rent}
                          </div>
                        </div>

                        <div className="vacant-room-body">
                          {/* Room Title */}
                          <h2 className="vacant-room-title">{item.room}</h2>

                          {/* Detail Metrics Grid */}
                          <div className="vacant-room-detail-grid">
                            <div>
                              <span className="vacant-room-detail-label">Monthly Rent</span>
                              <span className="vacant-room-detail-val" style={{ color: 'var(--primary-700)', fontSize: '1.05rem', fontWeight: 800 }}>
                                {item.rent}
                              </span>
                            </div>
                            <div>
                              <span className="vacant-room-detail-label">Sharing Type</span>
                              <span className="vacant-room-detail-val" style={{ fontSize: '0.85rem' }}>
                                {item.sharingType}
                              </span>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                              <span className="vacant-room-detail-label">Current Occupant</span>
                              <span className="vacant-room-detail-val" style={{ color: 'var(--slate-900)', fontSize: '0.88rem' }}>
                                👤 {item.currentOccupant}
                              </span>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                              <span className="vacant-room-detail-label">Location</span>
                              <span className="vacant-room-detail-val" style={{ fontSize: '0.8rem', color: 'var(--slate-600)', fontWeight: 500 }}>
                                📍 {item.location}
                              </span>
                            </div>
                          </div>

                          {/* Features / Amenities */}
                          <div className="partner-tags-row">
                            {item.tags.map((tag, idx) => {
                              let icon = '✓';
                              const lower = tag.toLowerCase();
                              if (lower.includes('bath') || lower.includes('washroom')) icon = '🚿';
                              else if (lower.includes('wi-fi') || lower.includes('wifi')) icon = '📶';
                              else if (lower.includes('furnish')) icon = '🛋️';
                              else if (lower.includes('balcony') || lower.includes('garden')) icon = '🌿';
                              else if (lower.includes('ac')) icon = '❄️';
                              else if (lower.includes('cook') || lower.includes('kitchen')) icon = '🍳';
                              else if (lower.includes('backup') || lower.includes('power')) icon = '⚡';
                              else if (lower.includes('desk') || lower.includes('study')) icon = '📚';

                              return (
                                <span key={idx} className="partner-tag tag-amenity">
                                  <span>{icon}</span>
                                  <span>{tag}</span>
                                </span>
                              );
                            })}
                          </div>

                          {/* View Action Button */}
                          <button
                            type="button"
                            className="btn-partner-view"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/roommates/${item.id}`);
                            }}
                          >
                            <span>View</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <path d="M5 12h14"></path>
                              <path d="m12 5 7 7-7 7"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
