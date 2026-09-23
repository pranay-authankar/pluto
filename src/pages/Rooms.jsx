import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRelocation } from '../context/RelocationContext';
import { roomsData } from '../data/mockData';
import { maskPhoneNumber } from '../utils/phoneUtils';
import PlutoMap from '../components/PlutoMap';

export default function Rooms() {
  const { college } = useRelocation();
  const navigate = useNavigate();

  // Multi-category student filter controls
  const [filterType, setFilterType] = useState('all');
  const [maxBudget, setMaxBudget] = useState(15000); // 15000 represents Any / Max
  const [filterDistance, setFilterDistance] = useState('all');
  const [filterAmenity, setFilterAmenity] = useState('all');
  const [showMap, setShowMap] = useState(false);

  const isFiltered = filterType !== 'all' || maxBudget < 15000 || filterDistance !== 'all' || filterAmenity !== 'all';

  const resetFilters = () => {
    setFilterType('all');
    setMaxBudget(15000);
    setFilterDistance('all');
    setFilterAmenity('all');
  };

  const filteredRooms = roomsData.filter(room => {
    // 1. Room Type
    if (filterType !== 'all' && room.type.toLowerCase() !== filterType.toLowerCase()) {
      return false;
    }
    // 2. Budget via range strip
    if (maxBudget < 15000 && room.numericPrice > maxBudget) {
      return false;
    }
    // 3. Distance
    if (filterDistance !== 'all') {
      const maxDist = parseFloat(filterDistance);
      const roomDist = parseFloat(room.distance);
      if (roomDist > maxDist) return false;
    }
    // 4. Amenity
    if (filterAmenity !== 'all') {
      if (!room.facilities || !room.facilities.some(f => f.toLowerCase() === filterAmenity.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const sliderPct = Math.min(100, Math.max(0, ((maxBudget - 4000) / (15000 - 4000)) * 100));

  // Feature icon & badge style resolver
  const getFeatureBadge = (facility) => {
    const fLower = facility.toLowerCase();
    if (fLower.includes('ac')) return { icon: '❄️', label: 'AC', className: 'ac' };
    if (fLower.includes('bath')) return { icon: '🚿', label: 'Attached Bath', className: 'bath' };
    if (fLower.includes('wi-fi') || fLower.includes('wifi')) return { icon: '📶', label: 'Wi-Fi', className: 'wifi' };
    if (fLower.includes('power') || fLower.includes('backup')) return { icon: '⚡', label: 'Power Backup', className: 'backup' };
    if (fLower.includes('desk') || fLower.includes('study')) return { icon: '📚', label: 'Study Desk', className: 'desk' };
    if (fLower.includes('food') || fLower.includes('mess')) return { icon: '🍽️', label: 'Mess Nearby', className: 'bath' };
    if (fLower.includes('laundry')) return { icon: '🧺', label: 'Laundry', className: 'wifi' };
    if (fLower.includes('furnished')) return { icon: '🪑', label: 'Furnished', className: 'ac' };
    return { icon: '✨', label: facility, className: '' };
  };

  return (
    <main className="main-content">
      <div className="rooms-page-shell">
        {/* Navigation / Back Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)', fontWeight: 600 }}>
              Zero Brokerage Guarantee
            </span>
            <div className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>
              <span className="badge-dot"></span> Landlord Verified
            </div>
          </div>
        </div>

        {/* Header: Title & Subtitle */}
        <section className="rooms-header">
          <div className="rooms-title-group">
            <h1 className="rooms-title">Student Rooms & Stays</h1>
            <span className="rooms-subtitle">
              Verified student accommodations & PGs within walking distance of {college}
            </span>
          </div>
        </section>

        {/* Optional Collapsible Map View */}
        {showMap && (
          <div
            style={{
              marginBottom: 'var(--space-6)',
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid var(--slate-200)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--slate-50)',
                borderBottom: '1px solid var(--slate-200)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>🗺️</span>
                <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--slate-800)' }}>
                  Student Stays around {college}
                </span>
                <span className="badge badge-secondary" style={{ fontSize: '11px', padding: '2px 6px' }}>
                  {filteredRooms.length} stays plotted
                </span>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowMap(false)}
                style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)' }}
              >
                ✕ Close Map
              </button>
            </div>
            <PlutoMap
              college={college}
              items={filteredRooms}
              type="rooms"
              height="380px"
            />
          </div>
        )}

        {/* Enhanced Multi-Category Filter Bar */}
        <div className="rooms-filter-container">
          <div className="rooms-filter-header">
            <div className="rooms-filter-header-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filter Student Stays</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${showMap ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setShowMap(!showMap)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem'
                }}
                aria-label={showMap ? 'Hide Map' : 'View on Map'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
                <span>{showMap ? 'Hide Map' : 'View on Map'}</span>
              </button>

              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)' }}>
                Showing <strong>{filteredRooms.length}</strong> of {roomsData.length} stays
              </span>
              {isFiltered && (
                <button
                  type="button"
                  className="rooms-reset-btn"
                  onClick={resetFilters}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  <span>Reset All</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Dropdowns: Room Type, Distance, Amenity */}
          <div className="rooms-filter-grid">
            {/* Filter Category 1: Room Type */}
            <div className="rooms-filter-group">
              <label htmlFor="filter-room-type" className="rooms-filter-label">
                <span>Room Type</span>
              </label>
              <select
                id="filter-room-type"
                className="rooms-filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Room Types</option>
                <option value="single">Single Room (Private)</option>
                <option value="shared">Shared Room (2+ Sharing)</option>
              </select>
            </div>

            {/* Filter Category 2: Distance from Campus */}
            <div className="rooms-filter-group">
              <label htmlFor="filter-distance" className="rooms-filter-label">
                <span>Max Distance</span>
              </label>
              <select
                id="filter-distance"
                className="rooms-filter-select"
                value={filterDistance}
                onChange={(e) => setFilterDistance(e.target.value)}
              >
                <option value="all">Any Distance</option>
                <option value="0.3">Within 0.3 km (&lt; 4 min walk)</option>
                <option value="0.5">Within 0.5 km (&lt; 7 min walk)</option>
                <option value="1.0">Within 1.0 km (&lt; 12 min walk)</option>
              </select>
            </div>

            {/* Filter Category 3: Key Amenity */}
            <div className="rooms-filter-group">
              <label htmlFor="filter-amenity" className="rooms-filter-label">
                <span>Key Amenity</span>
              </label>
              <select
                id="filter-amenity"
                className="rooms-filter-select"
                value={filterAmenity}
                onChange={(e) => setFilterAmenity(e.target.value)}
              >
                <option value="all">All Amenities</option>
                <option value="Attached Bath">🚿 Attached Bath</option>
                <option value="AC">❄️ AC / Climate Control</option>
                <option value="Wi-Fi">📶 High-Speed Wi-Fi</option>
                <option value="Power Backup">⚡ Power Backup</option>
                <option value="Study Desk">📚 Study Desk</option>
                <option value="Furnished">🪑 Fully Furnished</option>
                <option value="Food/Mess Nearby">🍽️ Mess / Food Nearby</option>
              </select>
            </div>
          </div>

          {/* Interactive Budget Range Strip */}
          <div className="rooms-budget-strip-container">
            <div className="rooms-budget-strip-top">
              <div className="rooms-budget-strip-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M6 12h.01M18 12h.01" />
                </svg>
                <span>Maximum Monthly Budget (Range Strip)</span>
              </div>
              <div className="rooms-budget-value-badge">
                {maxBudget >= 15000 ? 'Any Budget (Up to ₹15,000+)' : `Up to ₹${maxBudget.toLocaleString('en-IN')}/mo`}
              </div>
            </div>

            <div className="rooms-range-wrapper">
              <input
                type="range"
                min="4000"
                max="15000"
                step="500"
                value={maxBudget}
                onChange={(e) => setMaxBudget(parseInt(e.target.value, 10))}
                className="rooms-range-slider"
                style={{ '--slider-pct': `${sliderPct}%` }}
                aria-label="Filter maximum budget range"
              />
              <div className="rooms-range-markers">
                <span>₹4,000</span>
                <span>₹7,000</span>
                <span>₹10,000</span>
                <span>₹12,500</span>
                <span>₹15,000 (Any)</span>
              </div>
            </div>

            {/* Quick Preset Chips for Students */}
            <div className="rooms-range-presets">
              <span style={{ fontSize: '0.68rem', color: 'var(--slate-500)', fontWeight: 600 }}>Quick Presets:</span>
              <button
                type="button"
                className={`rooms-preset-chip ${maxBudget === 6500 ? 'active' : ''}`}
                onClick={() => setMaxBudget(6500)}
              >
                ≤ ₹6,500
              </button>
              <button
                type="button"
                className={`rooms-preset-chip ${maxBudget === 8500 ? 'active' : ''}`}
                onClick={() => setMaxBudget(8500)}
              >
                ≤ ₹8,500
              </button>
              <button
                type="button"
                className={`rooms-preset-chip ${maxBudget === 10000 ? 'active' : ''}`}
                onClick={() => setMaxBudget(10000)}
              >
                ≤ ₹10,000
              </button>
              <button
                type="button"
                className={`rooms-preset-chip ${maxBudget === 15000 ? 'active' : ''}`}
                onClick={() => setMaxBudget(15000)}
              >
                Any Budget
              </button>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <section className="rooms-grid" aria-label="Rooms Grid">
          {filteredRooms.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: 'var(--space-12) var(--space-4)',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--slate-700)'
            }}>
              <p style={{ color: 'var(--slate-200)', fontSize: 'var(--font-size-base)', fontWeight: '600', marginBottom: 'var(--space-2)' }}>
                No rooms match your specific criteria.
              </p>
              <p style={{ color: 'var(--slate-400)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                Try adjusting your budget slider, distance, or amenity filters to see more available options.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={resetFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredRooms.map(room => (
              <div
                key={room.id}
                className="room-catalog-card"
                onClick={() => navigate(`/rooms/${room.id}`)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/rooms/${room.id}`); }}
              >
                {/* Photo & Badges */}
                <div className="room-catalog-img-wrapper">
                  <img src={room.image} alt={room.name} className="room-catalog-img" />
                  <div style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)', display: 'flex', gap: 'var(--space-1-5)', zIndex: 2 }}>
                    <span className="badge badge-success">
                      <span className="badge-dot"></span> {room.type} Room
                    </span>
                    {room.bestMatch && <span className="badge badge-primary">★ Best Match</span>}
                  </div>
                </div>

                <div className="room-catalog-body">
                  <h2 className="room-catalog-name">{room.name}</h2>

                  {/* Highlighted Features at First Glance (Small in size, distinct color & icon) */}
                  {room.facilities && room.facilities.length > 0 && (
                    <div className="room-features-row" aria-label="Highlighted Room Features">
                      {room.facilities.slice(0, 3).map((f, i) => {
                        const badge = getFeatureBadge(f);
                        return (
                          <span
                            key={i}
                            className={`room-feature-chip ${badge.className}`}
                            title={f}
                          >
                            <span>{badge.icon}</span>
                            <span>{badge.label}</span>
                          </span>
                        );
                      })}
                      {room.facilities.length > 3 && (
                        <span className="room-feature-chip more">
                          +{room.facilities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price & Campus Distance Row */}
                  <div className="room-catalog-meta-row">
                    <span className="room-catalog-price">{room.priceINR}</span>
                    <span className="room-catalog-dist">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="10" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                      </svg>
                      <span>{room.distance} to Campus</span>
                    </span>
                  </div>

                  {/* Room Owner Contact Strip on Card */}
                  {room.owner && (
                    <div className="room-card-owner-strip" onClick={(e) => e.stopPropagation()}>
                      <div className="room-card-owner-left">
                        <div className="room-card-owner-avatar">
                          {room.owner.name.charAt(0)}
                        </div>
                        <div className="room-card-owner-meta">
                          <span className="room-card-owner-name">{room.owner.name}</span>
                          <span className="room-card-owner-label">Owner • {maskPhoneNumber(room.owner.phone)}</span>
                        </div>
                      </div>
                      <a
                        href={`tel:${maskPhoneNumber(room.owner.phone)}`}
                        className="btn-card-call-owner"
                        title={`Direct call to ${room.owner.name}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span>Call</span>
                      </a>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="room-card-footer-btns">
                    <button
                      type="button"
                      className="btn-room-details"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/rooms/${room.id}`);
                      }}
                    >
                      <span>View Full Details & Map</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
