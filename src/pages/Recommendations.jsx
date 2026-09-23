import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import L from 'leaflet';
import { useRelocation, getCollegeId } from '../context/RelocationContext';
import {
  roomsData,
  foodData,
  roommatesData,
  nearbyServicesData,
  campusCoordinates
} from '../data/mockData';

export default function Recommendations() {
  const { college, requirements } = useRelocation();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);

  // College Context - auto-kept from Home / Requirements
  const studentCollege = requirements?.college || college || 'IIT Bombay';
  const collegeId = getCollegeId(studentCollege);
  const coords = campusCoordinates[studentCollege] || campusCoordinates['IIT Bombay'] || { lat: 19.1334, lng: 72.9133 };

  // Parse Student Demand Requirements
  const prefs = requirements?.preferences || {};

  // 1. Rent
  const isRentAny = prefs.isRentAny ?? (prefs.maxRent === 'any' || !prefs.maxRent);
  const maxRent = !isRentAny && prefs.maxRent ? Number(prefs.maxRent) : null;

  // 2. Room Type: single | shared | any
  const roomTypePref = (prefs.roomType || prefs.room || 'any').toLowerCase();

  // 3. Food Service: veg | non-veg | none | any
  const foodServicePref = (prefs.foodService || prefs.food || 'any').toLowerCase();

  // 4. Room Partner: male | female | none
  const roomPartnerPref = (prefs.roomPartner || prefs.roommateGender || 'none').toLowerCase();

  // 5. Maximum Distance: 0.5 → 10 km | any
  const isDistAny = prefs.isDistanceAny ?? (prefs.maxDistance === 'any' || !prefs.maxDistance);
  const maxDistance = !isDistAny && prefs.maxDistance ? Number(prefs.maxDistance) : null;

  // Strict Result Inclusion Flags
  // * Food = No Need -> Do NOT show food/meal options
  // * Room Partner = No Need -> Do NOT show room-partner options
  const showRooms = true;
  const showFood = foodServicePref !== 'none';
  const showPartner = roomPartnerPref !== 'none';
  const showNearby = !showFood && !showPartner; // Subtle fallback only when student only wants rooms

  // Assemble contextual recommendation items based strictly on demand
  const recommendations = [];

  // =========================================================================
  // 1. Filter Rooms
  // =========================================================================
  if (showRooms) {
    let candidateRooms = [...roomsData];

    // Room Type Filter
    if (roomTypePref !== 'any') {
      candidateRooms = candidateRooms.filter(
        r => r.type.toLowerCase() === roomTypePref
      );
    }

    // Maximum Rent Filter
    if (!isRentAny && maxRent !== null) {
      candidateRooms = candidateRooms.filter(
        r => r.numericPrice <= maxRent
      );
    }

    // Maximum Distance Filter
    if (!isDistAny && maxDistance !== null) {
      candidateRooms = candidateRooms.filter(
        r => parseFloat(r.distance) <= maxDistance
      );
    }

    // Sort by price ascending (most economical student matches first)
    candidateRooms.sort((a, b) => a.numericPrice - b.numericPrice);

    // If matches exist, display top matches (up to 2 if other categories are hidden, else 1)
    const roomCount = (!showFood && !showPartner) ? 3 : (showFood && showPartner) ? 1 : 2;
    const selectedRooms = candidateRooms.slice(0, roomCount);

    if (selectedRooms.length > 0) {
      selectedRooms.forEach(room => {
        recommendations.push({
          id: room.id,
          category: 'room',
          title: 'Room',
          name: room.name,
          price: room.priceINR,
          distance: `${room.distance} to Campus`,
          type: `${room.type} Room`,
          icon: '🏠',
          path: '/rooms',
          btnText: 'View Rooms',
          offset: room.offset
        });
      });
    } else {
      // Fallback if filters are very restrictive: show closest room with note
      const fallbackRoom = roomsData[0];
      recommendations.push({
        id: fallbackRoom.id,
        category: 'room',
        title: 'Room (Closest Available)',
        name: fallbackRoom.name,
        price: fallbackRoom.priceINR,
        distance: `${fallbackRoom.distance} to Campus`,
        type: `${fallbackRoom.type} Room`,
        icon: '🏠',
        path: '/rooms',
        btnText: 'Explore Rooms',
        offset: fallbackRoom.offset
      });
    }
  }

  // =========================================================================
  // 2. Filter Food
  // =========================================================================
  if (showFood) {
    let candidateFood = [...foodData];

    // Food Selection Filter: Veg vs Non-Veg vs Any
    if (foodServicePref === 'veg') {
      candidateFood = candidateFood.filter(f => f.veg === true);
    } else if (foodServicePref === 'non-veg') {
      candidateFood = candidateFood.filter(f => f.veg === false);
    }

    // Distance Filter
    if (!isDistAny && maxDistance !== null) {
      candidateFood = candidateFood.filter(
        f => parseFloat(f.distance) <= maxDistance
      );
    }

    if (candidateFood.length > 0) {
      // Pick top matching meal option
      const foodItem = candidateFood[0];
      recommendations.push({
        id: foodItem.id,
        category: 'food',
        title: `Food (${foodServicePref === 'veg' ? 'Pure Veg' : foodServicePref === 'non-veg' ? 'Non-Veg' : 'Meal'})`,
        name: foodItem.name,
        price: foodItem.price,
        distance: `${foodItem.distance} to Campus`,
        type: foodItem.type,
        icon: foodItem.veg ? '🥗' : '🍗',
        path: '/food',
        btnText: 'View Food Options',
        offset: foodItem.offset
      });
    }
  }

  // =========================================================================
  // 3. Filter Room Partner
  // =========================================================================
  if (showPartner) {
    let candidatePartners = [...roommatesData];

    // College Filter
    const collegeMatches = candidatePartners.filter(
      p => p.collegeId === collegeId || p.college.toLowerCase() === studentCollege.toLowerCase()
    );
    if (collegeMatches.length > 0) {
      candidatePartners = collegeMatches;
    }

    // Gender Filter: Male vs Female
    if (roomPartnerPref === 'male' || roomPartnerPref === 'female') {
      candidatePartners = candidatePartners.filter(
        p => p.gender === roomPartnerPref
      );
    }

    // Distance Filter
    if (!isDistAny && maxDistance !== null) {
      const distFiltered = candidatePartners.filter(
        p => parseFloat(p.distance) <= maxDistance
      );
      if (distFiltered.length > 0) {
        candidatePartners = distFiltered;
      }
    }

    if (candidatePartners.length > 0) {
      const partnerItem = candidatePartners[0];
      recommendations.push({
        id: partnerItem.id,
        category: 'partner',
        title: `Room Partner (${partnerItem.gender === 'male' ? 'Male' : 'Female'})`,
        name: partnerItem.name,
        price: partnerItem.budgetINR,
        distance: `${partnerItem.distance.replace(' from Campus', '')} to Campus`,
        type: `${partnerItem.college}`,
        icon: partnerItem.gender === 'male' ? '👨' : '👩',
        path: '/roommates',
        btnText: 'Connect Partner',
        offset: { lat: -0.0028, lng: 0.0025 }
      });
    }
  }

  // =========================================================================
  // 4. Nearby (Transit / Area Support)
  // =========================================================================
  if (showNearby) {
    const nearbyItem = nearbyServicesData.transport?.[0] || { name: 'Campus Metro & Shuttle', dist: '0.3 km' };
    recommendations.push({
      id: 'nearby-transport',
      category: 'nearby',
      title: 'Campus Transit',
      name: nearbyItem.name,
      price: '₹20/ride',
      distance: `${nearbyItem.dist} to Campus`,
      type: 'Transit',
      icon: '📍',
      path: '/nearby',
      btnText: 'View Nearby Services',
      offset: { lat: -0.0025, lng: -0.0075 }
    });
  }

  // Initialize and update Leaflet Map
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

    // College campus anchor pin
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
      .bindPopup(`<strong>🎓 ${studentCollege}</strong><br><span style="font-size: 12px; color: #64748b;">Selected College Anchor</span>`);

    // Place recommendation pins
    recommendations.forEach(rec => {
      if (!rec.offset) return;
      const markerCoords = [
        coords.lat + rec.offset.lat,
        coords.lng + rec.offset.lng
      ];

      const pinColors = {
        room: '#10b981',
        food: '#ea580c',
        partner: '#7c3aed',
        nearby: '#0f172a'
      };

      const pinColor = pinColors[rec.category] || '#2563eb';

      const recIcon = L.divIcon({
        className: 'custom-rec-pin',
        html: `
          <div style="background: ${pinColor}; color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2.5px solid #fff; box-shadow: 0 3px 10px rgba(0,0,0,0.25); cursor: pointer;">
            ${rec.icon}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(markerCoords, { icon: recIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px;">
          <strong>${rec.name}</strong><br>
          <span style="color: #2563eb; font-weight: 700;">${rec.price}</span> • <span>${rec.distance}</span>
        </div>
      `);

      marker.on('click', () => {
        navigate(rec.path);
      });
    });

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [studentCollege, coords.lat, coords.lng, recommendations.length]);

  // Construct readable summary badges of active student requirements
  const summaryBadges = [
    isRentAny ? 'Rent: Any' : `Max Rent: ₹${Number(maxRent).toLocaleString()}`,
    roomTypePref === 'any' ? 'Any Room' : `${roomTypePref === 'single' ? 'Single' : 'Shared'} Room`
  ];

  if (showFood) {
    summaryBadges.push(foodServicePref === 'veg' ? 'Veg Food' : foodServicePref === 'non-veg' ? 'Non-Veg Food' : 'All Food');
  } else {
    summaryBadges.push('Food: No Need');
  }

  if (showPartner) {
    summaryBadges.push(`${roomPartnerPref.charAt(0).toUpperCase() + roomPartnerPref.slice(1)} Partner`);
  } else {
    summaryBadges.push('Partner: No Need');
  }

  summaryBadges.push(isDistAny ? 'Radius: Any' : `≤ ${maxDistance} km`);

  return (
    <div className="dashboard-shell">
      {/* Top Command Bar */}
      <div className="command-bar">
        <div className="command-college-info">
          <div className="college-badge-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <div>
            <div className="command-college-name">{studentCollege}</div>
            <div className="command-college-meta">
              {summaryBadges.join(' • ')}
            </div>
          </div>
        </div>

        {/* Section Back Link & Jump links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Link to="/" className="nav-link" style={{ fontSize: 'var(--font-size-xs)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Home</span>
          </Link>
          <Link to="/requirements" className="nav-link" style={{ fontSize: 'var(--font-size-xs)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>Edit Demand</span>
          </Link>
        </div>
      </div>

      {/* Split Command View */}
      <div className="command-canvas">
        {/* Left: Compact Recommendation Cards */}
        <aside className="recs-sidebar" aria-label="Recommendation Matches">
          <div className="recs-header">
            <span className="recs-title">Demand-Matched Results</span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
              <span className="badge-dot"></span> Filtered
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {recommendations.map(rec => (
              <div
                key={rec.id}
                className="rec-card"
                onClick={() => navigate(rec.path)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(rec.path); }}
              >
                <div className="rec-card-top">
                  <div className="rec-badge-group">
                    <span className={`rec-category-tag cat-${rec.category}`}>{rec.icon} {rec.title}</span>
                  </div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)', fontWeight: 600 }}>
                    {rec.type}
                  </span>
                </div>

                <div className="rec-name">{rec.name}</div>

                <div className="rec-card-bottom">
                  <div className="rec-price">{rec.price}</div>
                  <div className="rec-distance">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                    </svg>
                    <span>{rec.distance}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: 'var(--space-2)', width: '100%', justifyContent: 'center' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(rec.path);
                  }}
                >
                  <span>{rec.btnText}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Right: Large Interactive Map */}
        <main className="map-viewport-container">
          <div className="map-status-overlay">
            <div className="map-control-pill">
              <span className="status-pulse"></span>
              <span>Matched to {studentCollege}</span>
            </div>
          </div>
          <div id="recommendationMap" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
        </main>
      </div>
    </div>
  );
}
