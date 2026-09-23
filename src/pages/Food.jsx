import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRelocation } from '../context/RelocationContext';
import { foodData } from '../data/mockData';
import PlutoMap from '../components/PlutoMap';

export default function Food() {
  const { college } = useRelocation();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showMap, setShowMap] = useState(false);

  const filteredFoods = foodData.filter(item => {
    if (activeFilter === 'veg') return item.veg === true;
    if (activeFilter === 'non-veg') return item.veg === false;
    if (activeFilter === 'tiffin') return item.type.toLowerCase().includes('tiffin');
    if (activeFilter === 'mess') return item.type.toLowerCase().includes('mess');
    if (activeFilter === 'restaurant') return item.type.toLowerCase().includes('restaurant');
    return true;
  });

  return (
    <main className="main-content">
      <div className="food-page-shell">
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {/* Optional Action: View on Map */}
            <button
              type="button"
              className={`btn btn-sm ${showMap ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowMap(!showMap)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
              title="Toggle map view"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
              <span>{showMap ? 'Hide Map' : 'View on Map'}</span>
            </button>
          </div>
        </div>

        {/* Optional Collapsible Map Section */}
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
                  Food Locations around {college}
                </span>
                <span className="badge badge-secondary" style={{ fontSize: '11px', padding: '2px 6px' }}>
                  {filteredFoods.length} meal spots plotted
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
              items={filteredFoods}
              type="food"
              height="380px"
            />
          </div>
        )}

        {/* Header: Title & Filter Pill Bar */}
        <section className="food-header">
          <div className="food-title-group">
            <h1 className="food-title">Food & Meal Plans</h1>
            <span className="food-subtitle">Near {college}</span>
          </div>

          {/* Simple Filters */}
          <nav className="food-filter-bar" aria-label="Food Categories">
            <button
              type="button"
              className={`food-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`food-filter-btn ${activeFilter === 'veg' ? 'active' : ''}`}
              onClick={() => setActiveFilter('veg')}
            >
              🌱 Veg
            </button>
            <button
              type="button"
              className={`food-filter-btn ${activeFilter === 'non-veg' ? 'active' : ''}`}
              onClick={() => setActiveFilter('non-veg')}
            >
              🍗 Non-Veg
            </button>
            <button
              type="button"
              className={`food-filter-btn ${activeFilter === 'tiffin' ? 'active' : ''}`}
              onClick={() => setActiveFilter('tiffin')}
            >
              🍱 Tiffin
            </button>
            <button
              type="button"
              className={`food-filter-btn ${activeFilter === 'mess' ? 'active' : ''}`}
              onClick={() => setActiveFilter('mess')}
            >
              🍲 Mess
            </button>
            <button
              type="button"
              className={`food-filter-btn ${activeFilter === 'restaurant' ? 'active' : ''}`}
              onClick={() => setActiveFilter('restaurant')}
            >
              🍽️ Restaurant
            </button>
          </nav>
        </section>

        {/* Food Cards Grid (Landing page shows food cards, NOT a map) */}
        <section aria-label="Food Options List">
          {filteredFoods.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--slate-400)', background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)' }}>
              No food options match the selected filter.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: 'var(--space-5)'
              }}
            >
              {filteredFoods.map(item => (
                <div
                  key={item.id}
                  className="food-card"
                  onClick={() => navigate(`/food/${item.id}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/food/${item.id}`); }}
                >
                  <div className="food-card-img-wrapper">
                    <img src={item.image} alt={item.name} className="food-card-img" />
                    <div style={{ position: 'absolute', top: 'var(--space-2)', left: 'var(--space-2)' }}>
                      <span className={`badge ${item.veg ? 'badge-success' : 'badge-primary'}`}>
                        {item.veg ? '🌱 Veg' : '🍗 Non-Veg'}
                      </span>
                    </div>
                  </div>

                  <div className="food-card-body">
                    {/* Business Name */}
                    <h2 className="food-card-name">
                      {item.name}
                    </h2>

                    {/* Meal Type */}
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)', fontWeight: 600 }}>
                      {item.type}
                    </div>

                    <div className="food-card-meta-row" style={{ marginTop: 'auto', paddingTop: 'var(--space-3)' }}>
                      {/* "Meal starts from ₹..." pricing style */}
                      <span
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: 'var(--primary-700)',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {item.startPrice}
                      </span>

                      {/* Distance */}
                      <span className="food-card-distance" style={{ fontWeight: 600 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                        </svg>
                        <span>{item.distance}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn-food-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/food/${item.id}`);
                      }}
                    >
                      <span>View Details</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      </div>
    </main>
  );
}
