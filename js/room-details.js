/**
 * STUDENT RELOCATION PLATFORM - ROOM DETAILS CONTROLLER
 * Gallery switching, proximity route map, save toggle, and 'Interested' action flow.
 */

(function () {
  'use strict';

  // Campus coordinates lookup
  const campusCoordinates = {
    'UC Berkeley': { lat: 37.8719, lng: -122.2585 },
    'UT Austin': { lat: 30.2849, lng: -97.7341 },
    'Boston University': { lat: 42.3505, lng: -71.1054 },
    'NYU': { lat: 40.7295, lng: -73.9965 },
    'New York University (NYU)': { lat: 40.7295, lng: -73.9965 },
    'Stanford University': { lat: 37.4275, lng: -122.1697 },
    'UCLA': { lat: 34.0689, lng: -118.4452 },
    'Georgia Tech': { lat: 33.7756, lng: -84.3963 }
  };

  // Mock room data model (ready for direct backend/API ingestion)
  const roomData = {
    id: 'room-telegraph-1',
    name: 'Telegraph Student Lofts',
    priceINR: '₹8,500/mo',
    priceUSD: '$740/mo',
    distance: '0.4 km',
    walkTime: '5 min walk',
    roomType: 'Single Private Room',
    verified: true,
    owner: {
      name: 'Rajesh Sharma',
      role: 'Verified Property Owner',
      phone: '+91 98201 *****',
      whatsapp: '919820144520',
      responseRate: 'Under 15 mins'
    },
    photos: [
      'assets/dorm_main.jpg',
      'assets/dorm_study.jpg'
    ],
    facilities: [
      { key: 'wifi', label: 'Wi-Fi', icon: '📶', detail: 'High-speed fiber' },
      { key: 'food', label: 'Food', icon: '🍱', detail: 'Meal plan included' },
      { key: 'ac', label: 'AC', icon: '❄️', detail: 'Climate controlled' },
      { key: 'laundry', label: 'Laundry', icon: '🧺', detail: 'In-unit washer' },
      { key: 'parking', label: 'Parking', icon: '🅿️', detail: 'Bicycle & car spot' }
    ]
  };

  let currentCollege = 'UC Berkeley';
  let mapInstance = null;
  let isSaved = false;

  // ==========================================================================
  // Initialization
  // ==========================================================================
  function init() {
    // 1. Read college context
    const stored = sessionStorage.getItem('relocmate_student_requirements');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.college) currentCollege = parsed.college;
      } catch (e) {
        console.warn('Could not read college from session', e);
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const queryCollege = urlParams.get('college');
    if (queryCollege) currentCollege = decodeURIComponent(queryCollege);

    // Update college context labels
    const collegeDistEl = document.getElementById('roomCollegeContext');
    if (collegeDistEl) {
      collegeDistEl.textContent = `${roomData.distance} from ${currentCollege}`;
    }

    const mapDistEl = document.getElementById('mapDistanceBadge');
    if (mapDistEl) {
      mapDistEl.textContent = `${roomData.distance} • ${roomData.walkTime} to ${currentCollege}`;
    }

    // Populate Owner Details
    if (roomData.owner) {
      const nameEl = document.getElementById('ownerName');
      if (nameEl) nameEl.textContent = roomData.owner.name;

      const roleEl = document.getElementById('ownerRole');
      if (roleEl) roleEl.textContent = `${roomData.owner.role} • Zero Brokerage`;

      const respEl = document.getElementById('ownerResponseRate');
      if (respEl) respEl.textContent = `Typically responds in ${roomData.owner.responseRate.toLowerCase()}`;

      const avatarEl = document.getElementById('ownerAvatar');
      if (avatarEl) avatarEl.textContent = roomData.owner.name.charAt(0);

      const phoneTextEl = document.getElementById('ownerPhoneText');
      if (phoneTextEl) phoneTextEl.textContent = `Call ${roomData.owner.phone}`;

      const callBtn = document.getElementById('ownerCallBtn');
      if (callBtn) callBtn.href = `tel:${roomData.owner.phone}`;

      const waBtn = document.getElementById('ownerWaBtn');
      if (waBtn) {
        waBtn.href = `https://wa.me/${roomData.owner.whatsapp}?text=Hi%20${encodeURIComponent(roomData.owner.name)},%20I%20am%20interested%20in%20${encodeURIComponent(roomData.name)}%20near%20${encodeURIComponent(currentCollege)}.`;
      }
    }

    // 2. Setup Gallery Thumbnail Switcher
    setupGallery();

    // 3. Setup Proximity Map
    initProximityMap();

    // 4. Setup Action Buttons (Interested & Save)
    setupActionButtons();
  }

  // ==========================================================================
  // Gallery Thumbnail Switcher
  // ==========================================================================
  function setupGallery() {
    const mainImg = document.getElementById('galleryMainImg');
    const thumbnails = document.querySelectorAll('.gallery-thumb');

    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const targetSrc = thumb.getAttribute('data-img');
        if (mainImg && targetSrc) {
          mainImg.style.opacity = '0.4';
          setTimeout(() => {
            mainImg.src = targetSrc;
            mainImg.style.opacity = '1';
          }, 120);
        }

        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }

  // ==========================================================================
  // Proximity Map (Highlighting College & Room with Connecting Route Line)
  // ==========================================================================
  function initProximityMap() {
    const coords = campusCoordinates[currentCollege] || { lat: 37.8719, lng: -122.2585 };
    const roomCoords = { lat: coords.lat - 0.0032, lng: coords.lng - 0.0018 };

    if (!window.L) {
      console.warn('Leaflet not loaded');
      return;
    }

    const mapEl = document.getElementById('roomLocationMap');
    if (!mapEl) return;

    mapInstance = L.map('roomLocationMap', {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false
    });

    // Sleek CartoDB Light Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(mapInstance);

    // 1. College Beacon Marker
    const collegeIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-gradient); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px var(--primary-glow); border: 2px solid white;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    L.marker([coords.lat, coords.lng], { icon: collegeIcon })
      .addTo(mapInstance)
      .bindPopup(`<strong>🎓 ${currentCollege}</strong><br><span style="font-size: 11px; color: #64748b;">University Center</span>`);

    // 2. Room Marker
    const roomIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="width: 40px; height: 40px; border-radius: 50%; background: #4f46e5; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); border: 2px solid white; font-size: 18px;">
          🏠
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    L.marker([roomCoords.lat, roomCoords.lng], { icon: roomIcon })
      .addTo(mapInstance)
      .bindPopup(`<strong>${roomData.name}</strong><br><span style="color: #4f46e5; font-weight: bold;">${roomData.priceINR}</span>`);

    // 3. Proximity Dashed Connecting Line
    L.polyline([[coords.lat, coords.lng], [roomCoords.lat, roomCoords.lng]], {
      color: '#4f46e5',
      weight: 3,
      dashArray: '5, 8',
      opacity: 0.7
    }).addTo(mapInstance);

    // Fit map bounds smoothly to show both college & room
    const bounds = L.latLngBounds([
      [coords.lat, coords.lng],
      [roomCoords.lat, roomCoords.lng]
    ]);
    mapInstance.fitBounds(bounds, { padding: [40, 40] });
  }

  // ==========================================================================
  // Action Buttons (Interested & Save Toggle)
  // ==========================================================================
  function setupActionButtons() {
    const interestedBtn = document.getElementById('interestedBtn');
    const saveBtn = document.getElementById('saveBtn');

    if (interestedBtn) {
      interestedBtn.addEventListener('click', () => {
        window.showToast({
          title: 'Interest Sent!',
          message: `Verified housing desk at ${currentCollege} has received your inquiry. Landlord contacted.`,
          type: 'success',
          duration: 4000
        });
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        isSaved = !isSaved;
        const saveIcon = saveBtn.querySelector('svg');
        const saveText = saveBtn.querySelector('span');

        if (isSaved) {
          saveBtn.classList.add('saved');
          saveText.textContent = 'Saved';
          window.showToast({
            title: 'Room Saved',
            message: `${roomData.name} added to your saved student stays.`,
            type: 'primary',
            duration: 2500
          });
        } else {
          saveBtn.classList.remove('saved');
          saveText.textContent = 'Save';
          window.showToast({
            title: 'Room Removed',
            message: `${roomData.name} removed from saved list.`,
            type: 'warning',
            duration: 2000
          });
        }
      });
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
