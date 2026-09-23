import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRelocation } from '../context/RelocationContext';
import { nearbyCategories, nearbyServicesData } from '../data/mockData';

export default function NearbyList() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { college } = useRelocation();

  const currentCategory = nearbyCategories.find(c => c.id === category) || {
    id: category || 'services',
    label: (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Services'),
    icon: '📍'
  };

  const services = nearbyServicesData[category] || [];

  return (
    <main className="main-content">
      <div className="nearby-list-shell">
        
        {/* Top Navigation Row: Back to /nearby + View on Map button */}
        <div className="nearby-top-nav-row">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/nearby')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Categories</span>
          </button>

          {/* Optional Map Trigger */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/nearby/${category}/map`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
            <span>View on Map</span>
          </button>
        </div>

        {/* Header Section */}
        <section className="nearby-header-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '1.75rem' }}>{currentCategory.icon}</span>
            <h1 className="nearby-title" style={{ margin: 0 }}>
              {currentCategory.label}
            </h1>
          </div>
          <p className="nearby-subtitle" style={{ marginTop: 'var(--space-1)' }}>
            Near {college}
          </p>
        </section>

        {/* Minimal Service Cards List */}
        <section className="nearby-services-column" aria-label={`${currentCategory.label} List`}>
          {services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--slate-400)', background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)' }}>
              No services found for this category.
            </div>
          ) : (
            services.map(item => (
              <div
                key={item.id}
                className="nearby-service-row-card"
                onClick={() => navigate(`/nearby/${category}/map`)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/nearby/${category}/map`); }}
              >
                <div className="nearby-service-info">
                  <div className="nearby-service-name">{item.name}</div>
                  <div className="nearby-service-meta">
                    <span className="nearby-service-dist">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                      </svg>
                      <span>{item.dist} to {college}</span>
                    </span>
                    <span>•</span>
                    <span className={`service-status-pill ${item.status.toLowerCase().includes('open') || item.status.toLowerCase().includes('active') ? 'status-open' : 'status-closed'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/nearby/${category}/map`);
                  }}
                  style={{ flexShrink: 0 }}
                >
                  <span>View</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </section>

      </div>
    </main>
  );
}
