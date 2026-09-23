import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import L from 'leaflet';
import { useRelocation } from '../context/RelocationContext';
import { indianColleges, campusCoordinates } from '../data/mockData';

export default function Requirements() {
  const { college, setCollege, requirements, updateRequirements, showToast } = useRelocation();
  const navigate = useNavigate();

  // College Context - auto-kept from Home
  const [activeCollege, setActiveCollege] = useState(college || requirements?.college || '');
  const [isEditingCollege, setIsEditingCollege] = useState(!college && !requirements?.college);

  // 1. Maximum Monthly Rent (₹3,000 → ₹20,000) + Any / Not Specified
  const initialRent = requirements?.preferences?.maxRent !== 'any' && requirements?.preferences?.maxRent
    ? Number(requirements.preferences.maxRent)
    : (requirements?.budget?.maxMonthly || 8500);
  const initialIsRentAny = requirements?.preferences?.isRentAny ?? (requirements?.preferences?.maxRent === 'any');

  const [maxRent, setMaxRent] = useState(initialRent >= 3000 && initialRent <= 20000 ? initialRent : 8500);
  const [isRentAny, setIsRentAny] = useState(initialIsRentAny);

  // 2. Room Type (Single | Shared | Any)
  const [roomType, setRoomType] = useState(requirements?.preferences?.roomType || 'any');

  // 3. Food Service (Veg | Non-Veg | No Need | Any)
  const [foodService, setFoodService] = useState(requirements?.preferences?.foodService || 'any');

  // 4. Room Partner (Male | Female | No Need)
  const [roomPartner, setRoomPartner] = useState(requirements?.preferences?.roomPartner || 'none');

  // 5. Maximum Distance (0.5 km → 10 km) + Any
  const initialDist = requirements?.preferences?.maxDistance !== 'any' && requirements?.preferences?.maxDistance
    ? Number(requirements.preferences.maxDistance)
    : 3.0;
  const initialIsDistAny = requirements?.preferences?.isDistanceAny ?? (requirements?.preferences?.maxDistance === 'any');

  const [maxDistance, setMaxDistance] = useState(initialDist >= 0.5 && initialDist <= 10 ? initialDist : 3.0);
  const [isDistanceAny, setIsDistanceAny] = useState(initialIsDistAny);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if context college changes
  useEffect(() => {
    if (college && !activeCollege) {
      setActiveCollege(college);
      setIsEditingCollege(false);
    }
  }, [college, activeCollege]);

  const mapRef = useRef(null);
  const leafletInstance = useRef(null);

  const coords = (activeCollege && campusCoordinates[activeCollege])
    ? campusCoordinates[activeCollege]
    : campusCoordinates['IIT Bombay'] || { lat: 19.1334, lng: 72.9133 };

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletInstance.current) {
      leafletInstance.current.remove();
      leafletInstance.current = null;
    }

    const map = L.map(mapRef.current, {
      center: [coords.lat, coords.lng],
      zoom: isDistanceAny ? 13 : maxDistance <= 1 ? 15 : maxDistance <= 3 ? 14 : 13,
      zoomControl: false,
      attributionControl: true
    });

    leafletInstance.current = map;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    const collegeIcon = L.divIcon({
      className: 'custom-college-icon',
      html: `
        <div style="background: #4f46e5; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2.5px solid #fff; box-shadow: 0 4px 12px rgba(79,70,229,0.4);">
          🎓
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    L.marker([coords.lat, coords.lng], { icon: collegeIcon })
      .addTo(map)
      .bindPopup(`<strong>🎓 ${activeCollege || 'Campus Center'}</strong>`);

    const radiusMeters = isDistanceAny ? 4000 : maxDistance * 1000;
    const circle = L.circle([coords.lat, coords.lng], {
      color: '#4f46e5',
      fillColor: '#4f46e5',
      fillOpacity: 0.12,
      dashArray: '5, 8',
      weight: 2,
      radius: radiusMeters
    }).addTo(map);

    map.fitBounds(circle.getBounds(), { padding: [15, 15] });

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [activeCollege, maxDistance, isDistanceAny, coords.lat, coords.lng]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalCollege = activeCollege.trim() || college || 'IIT Bombay';
    if (!finalCollege) {
      showToast('College Required', 'Please choose your college to personalize recommendations.', 'warning');
      setIsEditingCollege(true);
      return;
    }

    const payload = {
      college: finalCollege,
      budget: {
        currency: 'INR',
        maxMonthly: isRentAny ? null : Number(maxRent),
        isAny: isRentAny,
        amount: isRentAny ? 20000 : Number(maxRent),
        formatted: isRentAny ? 'Any / Not Specified' : `₹${Number(maxRent).toLocaleString()}/mo`
      },
      preferences: {
        maxRent: isRentAny ? 'any' : Number(maxRent),
        isRentAny,
        roomType,      // 'single' | 'shared' | 'any'
        foodService,   // 'veg' | 'non-veg' | 'none' | 'any'
        roomPartner,   // 'male' | 'female' | 'none'
        maxDistance: isDistanceAny ? 'any' : Number(maxDistance),
        isDistanceAny,
        // Helper and backward-compat keys
        room: roomType,
        food: foodService,
        roommateGender: roomPartner,
        maxDistanceKm: isDistanceAny ? 999 : Number(maxDistance),
        matchRoommate: roomPartner !== 'none'
      }
    };

    setIsSubmitting(true);
    setCollege(finalCollege);
    updateRequirements(payload);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/recommendations');
    }, 250);
  };

  // Slider progress percent for visual gradient fill
  const rentPercent = Math.min(100, Math.max(0, ((maxRent - 3000) / (20000 - 3000)) * 100));
  const distPercent = Math.min(100, Math.max(0, ((maxDistance - 0.5) / (10 - 0.5)) * 100));

  return (
    <main className="main-content">
      <div className="req-page-container">

        {/* Minimal Navigation Back */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <Link to="/" className="nav-link" style={{ display: 'inline-flex', padding: 0, color: 'var(--slate-500)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Minimal Header */}
        <div className="req-header">
          <div className="req-badge">
            <span>⚡ Demand Matching</span>
          </div>
          <h1 className="req-title">Student Requirements</h1>
          <p className="req-subtitle">Configure your stay, food, and partner preferences around your college.</p>
        </div>

        <div className="req-grid">
          {/* Main Form */}
          <form className="req-form-card" onSubmit={handleSubmit} noValidate>

            {/* College Context (Auto-kept from Home) */}
            <div className="req-section">
              <div className="req-label-row">
                <label className="req-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                  Selected College
                </label>
                <span className="req-selected-val">Auto-Synced</span>
              </div>

              {!isEditingCollege && activeCollege ? (
                <div className="college-status-card">
                  <div className="college-status-left">
                    <div className="college-status-icon">🎓</div>
                    <div>
                      <div className="college-status-title">Active Campus Location</div>
                      <div className="college-status-name">{activeCollege}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-change-college"
                    onClick={() => setIsEditingCollege(true)}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="college-input-wrapper">
                  <div className="input-icon-group">
                    <div className="input-icon-left">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      value={activeCollege}
                      onChange={(e) => setActiveCollege(e.target.value)}
                      placeholder="Select or enter your college..."
                      list="college-options"
                      required
                    />
                    <datalist id="college-options">
                      {indianColleges.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                  {activeCollege && (
                    <button
                      type="button"
                      className="btn-change-college"
                      style={{ marginTop: 'var(--space-2)' }}
                      onClick={() => setIsEditingCollege(false)}
                    >
                      Lock College Selection
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 1. Maximum Monthly Rent (₹3,000 → ₹20,000 + Any / Not Specified) */}
            <div className="req-section">
              <div className="req-label-row">
                <label className="req-label">
                  <span>Maximum Monthly Rent</span>
                </label>
                <span className="req-selected-val">
                  {isRentAny ? 'Any / Not Specified' : `Up to ₹${Number(maxRent).toLocaleString()}/mo`}
                </span>
              </div>

              <div className={`slider-control-box ${isRentAny ? 'disabled' : ''}`}>
                <div className="slider-val-row">
                  <div className={`slider-big-val ${isRentAny ? 'dimmed' : ''}`}>
                    {isRentAny ? (
                      <span>Any / Not Specified</span>
                    ) : (
                      <>
                        <span>₹{Number(maxRent).toLocaleString()}</span>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)', fontWeight: 500 }}>/month</span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`toggle-any-pill ${isRentAny ? 'active' : ''}`}
                    onClick={() => setIsRentAny(!isRentAny)}
                  >
                    <span>{isRentAny ? '✓ Any Rent' : 'Any / Not Specified'}</span>
                  </button>
                </div>

                <input
                  type="range"
                  min="3000"
                  max="20000"
                  step="500"
                  value={maxRent}
                  disabled={isRentAny}
                  onChange={(e) => {
                    setMaxRent(Number(e.target.value));
                    if (isRentAny) setIsRentAny(false);
                  }}
                  className="modern-range-slider"
                  style={{
                    background: isRentAny
                      ? 'var(--slate-200)'
                      : `linear-gradient(to right, var(--primary-600) 0%, var(--primary-600) ${rentPercent}%, var(--slate-200) ${rentPercent}%, var(--slate-200) 100%)`
                  }}
                />

                <div className="slider-limits-row">
                  <span>₹3,000</span>
                  <span>₹10,000</span>
                  <span>₹20,000</span>
                </div>
              </div>
            </div>

            {/* 2. Room Type (Single | Shared | Any) */}
            <div className="req-section">
              <div className="req-label-row">
                <label className="req-label">Room Type</label>
                <span className="req-selected-val">
                  {roomType === 'single' ? 'Single' : roomType === 'shared' ? 'Shared' : 'Any'}
                </span>
              </div>

              <div className="choice-cards-row grid-3">
                <div
                  className={`choice-card ${roomType === 'single' ? 'selected' : ''}`}
                  onClick={() => setRoomType('single')}
                  tabIndex={0}
                  role="button"
                >
                  <div className="choice-check">✓</div>
                  <div className="choice-icon">🛏️</div>
                  <div className="choice-title">Single</div>
                  <div className="choice-sub">Private room</div>
                </div>

                <div
                  className={`choice-card ${roomType === 'shared' ? 'selected' : ''}`}
                  onClick={() => setRoomType('shared')}
                  tabIndex={0}
                  role="button"
                >
                  <div className="choice-check">✓</div>
                  <div className="choice-icon">👥</div>
                  <div className="choice-title">Shared</div>
                  <div className="choice-sub">Shared stay</div>
                </div>

                <div
                  className={`choice-card ${roomType === 'any' ? 'selected' : ''}`}
                  onClick={() => setRoomType('any')}
                  tabIndex={0}
                  role="button"
                >
                  <div className="choice-check">✓</div>
                  <div className="choice-icon">✨</div>
                  <div className="choice-title">Any</div>
                  <div className="choice-sub">No preference</div>
                </div>
              </div>
            </div>

            {/* 3. Food Service (Veg | Non-Veg | No Need | Any) */}
            <div className="req-section">
              <div className="req-label-row">
                <label className="req-label">Food Service</label>
                <span className="req-selected-val">
                  {foodService === 'veg' ? 'Veg' : foodService === 'non-veg' ? 'Non-Veg' : foodService === 'none' ? 'No Need' : 'Any'}
                </span>
              </div>

              <div className="choice-cards-row grid-4">
                <div
                  className={`choice-card ${foodService === 'veg' ? 'selected' : ''}`}
                  onClick={() => setFoodService('veg')}
                  tabIndex={0}
                  role="button"
                >
                  <div className="choice-check">✓</div>
                  <div className="choice-icon">🥗</div>
                  <div className="choice-title">Veg</div>
                  <div className="choice-sub">Pure veg</div>
                </div>

                <div
                  className={`choice-card ${foodService === 'non-veg' ? 'selected' : ''}`}
                  onClick={() => setFoodService('non-veg')}
                  tabIndex={0}
                  role="button"
                >
                  <div className="choice-check">✓</div>
                  <div className="choice-icon">🍗</div>
                  <div className="choice-title">Non-Veg</div>
                  <div className="choice-sub">Non-veg & veg</div>
                </div>

                <div
                  className={`choice-card danger-variant ${foodService === 'none' ? 'selected' : ''}`}
                  onClick={() => setFoodService('none')}
                  tabIndex={0}
                  role="button"
                >
                  <div className="choice-check">✓</div>
                  <div className="choice-icon">🚫</div>
                  <div className="choice-title">No Need</div>
                  <div className="choice-sub">Hide food options</div>
                </div>

                <div
                  className={`choice-card ${foodService === 'any' ? 'selected' : ''}`}
                  onClick={() => setFoodService('any')}
                  tabIndex={0}
                  role="button"
                >
                  <div className="choice-check">✓</div>
                  <div className="choice-icon">✨</div>
                  <div className="choice-title">Any</div>
                  <div className="choice-sub">All food options</div>
                </div>
              </div>
            </div>

            {/* 4. Room Partner (Male | Female | No Need) */}
            <div className="req-section">
              <div className="req-label-row">
                <label className="req-label">Room Partner</label>
                <span className="req-selected-val">
                  {roomPartner === 'male' ? 'Male' : roomPartner === 'female' ? 'Female' : 'No Need'}
                </span>
              </div>

              <div className="choice-cards-row grid-3">
                <div
                  className={`choice-card ${roomPartner === 'male' ? 'selected' : ''}`}
                  onClick={() => setRoomPartner('male')}
                  tabIndex={0}
                  role="button"
                >
                  <div className="choice-check">✓</div>
                  <div className="choice-icon">👨</div>
                  <div className="choice-title">Male</div>
                  <div className="choice-sub">Male partners</div>
                </div>

                <div
                  className={`choice-card ${roomPartner === 'female' ? 'selected' : ''}`}
                  onClick={() => setRoomPartner('female')}
                  tabIndex={0}
                  role="button"
                >
                  <div className="choice-check">✓</div>
                  <div className="choice-icon">👩</div>
                  <div className="choice-title">Female</div>
                  <div className="choice-sub">Female partners</div>
                </div>

                <div
                  className={`choice-card danger-variant ${roomPartner === 'none' ? 'selected' : ''}`}
                  onClick={() => setRoomPartner('none')}
                  tabIndex={0}
                  role="button"
                >
                  <div className="choice-check">✓</div>
                  <div className="choice-icon">🚫</div>
                  <div className="choice-title">No Need</div>
                  <div className="choice-sub">Hide room partners</div>
                </div>
              </div>
            </div>

            {/* 5. Maximum Distance (0.5 km → 10 km + Any) */}
            <div className="req-section">
              <div className="req-label-row">
                <label className="req-label">Maximum Distance</label>
                <span className="req-selected-val">
                  {isDistanceAny ? 'Any' : `Within ${maxDistance} km`}
                </span>
              </div>

              <div className={`slider-control-box ${isDistanceAny ? 'disabled' : ''}`}>
                <div className="slider-val-row">
                  <div className={`slider-big-val ${isDistanceAny ? 'dimmed' : ''}`}>
                    {isDistanceAny ? (
                      <span>Any Distance</span>
                    ) : (
                      <>
                        <span>{maxDistance.toFixed(1)}</span>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)', fontWeight: 500 }}>km from campus</span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`toggle-any-pill ${isDistanceAny ? 'active' : ''}`}
                    onClick={() => setIsDistanceAny(!isDistanceAny)}
                  >
                    <span>{isDistanceAny ? '✓ Any Distance' : 'Any'}</span>
                  </button>
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={maxDistance}
                  disabled={isDistanceAny}
                  onChange={(e) => {
                    setMaxDistance(Number(e.target.value));
                    if (isDistanceAny) setIsDistanceAny(false);
                  }}
                  className="modern-range-slider"
                  style={{
                    background: isDistanceAny
                      ? 'var(--slate-200)'
                      : `linear-gradient(to right, var(--primary-600) 0%, var(--primary-600) ${distPercent}%, var(--slate-200) ${distPercent}%, var(--slate-200) 100%)`
                  }}
                />

                <div className="slider-limits-row">
                  <span>0.5 km</span>
                  <span>5.0 km</span>
                  <span>10.0 km</span>
                </div>
              </div>
            </div>

            {/* Prominent Action Button: View Results */}
            <button type="submit" className={`btn-find-place ${isSubmitting ? 'loading' : ''}`}>
              <span>{isSubmitting ? 'Matching Demands...' : 'View Results'}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>

          </form>

          {/* Proximity / Live Summary Column */}
          <aside className="preview-sticky-card">
            <div className="card-header" style={{ marginBottom: 0, paddingBottom: 'var(--space-2)' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold', color: 'var(--slate-900)' }}>
                Live Requirements Summary
              </div>
              <span className="badge badge-success"><span className="badge-dot"></span> Ready</span>
            </div>

            <div style={{ height: '220px', width: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--slate-200)', position: 'relative' }}>
              <div ref={mapRef} style={{ width: '100%', height: '100%' }} role="region" aria-label="Campus Search Radius Map"></div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--slate-900)' }}>
                {activeCollege || 'No College Selected'}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)' }}>
                Search Anchor & Campus Center
              </div>
            </div>

            <div className="divider" style={{ margin: 'var(--space-2) 0' }}></div>

            <div className="preview-summary-chips">
              <span className="summary-chip" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', fontWeight: 700 }}>
                📍 {activeCollege || 'College Required'}
              </span>
              <span className="summary-chip">
                💵 {isRentAny ? 'Rent: Any' : `Max Rent: ₹${Number(maxRent).toLocaleString()}`}
              </span>
              <span className="summary-chip">
                🛏️ Room: {roomType === 'any' ? 'Any' : roomType.toUpperCase()}
              </span>
              <span className="summary-chip" style={foodService === 'none' ? { color: '#dc2626', background: '#fee2e2' } : {}}>
                🍱 Food: {foodService === 'none' ? 'No Need (Hidden)' : foodService === 'veg' ? 'Veg Only' : foodService === 'non-veg' ? 'Non-Veg' : 'Any'}
              </span>
              <span className="summary-chip" style={roomPartner === 'none' ? { color: '#dc2626', background: '#fee2e2' } : {}}>
                🤝 Partner: {roomPartner === 'none' ? 'No Need (Hidden)' : `${roomPartner.charAt(0).toUpperCase() + roomPartner.slice(1)} Only`}
              </span>
              <span className="summary-chip">
                🚶 Radius: {isDistanceAny ? 'Any' : `≤ ${maxDistance} km`}
              </span>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}
