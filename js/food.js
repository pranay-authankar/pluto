/**
 * STUDENT RELOCATION PLATFORM - FOOD SERVICES CONTROLLER
 * Filter controller (Veg, Non-Veg, Tiffin, Mess, Restaurant), compact sticky map,
 * and compact detail view (Name · Price · Distance · Location).
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

  // Mock food data structured for future backend/API integration
  const foodData = [
    {
      id: 'food-1',
      name: 'Annapurna Daily Tiffin',
      type: 'Tiffin',
      veg: true,
      price: '₹2,800/mo',
      distance: '0.3 km',
      location: 'Telegraph Avenue',
      image: 'assets/food_tiffin.jpg',
      offset: { lat: -0.0024, lng: 0.0018 }
    },
    {
      id: 'food-2',
      name: 'Campus Hostel Mess',
      type: 'Mess',
      veg: true,
      price: '₹3,200/mo',
      distance: '0.1 km',
      location: 'Northgate Campus Gate',
      image: 'assets/food_mess.jpg',
      offset: { lat: 0.0012, lng: -0.0015 }
    },
    {
      id: 'food-3',
      name: 'Bowl & Rice Kitchen',
      type: 'Restaurant',
      veg: false,
      price: '₹140/meal',
      distance: '0.4 km',
      location: 'Bancroft Way',
      image: 'assets/food_restaurant.jpg',
      offset: { lat: -0.0035, lng: -0.0028 }
    },
    {
      id: 'food-4',
      name: 'Shree Krishna Veg Thali',
      type: 'Mess',
      veg: true,
      price: '₹110/thali',
      distance: '0.5 km',
      location: 'Southside Food Street',
      image: 'assets/food_tiffin.jpg',
      offset: { lat: -0.0042, lng: 0.0022 }
    },
    {
      id: 'food-5',
      name: 'Spiced Grill & Rolls',
      type: 'Restaurant',
      veg: false,
      price: '₹160/roll',
      distance: '0.6 km',
      location: 'University Avenue',
      image: 'assets/food_restaurant.jpg',
      offset: { lat: 0.0028, lng: -0.0040 }
    },
    {
      id: 'food-6',
      name: 'Mom’s Home Tiffin Box',
      type: 'Tiffin',
      veg: true,
      price: '₹2,500/mo',
      distance: '0.4 km',
      location: 'Oxford Street',
      image: 'assets/food_tiffin.jpg',
      offset: { lat: -0.0018, lng: -0.0032 }
    }
  ];

  let currentCollege = 'UC Berkeley';
  let activeFilter = 'all'; // 'all' | 'veg' | 'non-veg' | 'tiffin' | 'mess' | 'restaurant'
  let mapInstance = null;
  let foodMarkers = {};
  let collegeMarker = null;

  // DOM Elements
  const cardsContainer = document.getElementById('foodCardsList');
  const foodModal = document.getElementById('foodDetailModal');
  const filterButtons = document.querySelectorAll('.food-filter-btn');

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

    const campusLabel = document.getElementById('foodCampusLabel');
    if (campusLabel) campusLabel.textContent = `Near ${currentCollege}`;

    // 2. Initialize Leaflet Map
    initMap();

    // 3. Render Cards
    renderFoodCards(foodData);

    // 4. Setup Filters
    setupFilters();

    // 5. Setup Modal Close Listeners
    setupModal();
  }

  // ==========================================================================
  // Interactive Map Setup (Leaflet)
  // ==========================================================================
  function initMap() {
    const coords = campusCoordinates[currentCollege] || { lat: 37.8719, lng: -122.2585 };

    if (!window.L) {
      console.warn('Leaflet not loaded');
      return;
    }

    const mapEl = document.getElementById('foodMap');
    if (!mapEl) return;

    mapInstance = L.map('foodMap', {
      center: [coords.lat, coords.lng],
      zoom: 15,
      zoomControl: true,
      attributionControl: true
    });

    // Real OpenStreetMap Tile Layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    // Central College Beacon Marker
    const collegeIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-gradient); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px var(--primary-glow); border: 2.5px solid white;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    collegeMarker = L.marker([coords.lat, coords.lng], { icon: collegeIcon })
      .addTo(mapInstance)
      .bindPopup(`<strong>🎓 ${currentCollege}</strong><br><span style="font-size: 11px; color: #64748b;">University Anchor</span>`);

    // Plot initial food markers
    plotFoodMarkers(foodData, coords);
  }

  // ==========================================================================
  // Plot Food Markers on Map
  // ==========================================================================
  function plotFoodMarkers(items, baseCoords) {
    Object.values(foodMarkers).forEach(m => mapInstance.removeLayer(m));
    foodMarkers = {};

    items.forEach(item => {
      const lat = baseCoords.lat + item.offset.lat;
      const lng = baseCoords.lng + item.offset.lng;

      const markerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="width: 36px; height: 36px; border-radius: 50%; background: ${item.veg ? '#059669' : '#ea580c'}; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 2px solid white; font-size: 16px; cursor: pointer;">
            ${item.type === 'Tiffin' ? '🍱' : item.type === 'Mess' ? '🍲' : '🍽️'}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(mapInstance);

      marker.bindPopup(`
        <div style="padding: 6px 8px; font-family: var(--font-family-sans);">
          <div style="font-size: 13px; font-weight: bold; color: var(--slate-900);">${item.name}</div>
          <div style="font-size: 11px; color: var(--slate-500); display: flex; justify-content: space-between; margin-top: 3px;">
            <span style="color: var(--primary-700); font-weight: 700;">${item.price}</span>
            <span>${item.distance}</span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        openDetailModal(item.id);
      });

      foodMarkers[item.id] = marker;
    });
  }

  // ==========================================================================
  // Render Food Cards (Name · Type · Price · Distance)
  // ==========================================================================
  function renderFoodCards(items) {
    if (!cardsContainer) return;

    if (items.length === 0) {
      cardsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-12); color: var(--slate-400);">
          No food options match current filter.
        </div>
      `;
      return;
    }

    cardsContainer.innerHTML = items.map(item => `
      <div class="food-card" id="food-${item.id}" onclick="focusFoodItem('${item.id}')">
        <!-- Visual Food Image -->
        <div class="food-card-img-wrapper">
          <img src="${item.image}" alt="${item.name}" class="food-card-img">
          
          <div class="food-tag-overlay">
            <span class="food-veg-pill ${item.veg ? 'pill-veg' : 'pill-non-veg'}">
              <span>${item.veg ? '🌱' : '🍗'}</span> ${item.veg ? 'Veg' : 'Non-Veg'}
            </span>
            <span class="food-type-pill">${item.type}</span>
          </div>
        </div>

        <!-- Food Details -->
        <div class="food-card-body">
          <div class="food-card-name">${item.name}</div>
          
          <div class="food-card-meta-row">
            <div class="food-card-price">${item.price}</div>
            <div class="food-card-distance">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
              <span>${item.distance}</span>
            </div>
          </div>

          <!-- One Clear Action: "View" -->
          <button type="button" class="btn-food-view" onclick="event.stopPropagation(); openDetailModal('${item.id}')">
            <span>View</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  // ==========================================================================
  // Card Click: Centers Map & Highlights Pin
  // ==========================================================================
  window.focusFoodItem = function (id) {
    document.querySelectorAll('.food-card').forEach(c => c.classList.remove('active-food-card'));
    const card = document.getElementById(`food-${id}`);
    if (card) card.classList.add('active-food-card');

    const marker = foodMarkers[id];
    if (marker && mapInstance) {
      mapInstance.flyTo(marker.getLatLng(), 16, { duration: 0.5 });
      marker.openPopup();
    }
  };

  // ==========================================================================
  // Compact Detail View (Name · Price · Distance · Location)
  // ==========================================================================
  window.openDetailModal = function (id) {
    const item = foodData.find(f => f.id === id);
    if (!item || !foodModal) return;

    document.getElementById('modalFoodImg').src = item.image;
    document.getElementById('modalFoodName').textContent = item.name;
    document.getElementById('modalFoodPrice').textContent = item.price;
    document.getElementById('modalFoodDistance').textContent = item.distance;
    document.getElementById('modalFoodLocation').textContent = item.location;
    document.getElementById('modalFoodType').textContent = `${item.veg ? 'Veg' : 'Non-Veg'} • ${item.type}`;

    foodModal.classList.add('open');
  };

  window.closeFoodModal = function () {
    if (foodModal) foodModal.classList.remove('open');
  };

  function setupModal() {
    if (foodModal) {
      foodModal.addEventListener('click', (e) => {
        if (e.target === foodModal) {
          closeFoodModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeFoodModal();
    });
  }

  // ==========================================================================
  // Filter Handling (Veg, Non-Veg, Tiffin, Mess, Restaurant)
  // ==========================================================================
  function setupFilters() {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeFilter = btn.getAttribute('data-filter');
        applyFilter();
      });
    });
  }

  function applyFilter() {
    let filtered = [...foodData];

    if (activeFilter === 'veg') {
      filtered = filtered.filter(f => f.veg === true);
    } else if (activeFilter === 'non-veg') {
      filtered = filtered.filter(f => f.veg === false);
    } else if (activeFilter === 'tiffin') {
      filtered = filtered.filter(f => f.type.toLowerCase() === 'tiffin');
    } else if (activeFilter === 'mess') {
      filtered = filtered.filter(f => f.type.toLowerCase() === 'mess');
    } else if (activeFilter === 'restaurant') {
      filtered = filtered.filter(f => f.type.toLowerCase() === 'restaurant');
    }

    renderFoodCards(filtered);
    const coords = campusCoordinates[currentCollege] || { lat: 37.8719, lng: -122.2585 };
    plotFoodMarkers(filtered, coords);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
