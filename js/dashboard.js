/**
 * STUDENT RELOCATION PLATFORM - RECOMMENDATION DASHBOARD CONTROLLER
 * Contextual recommendation matches responding strictly to student demand.
 */

(function () {
  'use strict';

  const campusCoordinates = {
    'IIT Bombay': { lat: 19.1334, lng: 72.9133 },
    'IIT Delhi': { lat: 28.5450, lng: 77.1926 },
    'BITS Pilani': { lat: 28.3639, lng: 75.5873 },
    'IIT Madras': { lat: 12.9915, lng: 80.2337 },
    'Delhi University (DU)': { lat: 28.6892, lng: 77.2106 },
    'VIT Vellore': { lat: 12.9692, lng: 79.1559 },
    'UC Berkeley': { lat: 37.8719, lng: -122.2585 }
  };

  const roomsCatalog = [
    { id: 'room-1', name: 'Telegraph Student Lofts', type: 'Single', priceINR: '₹8,500/mo', numericPrice: 8500, distance: '0.4 km', offset: { lat: -0.0031, lng: 0.0024 } },
    { id: 'room-2', name: 'Northgate Shared Suites', type: 'Shared', priceINR: '₹6,800/mo', numericPrice: 6800, distance: '0.2 km', offset: { lat: 0.0022, lng: -0.0019 } },
    { id: 'room-3', name: 'Southside Campus Studio', type: 'Single', priceINR: '₹9,800/mo', numericPrice: 9800, distance: '0.5 km', offset: { lat: -0.0045, lng: 0.0015 } },
    { id: 'room-4', name: 'Bancroft Student Residence', type: 'Shared', priceINR: '₹6,200/mo', numericPrice: 6200, distance: '0.3 km', offset: { lat: -0.0015, lng: -0.0030 } },
    { id: 'room-5', name: 'University Crescent Flat', type: 'Shared', priceINR: '₹5,500/mo', numericPrice: 5500, distance: '0.6 km', offset: { lat: -0.0038, lng: 0.0032 } }
  ];

  const foodCatalog = [
    { id: 'food-1', name: 'Annapurna Daily Tiffin', type: 'Tiffin • Pure Veg', veg: true, price: 'Meal starts from ₹80', distance: '0.3 km', offset: { lat: -0.0024, lng: 0.0018 } },
    { id: 'food-2', name: 'Campus Hostel Mess', type: 'Mess • Pure Veg', veg: true, price: 'Meal starts from ₹90', distance: '0.1 km', offset: { lat: 0.0012, lng: -0.0015 } },
    { id: 'food-3', name: 'Bowl & Rice Kitchen', type: 'Multi-Cuisine • Non-Veg', veg: false, price: 'Meal starts from ₹140', distance: '0.4 km', offset: { lat: -0.0035, lng: -0.0028 } },
    { id: 'food-4', name: 'Punjab Dhaba Express', type: 'Punjabi • Non-Veg', veg: false, price: 'Meal starts from ₹150', distance: '0.5 km', offset: { lat: -0.0031, lng: 0.0038 } }
  ];

  const partnersCatalog = [
    { id: 'p-1', name: 'Aryan Sharma', gender: 'male', college: 'IIT Bombay', budgetINR: '₹8,500/mo', distance: '0.3 km from Campus', offset: { lat: -0.0028, lng: 0.0025 } },
    { id: 'p-2', name: 'Sneha Kulkarni', gender: 'female', college: 'IIT Bombay', budgetINR: '₹9,200/mo', distance: '0.5 km from Campus', offset: { lat: 0.0018, lng: 0.0030 } },
    { id: 'p-3', name: 'Varun Deshmukh', gender: 'male', college: 'IIT Bombay', budgetINR: '₹6,500/mo', distance: '0.4 km from Campus', offset: { lat: -0.0019, lng: -0.0022 } },
    { id: 'p-4', name: 'Ananya Roy', gender: 'female', college: 'IIT Bombay', budgetINR: '₹7,800/mo', distance: '0.6 km from Campus', offset: { lat: 0.0025, lng: -0.0018 } }
  ];

  let currentCollege = 'IIT Bombay';
  let mapInstance = null;
  let mapMarkers = {};

  function init() {
    let userRequirements = null;
    const stored = sessionStorage.getItem('relocmate_student_requirements');
    if (stored) {
      try {
        userRequirements = JSON.parse(stored);
        if (userRequirements.college) currentCollege = userRequirements.college;
      } catch (e) {
        console.warn('Could not parse stored requirements', e);
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const queryCollege = urlParams.get('college');
    if (queryCollege) currentCollege = decodeURIComponent(queryCollege);

    const prefs = userRequirements?.preferences || {};

    // 1. Rent
    const isRentAny = prefs.isRentAny ?? (prefs.maxRent === 'any' || !prefs.maxRent);
    const maxRent = !isRentAny && prefs.maxRent ? Number(prefs.maxRent) : null;

    // 2. Room Type
    const roomType = (prefs.roomType || prefs.room || 'any').toLowerCase();

    // 3. Food Service: veg | non-veg | none | any
    const foodService = (prefs.foodService || prefs.food || 'any').toLowerCase();

    // 4. Room Partner: male | female | none
    const roomPartner = (prefs.roomPartner || prefs.roommateGender || 'none').toLowerCase();

    // 5. Maximum Distance
    const isDistAny = prefs.isDistanceAny ?? (prefs.maxDistance === 'any' || !prefs.maxDistance);
    const maxDistance = !isDistAny && prefs.maxDistance ? Number(prefs.maxDistance) : null;

    // Rule flags:
    // Food = No Need -> Do NOT show food/meal options
    // Room Partner = No Need -> Do NOT show room-partner options
    const showRooms = true;
    const showFood = foodService !== 'none';
    const showPartner = roomPartner !== 'none';
    const showNearby = !showFood && !showPartner;

    // Command Bar display
    const collegeNameEl = document.getElementById('commandCollegeName');
    if (collegeNameEl) collegeNameEl.textContent = currentCollege;

    const collegeMetaEl = document.querySelector('.command-college-meta');
    if (collegeMetaEl) {
      const summaryParts = [isRentAny ? 'Rent: Any' : `Max Rent: ₹${maxRent?.toLocaleString()}`];
      if (roomType !== 'any') summaryParts.push(`${roomType === 'single' ? 'Single' : 'Shared'} Room`);
      if (showFood) {
        summaryParts.push(foodService === 'veg' ? 'Veg Only' : foodService === 'non-veg' ? 'Non-Veg' : 'All Food');
      } else {
        summaryParts.push('Food: No Need');
      }
      if (showPartner) {
        summaryParts.push(`${roomPartner.charAt(0).toUpperCase() + roomPartner.slice(1)} Partner`);
      } else {
        summaryParts.push('Partner: No Need');
      }
      if (!isDistAny && maxDistance) summaryParts.push(`Radius: ≤ ${maxDistance} km`);
      collegeMetaEl.textContent = summaryParts.join(' • ');
    }

    const items = [];

    // 1. Rooms
    if (showRooms) {
      let candidateRooms = [...roomsCatalog];
      if (roomType !== 'any') {
        candidateRooms = candidateRooms.filter(r => r.type.toLowerCase() === roomType);
      }
      if (!isRentAny && maxRent !== null) {
        candidateRooms = candidateRooms.filter(r => r.numericPrice <= maxRent);
      }
      if (!isDistAny && maxDistance !== null) {
        candidateRooms = candidateRooms.filter(r => parseFloat(r.distance) <= maxDistance);
      }
      candidateRooms.sort((a, b) => a.numericPrice - b.numericPrice);

      const roomCount = (!showFood && !showPartner) ? 3 : (showFood && showPartner) ? 1 : 2;
      const selected = candidateRooms.slice(0, roomCount);

      if (selected.length > 0) {
        selected.forEach(room => {
          items.push({
            id: room.id,
            category: 'room',
            title: 'Room',
            name: room.name,
            price: room.priceINR,
            distance: `${room.distance} to Campus`,
            type: `${room.type} Room`,
            icon: '🏠',
            url: 'rooms.html',
            btnText: 'View Rooms',
            offset: room.offset
          });
        });
      } else {
        const fallback = roomsCatalog[0];
        items.push({
          id: fallback.id,
          category: 'room',
          title: 'Room (Closest Available)',
          name: fallback.name,
          price: fallback.priceINR,
          distance: `${fallback.distance} to Campus`,
          type: `${fallback.type} Room`,
          icon: '🏠',
          url: 'rooms.html',
          btnText: 'View Rooms',
          offset: fallback.offset
        });
      }
    }

    // 2. Food (Food = No Need -> Do NOT show food/meal options)
    if (showFood) {
      let candidateFood = [...foodCatalog];
      if (foodService === 'veg') {
        candidateFood = candidateFood.filter(f => f.veg === true);
      } else if (foodService === 'non-veg') {
        candidateFood = candidateFood.filter(f => f.veg === false);
      }
      if (!isDistAny && maxDistance !== null) {
        candidateFood = candidateFood.filter(f => parseFloat(f.distance) <= maxDistance);
      }

      if (candidateFood.length > 0) {
        const foodItem = candidateFood[0];
        items.push({
          id: foodItem.id,
          category: 'food',
          title: `Food (${foodItem.veg ? 'Pure Veg' : 'Non-Veg'})`,
          name: foodItem.name,
          price: foodItem.price,
          distance: `${foodItem.distance} to Campus`,
          type: foodItem.type,
          icon: foodItem.veg ? '🥗' : '🍗',
          url: 'food.html',
          btnText: 'View Food',
          offset: foodItem.offset
        });
      }
    }

    // 3. Room Partner (Partner = No Need -> Do NOT show partner options)
    if (showPartner) {
      let candidatePartners = [...partnersCatalog];
      if (roomPartner === 'male' || roomPartner === 'female') {
        candidatePartners = candidatePartners.filter(p => p.gender === roomPartner);
      }
      if (!isDistAny && maxDistance !== null) {
        const distFiltered = candidatePartners.filter(p => parseFloat(p.distance) <= maxDistance);
        if (distFiltered.length > 0) candidatePartners = distFiltered;
      }

      if (candidatePartners.length > 0) {
        const partnerItem = candidatePartners[0];
        items.push({
          id: partnerItem.id,
          category: 'partner',
          title: `Room Partner (${partnerItem.gender === 'male' ? 'Male' : 'Female'})`,
          name: partnerItem.name,
          price: partnerItem.budgetINR,
          distance: `${partnerItem.distance.replace(' from Campus', '')} to Campus`,
          type: `${partnerItem.college}`,
          icon: partnerItem.gender === 'male' ? '👨' : '👩',
          url: 'roommates.html',
          btnText: 'View Partners',
          offset: partnerItem.offset
        });
      }
    }

    // 4. Nearby
    if (showNearby) {
      items.push({
        id: 'nearby-metro',
        category: 'nearby',
        title: 'Transit',
        name: 'Campus Metro & Transit',
        price: '₹20/ride',
        distance: '0.3 km to Campus',
        type: 'Public Transit',
        icon: '📍',
        url: 'nearby.html',
        btnText: 'View Nearby',
        offset: { lat: -0.0025, lng: -0.0075 }
      });
    }

    renderItems(items);
    initMap(items);
  }

  function renderItems(items) {
    const listContainer = document.querySelector('.recs-sidebar');
    if (!listContainer) return;

    let cardsHtml = items.map(item => `
      <div class="rec-card" data-id="${item.id}" onclick="window.location.href='${item.url}'" role="button" tabindex="0">
        <div class="rec-card-top">
          <div class="rec-badge-group">
            <span class="rec-category-tag cat-${item.category}">${item.icon} ${item.title}</span>
          </div>
          <span style="font-size: var(--font-size-xs); color: var(--slate-500); font-weight: 600;">
            ${item.type}
          </span>
        </div>

        <div class="rec-name">${item.name}</div>

        <div class="rec-card-bottom">
          <div class="rec-price">${item.price}</div>
          <div class="rec-distance">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
            <span>${item.distance}</span>
          </div>
        </div>

        <a href="${item.url}" class="btn btn-primary btn-sm" style="margin-top: var(--space-2); width: 100%; justify-content: center;" onclick="event.stopPropagation()">
          <span>${item.btnText}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </a>
      </div>
    `).join('');

    const existingCards = listContainer.querySelectorAll('.rec-card');
    existingCards.forEach(c => c.remove());

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = 'var(--space-3)';
    wrapper.innerHTML = cardsHtml;
    listContainer.appendChild(wrapper);
  }

  function initMap(items) {
    const mapEl = document.getElementById('recommendationMap');
    if (!mapEl || typeof L === 'undefined') return;

    const coords = campusCoordinates[currentCollege] || campusCoordinates['IIT Bombay'] || { lat: 19.1334, lng: 72.9133 };

    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }

    mapInstance = L.map('recommendationMap', {
      center: [coords.lat, coords.lng],
      zoom: 15,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapInstance);

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
      .addTo(mapInstance)
      .bindPopup(`<strong>🎓 ${currentCollege}</strong><br><span style="font-size: 12px; color: #64748b;">Selected College</span>`);

    items.forEach(item => {
      if (!item.offset) return;
      const markerCoords = [coords.lat + item.offset.lat, coords.lng + item.offset.lng];
      const pinColors = { room: '#10b981', food: '#ea580c', partner: '#7c3aed', nearby: '#0f172a' };
      const pinColor = pinColors[item.category] || '#2563eb';

      const recIcon = L.divIcon({
        className: 'custom-rec-pin',
        html: `
          <div style="background: ${pinColor}; color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2.5px solid #fff; box-shadow: 0 3px 10px rgba(0,0,0,0.25); cursor: pointer;">
            ${item.icon}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(markerCoords, { icon: recIcon }).addTo(mapInstance);
      marker.bindPopup(`<strong>${item.name}</strong><br><span style="color: #2563eb; font-weight: 700;">${item.price}</span> • ${item.distance}`);
      marker.on('click', () => { window.location.href = item.url; });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
