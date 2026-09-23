import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { useRelocation } from '../context/RelocationContext';
import { nearbyCategories, nearbyServicesData, campusCoordinates } from '../data/mockData';

export default function NearbyMap() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { college } = useRelocation();

  const mapRef = useRef(null);
  const leafletInstance = useRef(null);

  const currentCategory = nearbyCategories.find(c => c.id === category) || {
    id: category || 'services',
    label: (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Services'),
    icon: '📍'
  };

  const services = nearbyServicesData[category] || [];
  const coords = campusCoordinates[college] || campusCoordinates['UC Berkeley'] || { lat: 37.8719, lng: -122.2585 };

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletInstance.current) {
      leafletInstance.current.remove();
      leafletInstance.current = null;
    }

    const map = L.map(mapRef.current, {
      center: [coords.lat, coords.lng],
      zoom: 15,
      zoomControl: true,
      attributionControl: false
    });

    leafletInstance.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // 1. College Anchor Marker
    const collegeIcon = L.divIcon({
      className: 'custom-college-icon',
      html: `
        <div style="background: #2563eb; color: #fff; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 3px solid #fff; box-shadow: 0 4px 14px rgba(37,99,235,0.4);">
          🎓
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    L.marker([coords.lat, coords.lng], { icon: collegeIcon })
      .addTo(map)
      .bindPopup(`<strong>🎓 ${college}</strong><br><span style="font-size: 12px; color: #64748b;">Central Reference Point</span>`);

    // 2. Nearby Service Markers for Selected Category
    const categoryColors = {
      food: '#ea580c',
      grocery: '#059669',
      pharmacy: '#e11d48',
      stationery: '#4f46e5',
      atm: '#0284c7',
      laundry: '#7c3aed',
      transport: '#0d9488'
    };
    const catColor = categoryColors[category] || '#2563eb';

    const allMarkerCoords = [[coords.lat, coords.lng]];

    services.forEach(item => {
      const markerLat = coords.lat + (item.offset ? item.offset.lat : 0.001);
      const markerLng = coords.lng + (item.offset ? item.offset.lng : 0.001);
      allMarkerCoords.push([markerLat, markerLng]);

      const itemIcon = L.divIcon({
        className: 'custom-service-pin',
        html: `
          <div style="background: ${catColor}; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; border: 2.5px solid #fff; box-shadow: 0 3px 10px rgba(0,0,0,0.25); cursor: pointer;">
            ${currentCategory.icon}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([markerLat, markerLng], { icon: itemIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; min-width: 160px;">
          <strong style="color: #0f172a;">${item.name}</strong><br>
          <div style="margin-top: 4px; display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
            <span style="color: #2563eb; font-weight: 700;">${item.dist}</span>
            <span style="color: ${item.status.toLowerCase().includes('open') || item.status.toLowerCase().includes('active') ? '#16a34a' : '#64748b'}; font-weight: 600;">
              ${item.status}
            </span>
          </div>
        </div>
      `);
    });

    if (allMarkerCoords.length > 1) {
      map.fitBounds(L.latLngBounds(allMarkerCoords), { padding: [60, 60] });
    }

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [category, college, coords.lat, coords.lng, services]);

  return (
    <main className="nearby-map-view-shell">
      {/* Floating Top Control Bar with Back Button to /nearby/:category */}
      <div className="nearby-map-top-bar">
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

      {/* Main Full-Viewport Leaflet Map */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} role="region" aria-label={`${currentCategory.label} Map View`}></div>
    </main>
  );
}
