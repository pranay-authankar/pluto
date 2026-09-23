import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRelocation } from '../context/RelocationContext';
import { nearbyCategories, nearbyServicesData } from '../data/mockData';
import { maskPhoneNumber } from '../utils/phoneUtils';
import PlutoMap from '../components/PlutoMap';

export default function Nearby() {
  const { category: routeCategory } = useParams();
  const navigate = useNavigate();
  const { college } = useRelocation();

  // Selected category (default to URL param or 'food')
  const [activeCategory, setActiveCategory] = useState(routeCategory || 'food');
  const [selectedVendor, setSelectedVendor] = useState(null); // For "View Details" modal
  const [isMapView, setIsMapView] = useState(false); // Only toggled by the single View Map button

  // Sync route param with state if user directly loaded a category route
  useEffect(() => {
    if (routeCategory && nearbyServicesData[routeCategory]) {
      setActiveCategory(routeCategory);
    }
  }, [routeCategory]);

  const currentCatObj = nearbyCategories.find(c => c.id === activeCategory) || nearbyCategories[0];
  const vendorList = nearbyServicesData[activeCategory] || [];

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    navigate(`/nearby/${catId}`, { replace: true });
  };

  return (
    <main className="main-content">
      <div className="nearby-landing-shell">

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
          <div className="badge badge-secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
            🎓 {college}
          </div>
        </div>

        {/* Page Header */}
        <section className="nearby-header-section" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
          <div>
            <h1 className="nearby-title">Nearby Services</h1>
            <p className="nearby-subtitle">Verified student services near {college}</p>
          </div>
        </section>

        {/* 
            CATEGORIES SECTION + THE ONLY "VIEW MAP" BUTTON ON THE WHOLE PAGE
            Placed together along with the categories cards area
        */}
        <section style={{ marginBottom: 'var(--space-6)' }} aria-label="Categories and Map Controls">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-500)' }}>
              Categories
            </div>

            {/* ONLY ONE VIEW MAP BUTTON IN THE WHOLE PAGE */}
            <button
              type="button"
              className={`btn ${isMapView ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setIsMapView(!isMapView)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 0.95rem'
              }}
              aria-label={isMapView ? 'Switch to List View' : 'View on Map'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
              <span>{isMapView ? 'Close Map' : 'View Map'}</span>
            </button>
          </div>

          {/* List of Category Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(125px, 1fr))',
              gap: 'var(--space-2-5)'
            }}
            role="tablist"
            aria-label="Category Selection"
          >
            {nearbyCategories.map(cat => {
              const isSelected = activeCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  tabIndex={0}
                  role="tab"
                  aria-selected={isSelected}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCategorySelect(cat.id); }}
                  style={{
                    background: isSelected ? 'var(--primary-50)' : 'var(--color-white)',
                    borderColor: isSelected ? 'var(--primary-600)' : 'var(--slate-200)',
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-3) var(--space-2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? '0 0 0 2px var(--primary-glow)' : 'var(--shadow-xs)',
                    userSelect: 'none'
                  }}
                >
                  <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{cat.icon}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: isSelected ? 'var(--primary-700)' : 'var(--slate-800)' }}>
                    {cat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 
            OPTIONAL MAP CONTAINER (Appears only when single View Map button is clicked)
        */}
        {isMapView && (
          <section style={{ marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', border: '1.5px solid var(--slate-200)', boxShadow: 'var(--shadow-md)' }} aria-label="Interactive Map View">
            <div style={{ background: 'var(--color-white)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--slate-800)' }}>
                <span>{currentCatObj.icon}</span>
                <span>{currentCatObj.label} Map</span>
                <span style={{ color: 'var(--slate-400)' }}>•</span>
                <span style={{ color: 'var(--primary-700)' }}>🎓 {college} Center</span>
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)' }}>
                {vendorList.length} spots plotted
              </span>
            </div>
            <PlutoMap
              college={college}
              items={vendorList.map(v => ({
                ...v,
                category: activeCategory,
                icon: currentCatObj.icon
              }))}
              type="nearby"
              height="360px"
            />
          </section>
        )}

        {/* 
            LIST OF 7-8 VENDORS / SERVICES FOR THE SELECTED CATEGORY
            NO inbuilt view map buttons here! Only "View Details" button.
        */}
        <section aria-label={`${currentCatObj.label} Vendors`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{currentCatObj.icon}</span>
              <span>{currentCatObj.label} ({vendorList.length} nearby)</span>
            </div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)' }}>
              Nearest to {college}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2-5)' }}>
            {vendorList.map(vendor => (
              <div
                key={vendor.id}
                className="nearby-service-row-card"
                style={{
                  background: 'var(--color-white)',
                  border: '1.5px solid var(--slate-200)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4) var(--space-5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                {/* Vendor Info: Name, Distance, Open/Closed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {vendor.name}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-700)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                      </svg>
                      <span>{vendor.dist} to {college}</span>
                    </span>
                    <span>•</span>
                    <span className="service-status-pill status-open">
                      {vendor.status}
                    </span>
                    <span>•</span>
                    <span>{vendor.address}</span>
                  </div>
                </div>

                {/* ONLY "VIEW DETAILS" BUTTON (No in-built map button!) */}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedVendor(vendor)}
                  style={{
                    flexShrink: 0,
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.45rem 0.9rem',
                    fontWeight: 600
                  }}
                  aria-label={`View details for ${vendor.name}`}
                >
                  <span>View Details</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* 
          VIEW DETAILS MODAL
          Shows few essential details about the service/vendor/business
      */}
      {selectedVendor && (
        <div
          className="vendor-modal-backdrop"
          onClick={() => setSelectedVendor(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalVendorTitle"
        >
          <div className="vendor-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="vendor-modal-header">
              <div>
                <span className="badge badge-primary" style={{ marginBottom: 'var(--space-1-5)' }}>
                  {currentCatObj.icon} {currentCatObj.label}
                </span>
                <h2 id="modalVendorTitle" className="vendor-modal-title">
                  {selectedVendor.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVendor(null)}
                style={{
                  background: 'var(--slate-100)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--slate-600)'
                }}
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            {/* Vendor Details Grid */}
            <div className="vendor-modal-details-grid">
              <div className="vendor-detail-item">
                <span className="vendor-detail-label">Distance to Campus</span>
                <span className="vendor-detail-value" style={{ color: 'var(--primary-700)' }}>
                  {selectedVendor.dist} to {college}
                </span>
              </div>

              <div className="vendor-detail-item">
                <span className="vendor-detail-label">Hours / Status</span>
                <span className="vendor-detail-value">
                  {selectedVendor.hours}
                </span>
              </div>

              <div className="vendor-detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="vendor-detail-label">Location / Address</span>
                <span className="vendor-detail-value">
                  📍 {selectedVendor.address}
                </span>
              </div>

              <div className="vendor-detail-item">
                <span className="vendor-detail-label">Contact Phone</span>
                <span className="vendor-detail-value">
                  {maskPhoneNumber(selectedVendor.contact)}
                </span>
              </div>

              <div className="vendor-detail-item">
                <span className="vendor-detail-label">Status</span>
                <span className="vendor-detail-value" style={{ color: '#16a34a' }}>
                  ✓ {selectedVendor.status}
                </span>
              </div>

              <div className="vendor-detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="vendor-detail-label">Student Highlights</span>
                <span className="vendor-detail-value" style={{ fontWeight: 500, color: 'var(--slate-600)', fontSize: 'var(--font-size-xs)' }}>
                  {selectedVendor.highlights}
                </span>
              </div>
            </div>

            {/* Modal Close Action */}
            <button
              type="button"
              className="btn btn-primary btn-md"
              onClick={() => setSelectedVendor(null)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Done
            </button>

          </div>
        </div>
      )}

    </main>
  );
}
