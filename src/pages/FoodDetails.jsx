import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { useRelocation } from '../context/RelocationContext';
import { foodData, campusCoordinates } from '../data/mockData';
import { maskPhoneNumber } from '../utils/phoneUtils';

export default function FoodDetails() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const { college } = useRelocation();
  const [showMap, setShowMap] = useState(false);

  const mapRef = useRef(null);
  const leafletInstance = useRef(null);

  const food = foodData.find(f => f.id === foodId) || foodData[0];

  useEffect(() => {
    if (!showMap || !mapRef.current) return;

    if (leafletInstance.current) {
      leafletInstance.current.remove();
      leafletInstance.current = null;
    }

    const baseCoords = campusCoordinates[college] || { lat: 37.8719, lng: -122.2585 };
    const foodCoords = [
      baseCoords.lat + (food.offset ? food.offset.lat : 0.0015),
      baseCoords.lng + (food.offset ? food.offset.lng : 0.0015)
    ];

    const map = L.map(mapRef.current, {
      center: [(baseCoords.lat + foodCoords[0]) / 2, (baseCoords.lng + foodCoords[1]) / 2],
      zoom: 16,
      zoomControl: true,
      attributionControl: false
    });

    leafletInstance.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // College Pin
    const collegeIcon = L.divIcon({
      className: 'custom-college-icon',
      html: `
        <div style="background: #2563eb; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; border: 3px solid #fff; box-shadow: 0 4px 12px rgba(37,99,235,0.4);">
          🎓
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    L.marker([baseCoords.lat, baseCoords.lng], { icon: collegeIcon })
      .addTo(map)
      .bindPopup(`<b>${college}</b><br><span style="font-size:12px;color:#64748b;">Campus Anchor</span>`);

    // Food Business Pin
    const foodIcon = L.divIcon({
      className: 'custom-food-icon',
      html: `
        <div style="background: #ea580c; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 3px solid #fff; box-shadow: 0 4px 12px rgba(234,88,12,0.4);">
          🍱
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const foodMarker = L.marker(foodCoords, { icon: foodIcon }).addTo(map);
    foodMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 13px;">
        <strong>${food.name}</strong><br>
        <span style="color: #ea580c; font-weight: 700;">${food.startPrice}</span> • ${food.distance}
      </div>
    `).openPopup();

    // Line connecting campus to food business
    L.polyline([[baseCoords.lat, baseCoords.lng], foodCoords], {
      color: '#ea580c',
      dashArray: '5, 8',
      weight: 3,
      opacity: 0.8
    }).addTo(map);

    // Fit bounds so both markers are visible with padding
    const bounds = L.latLngBounds([[baseCoords.lat, baseCoords.lng], foodCoords]);
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [showMap, food, college]);

  return (
    <main className="main-content">
      <div style={{ maxWidth: '620px', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
        {/* Back to /food */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/food')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Food Services</span>
          </button>
        </div>

        {/* Minimal Food Details Card */}
        <div
          style={{
            background: 'var(--color-white)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--slate-200)',
            borderRadius: 'var(--radius-2xl)',
            overflow: 'hidden'
          }}
        >
          {/* Visual Header Image */}
          <div style={{ position: 'relative', width: '100%', height: '220px', background: 'var(--slate-100)' }}>
            <img
              src={food.image}
              alt={food.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)' }}>
              <span className={`badge ${food.veg ? 'badge-success' : 'badge-primary'}`}>
                {food.veg ? '🌱 Veg' : '🍗 Non-Veg'}
              </span>
            </div>
            <div style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)' }}>
              <span className="badge badge-secondary" style={{ background: 'rgba(15, 23, 42, 0.75)', color: '#fff', border: 'none' }}>
                {food.type}
              </span>
            </div>
          </div>

          <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Business Name */}
            <div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 var(--space-1)', color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
                {food.name}
              </h1>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)', fontWeight: 600 }}>
                {food.type} • Near {college}
              </div>
            </div>

            {/* Meal Information */}
            <div
              style={{
                background: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3-5) var(--space-4)'
              }}
            >
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slate-400)', fontWeight: 700, marginBottom: '4px' }}>
                Meal Information
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--slate-700)', lineHeight: 1.5, fontWeight: 500 }}>
                {food.mealInfo}
              </div>
            </div>

            {/* Key Information Grid: Starting Price, Distance, Location, Contact */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'var(--space-3)'
              }}
            >
              {/* Starting Price */}
              <div
                style={{
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-100)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3-5) var(--space-4)'
                }}
              >
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary-600)', fontWeight: 700, marginBottom: '2px' }}>
                  Starting Price
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                  {food.startPrice}
                </div>
              </div>

              {/* Distance */}
              <div
                style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3-5) var(--space-4)'
                }}
              >
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slate-400)', fontWeight: 700, marginBottom: '2px' }}>
                  Distance
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                  {food.distance}
                </div>
              </div>

              {/* Location */}
              <div
                style={{
                  gridColumn: 'span 2',
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3-5) var(--space-4)'
                }}
              >
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slate-400)', fontWeight: 700, marginBottom: '2px' }}>
                  Location
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--slate-800)' }}>
                  {food.location}
                </div>
              </div>

              {/* Business Contact Number */}
              <div
                style={{
                  gridColumn: 'span 2',
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3-5) var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slate-400)', fontWeight: 700, marginBottom: '2px' }}>
                    Business Contact
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {maskPhoneNumber(food.contact)}
                  </div>
                </div>
                <a
                  href={`tel:${maskPhoneNumber(food.contact).replace(/\s+/g, '')}`}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>Call</span>
                </a>
              </div>
            </div>

            {/* Action: View on Map */}
            <div>
              <button
                type="button"
                className={`btn ${showMap ? 'btn-secondary' : 'btn-primary'} btn-md`}
                style={{ width: '100%', justifyContent: 'center', gap: '8px', fontWeight: 700 }}
                onClick={() => setShowMap(!showMap)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
                <span>{showMap ? 'Hide Map' : 'View on Map'}</span>
              </button>
            </div>

            {/* Inline Map View (Triggered by View on Map) */}
            {showMap && (
              <div
                style={{
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  marginTop: 'var(--space-1)'
                }}
              >
                <div
                  style={{
                    padding: 'var(--space-2-5) var(--space-3)',
                    background: 'var(--slate-100)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--slate-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>🎓 {college} ➔ 🍱 {food.name}</span>
                  <span style={{ fontWeight: 700 }}>{food.distance}</span>
                </div>
                <div style={{ height: '300px', width: '100%' }}>
                  <div ref={mapRef} style={{ width: '100%', height: '100%' }} role="region" aria-label="Food Vendor Location Map"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
