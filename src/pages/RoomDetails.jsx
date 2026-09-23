import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import L from 'leaflet';
import { useRelocation } from '../context/RelocationContext';
import { roomsData, campusCoordinates } from '../data/mockData';
import { maskPhoneNumber } from '../utils/phoneUtils';

export default function RoomDetails() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { college, showToast } = useRelocation();

  const room = roomsData.find(r => r.id === roomId) || roomsData[0];
  const [activeImage, setActiveImage] = useState(room.image);
  const [isSaved, setIsSaved] = useState(false);

  const mapRef = useRef(null);
  const leafletInstance = useRef(null);

  useEffect(() => {
    setActiveImage(room.image);
  }, [room]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletInstance.current) {
      leafletInstance.current.remove();
      leafletInstance.current = null;
    }

    const baseCoords = campusCoordinates[college] || { lat: 37.8719, lng: -122.2585 };
    const roomCoords = {
      lat: baseCoords.lat + (room.offset ? room.offset.lat : -0.003),
      lng: baseCoords.lng + (room.offset ? room.offset.lng : 0.002)
    };

    const map = L.map(mapRef.current, {
      center: [baseCoords.lat, baseCoords.lng],
      zoom: 15,
      zoomControl: true,
      attributionControl: true
    });

    leafletInstance.current = map;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    // College anchor pin
    const collegeIcon = L.divIcon({
      className: 'custom-college-icon',
      html: `
        <div style="background: #2563eb; color: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 3px solid #fff; box-shadow: 0 4px 12px rgba(37,99,235,0.4);">
          🎓
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    L.marker([baseCoords.lat, baseCoords.lng], { icon: collegeIcon })
      .addTo(map)
      .bindPopup(`<b>${college}</b><br><span style="font-size:12px;color:#64748b;">Campus Anchor</span>`);

    // Room pin
    const roomIcon = L.divIcon({
      className: 'custom-room-icon',
      html: `
        <div style="background: #10b981; color: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 3px solid #fff; box-shadow: 0 4px 12px rgba(16,185,129,0.4);">
          🏠
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    L.marker([roomCoords.lat, roomCoords.lng], { icon: roomIcon })
      .addTo(map)
      .bindPopup(`<b>${room.name}</b><br><span style="font-size:12px;color:#64748b;">${room.distance} to Campus</span>`)
      .openPopup();

    // Walking route polyline
    const latlngs = [
      [baseCoords.lat, baseCoords.lng],
      [roomCoords.lat, roomCoords.lng]
    ];
    L.polyline(latlngs, {
      color: '#2563eb',
      weight: 3,
      dashArray: '6, 8',
      opacity: 0.8
    }).addTo(map);

    const bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [college, room]);

  const handleInterested = () => {
    showToast('Inquiry Sent', `Landlord contacted for ${room.name}.`, 'success');
  };

  const handleToggleSave = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    showToast(
      nextSaved ? 'Room Saved' : 'Room Removed',
      nextSaved ? `${room.name} saved to your list.` : 'Removed from saved items.',
      nextSaved ? 'success' : 'primary'
    );
  };

  return (
    <main className="main-content">
      <div className="room-page-shell">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/rooms')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Rooms</span>
          </button>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)' }}>
            Verified Student Stay
          </div>
        </div>

        <div className="room-detail-card">
          {/* 1. Large Photo Gallery Visual */}
          <section className="gallery-container" aria-label="Room Photo Gallery">
            <div className="gallery-main-view">
              <div className="gallery-badge-overlay">
                <span className="badge badge-success">
                  <span className="badge-dot"></span> Campus Verified
                </span>
                {room.bestMatch && <span className="badge badge-primary">★ Best Match</span>}
              </div>
              <img src={activeImage} alt={room.name} className="gallery-main-img" />
            </div>

            {/* Thumbnail Switcher Strip */}
            <div className="gallery-thumbs-row">
              <div
                className={`gallery-thumb ${activeImage === room.image ? 'active' : ''}`}
                onClick={() => setActiveImage(room.image)}
                title="Primary View"
              >
                <img src={room.image} alt="Dorm primary" />
              </div>
              <div
                className={`gallery-thumb ${activeImage === room.secondaryImage ? 'active' : ''}`}
                onClick={() => setActiveImage(room.secondaryImage)}
                title="Secondary View"
              >
                <img src={room.secondaryImage} alt="Dorm secondary" />
              </div>
            </div>
          </section>

          {/* 2. Essential Information (Name, ₹Price, Distance, Room Type) */}
          <section className="room-header-row">
            <div className="room-meta-group">
              <h1 className="room-title">{room.name}</h1>
              <div className="room-sub-meta">
                <span className="meta-pill" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  {room.type} Room
                </span>
                <span>•</span>
                <span className="meta-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                  {room.distance} from {college}
                </span>
              </div>
            </div>

            {/* Price Display */}
            <div className="room-price-box">
              <div className="room-price">
                {room.priceINR}
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--slate-400)' }}>/mo</span>
              </div>
              <div className="room-price-sub">{room.priceUSD} • All bills included</div>
            </div>
          </section>

          {/* 3. Compact Visual Tags for Facilities */}
          <section className="facilities-section">
            <div className="facilities-label">Included Facilities</div>
            <div className="facilities-grid">
              <span className="facility-pill"><span>📶</span> Wi-Fi</span>
              <span className="facility-pill"><span>🍱</span> Food</span>
              <span className="facility-pill"><span>❄️</span> AC</span>
              <span className="facility-pill"><span>🧺</span> Laundry</span>
              <span className="facility-pill"><span>🅿️</span> Parking</span>
            </div>
          </section>

          {/* 4. Location On Map */}
          <section className="map-context-section">
            <div className="facilities-label">Campus Proximity Map</div>
            <div className="room-map-box">
              <div className="map-distance-banner">
                <span className="status-pulse"></span>
                <span>{room.distance} • {room.walkTime} to {college}</span>
              </div>
              <div ref={mapRef} style={{ width: '100%', height: '260px' }} role="region" aria-label="Room Map"></div>
            </div>
          </section>

          {/* 5. Owner Details & Direct Contact */}
          {room.owner && (
            <section className="room-owner-section">
              <div className="room-owner-section-header">
                <div className="room-owner-header-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Property Owner & Landlord Details</span>
                </div>
                <div className="badge badge-success" style={{ fontSize: '11px' }}>
                  <span className="badge-dot"></span> ID Verified Landlord
                </div>
              </div>

              <div className="room-owner-profile">
                <div className="room-owner-avatar-lg">
                  {room.owner.name.charAt(0)}
                </div>

                <div className="room-owner-bio">
                  <div className="room-owner-name-row">
                    <h2 className="room-owner-full-name">{room.owner.name}</h2>
                    <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 8px' }}>Direct Owner</span>
                  </div>
                  <span className="room-owner-role-desc">{room.owner.role} • Zero Brokerage</span>
                  <div className="room-owner-response-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>Typically responds {room.owner.responseRate.toLowerCase()}</span>
                  </div>
                </div>
              </div>

              {/* Direct Owner Action Buttons */}
              <div className="room-owner-contact-actions">
                <a
                  href={`tel:${maskPhoneNumber(room.owner.phone)}`}
                  className="btn-owner-call"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Call {maskPhoneNumber(room.owner.phone)}</span>
                </a>

                <a
                  href={`https://wa.me/${room.owner.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(room.owner.name)},%20I%20am%20interested%20in%20${encodeURIComponent(room.name)}%20near%20${encodeURIComponent(college)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-owner-whatsapp"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </section>
          )}

          {/* 6. Primary Action Buttons */}
          <section className="room-actions-bar">
            <button className="btn-interested" onClick={handleInterested}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="m22 2-7 20-4-9-9-4Z"></path>
                <path d="M22 2 11 13"></path>
              </svg>
              <span>Interested</span>
            </button>

            <button
              className={`btn-save-toggle ${isSaved ? 'saved' : ''}`}
              onClick={handleToggleSave}
              aria-label="Save this room"
              style={isSaved ? { borderColor: 'var(--primary-600)', color: 'var(--primary-600)', background: 'var(--primary-50)' } : {}}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
