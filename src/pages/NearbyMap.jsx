import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRelocation } from '../context/RelocationContext';
import { nearbyCategories, nearbyServicesData } from '../data/mockData';
import PlutoMap from '../components/PlutoMap';

export default function NearbyMap() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { college } = useRelocation();

  const currentCategory = nearbyCategories.find(c => c.id === category) || {
    id: category || 'services',
    label: (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Services'),
    icon: '📍'
  };

  const services = (nearbyServicesData[category] || []).map(s => ({
    ...s,
    category,
    icon: currentCategory.icon
  }));

  return (
    <main className="nearby-map-view-shell" style={{ position: 'relative', width: '100%', height: 'calc(100vh - 65px)' }}>
      {/* Floating Top Control Bar with Back Button to /nearby/:category */}
      <div className="nearby-map-top-bar" style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 1000, display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/nearby/${category}`)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--slate-200)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>{currentCategory.label} List</span>
        </button>

        {/* Category & College Pill */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--slate-200)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 700,
            color: 'var(--slate-800)'
          }}
        >
          <span>{currentCategory.icon}</span>
          <span>{currentCategory.label}</span>
          <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>•</span>
          <span style={{ color: 'var(--primary-700)' }}>🎓 {college}</span>
        </div>
      </div>

      {/* Main Full-Viewport Leaflet + OpenStreetMap */}
      <PlutoMap
        college={college}
        items={services}
        type="nearby"
        height="100%"
      />
    </main>
  );
}
