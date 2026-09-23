import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { campusCoordinates } from '../data/mockData';

/**
 * Reusable Pluto Interactive Map Component
 * Powered by Leaflet + OpenStreetMap
 *
 * Props:
 * - college: string (active campus name)
 * - items: array of items to display (rooms, food, or nearby services)
 * - type: 'rooms' | 'food' | 'nearby' | 'mixed'
 * - height: string (default: '380px')
 */
export default function PlutoMap({ college, items = [], type = 'rooms', height = '380px' }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const navigate = useNavigate();

  // Determine base coordinates for the selected college
  const baseCoords = (college && campusCoordinates[college])
    ? campusCoordinates[college]
    : campusCoordinates['IIT Bombay'] || { lat: 19.1334, lng: 72.9133 };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous instance
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [baseCoords.lat, baseCoords.lng],
      zoom: 15,
      zoomControl: true,
      attributionControl: true
    });

    leafletMapRef.current = map;

    // Real OpenStreetMap Tile Layer with mandatory attribution
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    const allCoords = [[baseCoords.lat, baseCoords.lng]];

    // 1. Central Campus Anchor Marker
    const collegeIcon = L.divIcon({
      className: 'custom-college-marker',
      html: `
        <div style="
          background: #4f46e5;
          color: #ffffff;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.45);
          cursor: pointer;
        ">
          🎓
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const collegeMarker = L.marker([baseCoords.lat, baseCoords.lng], { icon: collegeIcon }).addTo(map);
    collegeMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 13px; line-height: 1.4; padding: 2px;">
        <strong style="color: #4f46e5; font-size: 14px;">🎓 ${college || 'Campus Reference'}</strong>
        <div style="color: #64748b; font-size: 11px; margin-top: 2px;">Central University Anchor</div>
      </div>
    `);

    // 2. Plot Items with distinct icons & interactive popups
    items.forEach((item) => {
      const latOffset = item.offset?.lat || 0.001;
      const lngOffset = item.offset?.lng || 0.001;
      const markerLat = baseCoords.lat + latOffset;
      const markerLng = baseCoords.lng + lngOffset;

      allCoords.push([markerLat, markerLng]);

      let pinHtml = '';
      let popupContent = '';

      if (type === 'rooms' || item.numericPrice) {
        // ROOMS MARKER (Indigo)
        pinHtml = `
          <div style="
            background: #4f46e5;
            color: #ffffff;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            border: 2.5px solid #ffffff;
            box-shadow: 0 3px 10px rgba(79, 70, 229, 0.35);
            cursor: pointer;
          ">
            🏠
          </div>
        `;

        popupContent = `
          <div style="font-family: inherit; font-size: 13px; min-width: 170px; line-height: 1.4;">
            <strong style="color: #0f172a; font-size: 14px;">${item.name}</strong>
            <div style="display: flex; align-items: center; justify-content: space-between; margin: 4px 0 6px;">
              <span style="color: #4f46e5; font-weight: 700; font-size: 13px;">${item.priceINR || `₹${item.numericPrice}/mo`}</span>
              <span style="color: #64748b; font-size: 11px;">${item.distance || item.walkTime || ''}</span>
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
              ${item.type ? `<span style="background: #eef2ff; color: #4338ca; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${item.type}</span>` : ''}
              ${item.billsIncluded ? '<span style="color: #059669; margin-left: 4px;">• Bills Included</span>' : ''}
            </div>
            <button
              id="map-btn-${item.id}"
              style="
                width: 100%;
                background: #4f46e5;
                color: #ffffff;
                border: none;
                border-radius: 6px;
                padding: 5px 8px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                text-align: center;
              "
            >
              View Room Details →
            </button>
          </div>
        `;
      } else if (type === 'food' || item.mealType || item.startPrice) {
        // FOOD MARKER (Orange)
        pinHtml = `
          <div style="
            background: #ea580c;
            color: #ffffff;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            border: 2.5px solid #ffffff;
            box-shadow: 0 3px 10px rgba(234, 88, 12, 0.35);
            cursor: pointer;
          ">
            🍱
          </div>
        `;

        popupContent = `
          <div style="font-family: inherit; font-size: 13px; min-width: 170px; line-height: 1.4;">
            <strong style="color: #0f172a; font-size: 14px;">${item.name}</strong>
            <div style="display: flex; align-items: center; justify-content: space-between; margin: 4px 0 6px;">
              <span style="color: #ea580c; font-weight: 700; font-size: 13px;">${item.startPrice || ''}</span>
              <span style="color: #64748b; font-size: 11px;">${item.distance || ''}</span>
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
              <span style="background: ${item.veg ? '#ecfdf5' : '#fef2f2'}; color: ${item.veg ? '#047857' : '#b91c1c'}; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                ${item.veg ? 'Pure Veg' : 'Veg / Non-Veg'}
              </span>
              ${item.type ? `<span style="margin-left: 4px; color: #64748b;">• ${item.type}</span>` : ''}
            </div>
            <button
              id="map-btn-${item.id}"
              style="
                width: 100%;
                background: #ea580c;
                color: #ffffff;
                border: none;
                border-radius: 6px;
                padding: 5px 8px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                text-align: center;
              "
            >
              View Food Details →
            </button>
          </div>
        `;
      } else {
        // NEARBY SERVICE MARKER (Category Colored)
        const categoryColors = {
          food: '#ea580c',
          grocery: '#059669',
          pharmacy: '#e11d48',
          stationery: '#4f46e5',
          atm: '#0284c7',
          laundry: '#7c3aed',
          transport: '#0d9488'
        };
        const catColor = categoryColors[item.category] || '#2563eb';
        const icon = item.icon || '📍';

        pinHtml = `
          <div style="
            background: ${catColor};
            color: #ffffff;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            border: 2px solid #ffffff;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
            cursor: pointer;
          ">
            ${icon}
          </div>
        `;

        popupContent = `
          <div style="font-family: inherit; font-size: 13px; min-width: 160px; line-height: 1.4;">
            <strong style="color: #0f172a; font-size: 13px;">${item.name}</strong>
            <div style="display: flex; align-items: center; justify-content: space-between; margin: 4px 0 2px;">
              <span style="color: #4f46e5; font-weight: 700; font-size: 12px;">${item.dist || item.distance || ''}</span>
              <span style="color: ${String(item.status || '').toLowerCase().includes('open') ? '#059669' : '#64748b'}; font-weight: 600; font-size: 11px;">
                ${item.status || 'Active'}
              </span>
            </div>
            ${item.address ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">${item.address}</div>` : ''}
          </div>
        `;
      }

      const itemIcon = L.divIcon({
        className: `custom-${type}-pin`,
        html: pinHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([markerLat, markerLng], { icon: itemIcon }).addTo(map);
      marker.bindPopup(popupContent);

      // Attach click navigation on popup open
      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-btn-${item.id}`);
        if (btn) {
          btn.onclick = () => {
            if (type === 'rooms' || item.numericPrice) {
              navigate(`/rooms/${item.id}`);
            } else if (type === 'food' || item.mealType) {
              navigate(`/food/${item.id}`);
            }
          };
        }
      });
    });

    // Auto-fit bounds if multiple markers exist
    if (allCoords.length > 1) {
      map.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50], maxZoom: 16 });
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [college, items, type, baseCoords.lat, baseCoords.lng, navigate]);

  return (
    <div
      style={{
        width: '100%',
        height,
        position: 'relative',
        borderRadius: 'inherit',
        overflow: 'hidden'
      }}
    >
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        role="region"
        aria-label={`Interactive Leaflet Map for ${college}`}
      />
    </div>
  );
}
