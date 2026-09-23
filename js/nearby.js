/**
 * STUDENT RELOCATION PLATFORM - NEARBY SERVICES CONTROLLER
 * Map-first engine with 7 categories (Food, Grocery, Pharmacy, Stationery, ATM, Laundry, Transport),
 * distance tags, and compact "Name · Distance · Open/Closed" cards.
 */

(function () {
  'use strict';

  // Coordinate lookups for top student campuses
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

  // Mock location dataset across the 7 required categories
  // Structured to receive real Google Places / OpenStreetMap / backend API data seamlessly
  const mockPlacesData = {
    food: [
      { id: 'f1', name: 'Campus Slice Pizza', distance: '0.2 km', open: true, offset: { lat: 0.0018, lng: 0.0012 } },
      { id: 'f2', name: 'Golden Bowl Noodles', distance: '0.4 km', open: true, offset: { lat: -0.0028, lng: 0.0021 } },
      { id: 'f3', name: 'Telegraph Taco Stand', distance: '0.5 km', open: false, offset: { lat: -0.0041, lng: -0.0018 } },
      { id: 'f4', name: 'Green Cafe & Salads', distance: '0.3 km', open: true, offset: { lat: 0.0024, lng: -0.0029 } }
    ],
    grocery: [
      { id: 'g1', name: "Trader Joe's", distance: '0.6 km', open: true, offset: { lat: -0.0052, lng: -0.0035 } },
      { id: 'g2', name: 'Campus Mart Express', distance: '0.2 km', open: true, offset: { lat: 0.0015, lng: -0.0012 } },
      { id: 'g3', name: 'Whole Foods Market', distance: '0.9 km', open: true, offset: { lat: -0.0075, lng: 0.0042 } },
      { id: 'g4', name: 'Berkeley Natural Grocery', distance: '0.7 km', open: false, offset: { lat: 0.0058, lng: -0.0048 } }
    ],
    pharmacy: [
      { id: 'p1', name: 'CVS Pharmacy', distance: '0.3 km', open: true, offset: { lat: -0.0022, lng: -0.0028 } },
      { id: 'p2', name: 'Walgreens 24/7', distance: '0.5 km', open: true, offset: { lat: 0.0039, lng: 0.0031 } },
      { id: 'p3', name: 'Campus Health Pharmacy', distance: '0.1 km', open: false, offset: { lat: 0.0008, lng: 0.0010 } }
    ],
    stationery: [
      { id: 's1', name: 'University Bookstore & Print', distance: '0.2 km', open: true, offset: { lat: -0.0014, lng: 0.0019 } },
      { id: 's2', name: 'FedEx Office & Copy', distance: '0.4 km', open: true, offset: { lat: -0.0032, lng: -0.0030 } },
      { id: 's3', name: 'Artist Supplies & Notebooks', distance: '0.6 km', open: false, offset: { lat: 0.0048, lng: -0.0022 } }
    ],
    atm: [
      { id: 'a1', name: 'Chase Bank & ATM', distance: '0.3 km', open: true, offset: { lat: -0.0025, lng: -0.0018 } },
      { id: 'a2', name: 'Bank of America ATM', distance: '0.2 km', open: true, offset: { lat: 0.0016, lng: 0.0020 } },
      { id: 'a3', name: 'Wells Fargo ATM Hub', distance: '0.4 km', open: true, offset: { lat: -0.0033, lng: 0.0025 } }
    ],
    laundry: [
      { id: 'l1', name: 'Speedy Wash Laundromat', distance: '0.4 km', open: true, offset: { lat: -0.0036, lng: 0.0034 } },
      { id: 'l2', name: 'Eco Cleaners & Wash', distance: '0.6 km', open: true, offset: { lat: 0.0045, lng: -0.0039 } },
      { id: 'l3', name: 'Student Drop-off Wash', distance: '0.5 km', open: false, offset: { lat: -0.0042, lng: -0.0025 } }
    ],
    transport: [
      { id: 't1', name: 'Downtown BART Station', distance: '0.4 km', open: true, offset: { lat: 0.0010, lng: -0.0045 } },
      { id: 't2', name: 'Campus Shuttle Stop (Line 51B)', distance: '0.1 km', open: true, offset: { lat: 0.0006, lng: 0.0008 } },
      { id: 't3', name: 'AC Transit Bus Depot', distance: '0.5 km', open: true, offset: { lat: -0.0038, lng: -0.0040 } },
      { id: 't4', name: 'Bay Wheels Bike Hub', distance: '0.2 km', open: true, offset: { lat: -0.0015, lng: 0.0016 } }
    ]
  };

  const categoryMeta = {
    food: { label: 'Food', icon: '🍲', colorClass: 'pin-cat-food' },
    grocery: { label: 'Grocery', icon: '🛒', colorClass: 'pin-cat-grocery' },
    pharmacy: { label: 'Pharmacy', icon: '💊', colorClass: 'pin-cat-pharmacy' },
    stationery: { label: 'Stationery', icon: '✏️', colorClass: 'pin-cat-stationery' },
    atm: { label: 'ATM', icon: '💳', colorClass: 'pin-cat-atm' },
    laundry: { label: 'Laundry', icon: '🧺', colorClass: 'pin-cat-laundry' },
    transport: { label: 'Transport', icon: '🚇', colorClass: 'pin-cat-transport' }
  };

  let currentCollege = 'UC Berkeley';
  let activeCategory = 'food';
  let searchQuery = '';
  let mapInstance = null;
  let activeMarkers = [];
  let collegeMarker = null;
  let collegeRadiusCircle = null;

  // DOM Elements
  const searchInput = document.getElementById('nearbySearchInput');
  const clearBtn = document.getElementById('nearbyClearBtn');
  const campusBadgeName = document.getElementById('campusBadgeName');
  const categoryButtons = document.querySelectorAll('.cat-btn');

  // ==========================================================================
  // Initialization
  // ==========================================================================
  function init() {
    // 1. Read college from requirements submission or URL
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

    const queryCategory = urlParams.get('category');
    if (queryCategory && mockPlacesData[queryCategory]) {
      activeCategory = queryCategory;
    }

    if (campusBadgeName) {
      campusBadgeName.textContent = currentCollege;
    }

    // 2. Initialize Leaflet Map
    initMap();

    // 3. Setup Category Tabs & Search
    setupCategoryControls();
    setupSearch();
  }

  // ==========================================================================
  // Interactive Map Setup
  // ==========================================================================
  function initMap() {
    const coords = campusCoordinates[currentCollege] || { lat: 37.8719, lng: -122.2585 };

    if (!window.L) {
      console.warn('Leaflet library not ready');
      return;
    }

    mapInstance = L.map('nearbyMap', {
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

    // Subtle 800m student walking radius perimeter
    collegeRadiusCircle = L.circle([coords.lat, coords.lng], {
      color: '#4f46e5',
      fillColor: '#4f46e5',
      fillOpacity: 0.04,
      dashArray: '4, 8',
      weight: 1.5,
      radius: 750
    }).addTo(mapInstance);

    // Central College Beacon Marker (Prominent Center Anchor)
    const collegeIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="college-center-pin" title="${currentCollege}">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
        </div>
      `,
      iconSize: [52, 52],
      iconAnchor: [26, 26]
    });

    collegeMarker = L.marker([coords.lat, coords.lng], { icon: collegeIcon })
      .addTo(mapInstance)
      .bindPopup(`
        <div class="service-popup-card">
          <div class="service-popup-title">🎓 ${currentCollege}</div>
          <div class="service-popup-meta-row">
            <span class="service-popup-distance">Center</span>
            <span class="service-status-pill status-open">Main Campus</span>
          </div>
        </div>
      `);

    // Render initial category markers
    renderCategoryMarkers();
  }

  // ==========================================================================
  // Render Category Markers with Distance Badges & Compact Popups
  // ==========================================================================
  function renderCategoryMarkers() {
    if (!mapInstance) return;

    // Clear active markers
    activeMarkers.forEach(m => mapInstance.removeLayer(m));
    activeMarkers = [];

    const coords = campusCoordinates[currentCollege] || { lat: 37.8719, lng: -122.2585 };
    const meta = categoryMeta[activeCategory] || categoryMeta.food;

    // Get places for current category (or filter across all categories if user searched)
    let places = [];
    if (searchQuery) {
      Object.keys(mockPlacesData).forEach(cat => {
        const matches = mockPlacesData[cat].filter(p => p.name.toLowerCase().includes(searchQuery));
        places = places.concat(matches);
      });
    } else {
      places = mockPlacesData[activeCategory] || [];
    }

    places.forEach(place => {
      const lat = coords.lat + (place.offset ? place.offset.lat : 0);
      const lng = coords.lng + (place.offset ? place.offset.lng : 0);

      // Custom marker with icon bubble + small distance tag
      const markerHtml = `
        <div class="service-map-pin">
          <div class="pin-bubble ${meta.colorClass}">
            ${meta.icon}
          </div>
          <div class="pin-distance-tag">${place.distance}</div>
        </div>
      `;

      const markerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: markerHtml,
        iconSize: [38, 48],
        iconAnchor: [19, 44]
      });

      // Compact popup card: Strictly Name · Distance · Open/Closed
      const popupHtml = `
        <div class="service-popup-card">
          <div class="service-popup-title">${place.name}</div>
          <div class="service-popup-meta-row">
            <span class="service-popup-distance">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
              ${place.distance}
            </span>
            <span class="service-status-pill ${place.open ? 'status-open' : 'status-closed'}">
              ${place.open ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon: markerIcon })
        .addTo(mapInstance)
        .bindPopup(popupHtml, { closeButton: false, offset: [0, -28] });

      activeMarkers.push(marker);
    });

    // Animate map view smoothly to campus center
    if (activeMarkers.length > 0) {
      mapInstance.flyTo([coords.lat, coords.lng], 15, { duration: 0.5 });
    }
  }

  // ==========================================================================
  // Category Selector Controls
  // ==========================================================================
  function setupCategoryControls() {
    categoryButtons.forEach(btn => {
      // Set active initial class
      if (btn.getAttribute('data-cat') === activeCategory) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeCategory = btn.getAttribute('data-cat');
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';

        renderCategoryMarkers();
      });
    });
  }

  // ==========================================================================
  // Simple Search for Custom Services
  // ==========================================================================
  function setupSearch() {
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      if (clearBtn) {
        clearBtn.style.display = searchQuery ? 'inline-flex' : 'none';
      }
      renderCategoryMarkers();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        renderCategoryMarkers();
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
