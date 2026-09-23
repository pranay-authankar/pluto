/**
 * STUDENT RELOCATION PLATFORM - ROOMS CATALOG CONTROLLER
 * Mock rooms catalog, filter logic, and navigation to room-details.html
 */

(function () {
  'use strict';

  const roomsData = [
    {
      id: 'room-1',
      name: 'Telegraph Student Lofts',
      type: 'Single',
      priceINR: '₹8,500/mo',
      priceUSD: '$740/mo',
      numericPrice: 8500,
      distance: '0.4 km',
      image: 'assets/dorm_main.jpg',
      facilities: ['Attached Bath', 'Study Desk', 'High-Speed WiFi', 'Power Backup'],
      bestMatch: true
    },
    {
      id: 'room-2',
      name: 'Northgate Shared Suites',
      type: 'Shared',
      priceINR: '₹6,800/mo',
      priceUSD: '$590/mo',
      numericPrice: 6800,
      distance: '0.2 km',
      image: 'assets/dorm_study.jpg',
      facilities: ['Shared Kitchen', 'High-Speed WiFi', 'Study Desk', 'Food/Mess Nearby'],
      bestMatch: false
    },
    {
      id: 'room-3',
      name: 'Southside Campus Studio',
      type: 'Single',
      priceINR: '₹9,800/mo',
      priceUSD: '$850/mo',
      numericPrice: 9800,
      distance: '0.5 km',
      image: 'assets/dorm_main.jpg',
      facilities: ['AC', 'Attached Bath', 'Balcony', 'High-Speed WiFi', 'Power Backup'],
      bestMatch: false
    },
    {
      id: 'room-4',
      name: 'Bancroft Student Residence',
      type: 'Shared',
      priceINR: '₹6,200/mo',
      priceUSD: '$540/mo',
      numericPrice: 6200,
      distance: '0.3 km',
      image: 'assets/dorm_study.jpg',
      facilities: ['High-Speed WiFi', 'Food/Mess Nearby', 'Study Desk', 'Laundry'],
      bestMatch: false
    },
    {
      id: 'room-5',
      name: 'Piedmont Scholars PG',
      type: 'Single',
      priceINR: '₹7,500/mo',
      priceUSD: '$650/mo',
      numericPrice: 7500,
      distance: '0.3 km',
      image: 'assets/dorm_main.jpg',
      facilities: ['Attached Bath', 'Study Desk', 'High-Speed WiFi', 'Food/Mess Nearby'],
      bestMatch: false
    },
    {
      id: 'room-6',
      name: 'Campus Edge Twin Haven',
      type: 'Shared',
      priceINR: '₹5,800/mo',
      priceUSD: '$500/mo',
      numericPrice: 5800,
      distance: '0.2 km',
      image: 'assets/dorm_study.jpg',
      facilities: ['High-Speed WiFi', 'Study Desk', 'Power Backup', 'Food/Mess Nearby'],
  const roomsData = [
    {
      id: 'room-1',
      name: 'Telegraph Student Lofts',
      type: 'Single',
      priceINR: '₹8,500/mo',
      priceUSD: '$740/mo',
      numericPrice: 8500,
      distance: '0.4 km',
      image: 'assets/dorm_main.jpg',
      facilities: ['Wi-Fi', 'AC', 'Laundry', 'Furnished', 'Attached Bath'],
      bestMatch: true,
      owner: {
        name: 'Rajesh Sharma',
        role: 'Verified Property Owner',
        phone: '+91 98201 *****',
        whatsapp: '+91 98201 *****',
        responseRate: 'Under 15 mins'
      }
    },
    {
      id: 'room-2',
      name: 'Northgate Shared Suites',
      type: 'Shared',
      priceINR: '₹6,800/mo',
      priceUSD: '$590/mo',
      numericPrice: 6800,
      distance: '0.2 km',
      image: 'assets/dorm_study.jpg',
      facilities: ['Wi-Fi', 'AC', 'Attached Bath', 'Food/Mess Nearby'],
      bestMatch: false,
      owner: {
        name: 'Suresh Patil',
        role: 'PG Warden / Owner',
        phone: '+91 98332 *****',
        whatsapp: '+91 98332 *****',
        responseRate: 'Under 30 mins'
      }
    },
    {
      id: 'room-3',
      name: 'Southside Campus Studio',
      type: 'Single',
      priceINR: '₹9,800/mo',
      priceUSD: '$850/mo',
      numericPrice: 9800,
      distance: '0.5 km',
      image: 'assets/dorm_main.jpg',
      facilities: ['Wi-Fi', 'AC', 'Furnished', 'Attached Bath', 'Power Backup'],
      bestMatch: false,
      owner: {
        name: 'Meenakshi Iyer',
        role: 'Independent Landlord',
        phone: '+91 97654 *****',
        whatsapp: '+91 97654 *****',
        responseRate: 'Under 10 mins'
      }
    },
    {
      id: 'room-4',
      name: 'Bancroft Student Residence',
      type: 'Shared',
      priceINR: '₹6,200/mo',
      priceUSD: '$540/mo',
      numericPrice: 6200,
      distance: '0.3 km',
      image: 'assets/dorm_study.jpg',
      facilities: ['Wi-Fi', 'Laundry', 'Furnished', 'Study Desk'],
      bestMatch: false,
      owner: {
        name: 'Vikram Malhotra',
        role: 'Property Manager',
        phone: '+91 99100 *****',
        whatsapp: '+91 99100 *****',
        responseRate: 'Under 20 mins'
      }
    },
    {
      id: 'room-5',
      name: 'Oxford Garden Single Room',
      type: 'Single',
      priceINR: '₹7,400/mo',
      priceUSD: '$650/mo',
      numericPrice: 7400,
      distance: '0.3 km',
      image: 'assets/dorm_main.jpg',
      facilities: ['Wi-Fi', 'Attached Bath', 'Furnished', 'Power Backup'],
      bestMatch: false,
      owner: {
        name: 'Anil Kulkarni',
        role: 'Resident Landlord',
        phone: '+91 98450 *****',
        whatsapp: '+91 98450 *****',
        responseRate: 'Under 15 mins'
      }
    },
    {
      id: 'room-6',
      name: 'University Crescent Shared Flat',
      type: 'Shared',
      priceINR: '₹5,500/mo',
      priceUSD: '$500/mo',
      numericPrice: 5500,
      distance: '0.6 km',
      image: 'assets/dorm_study.jpg',
      facilities: ['Wi-Fi', 'Laundry', 'Food/Mess Nearby'],
      bestMatch: false,
      owner: {
        name: 'Pooja Agarwal',
        role: 'Verified Landlord',
        phone: '+91 98112 *****',
        whatsapp: '+91 98112 *****',
        responseRate: 'Under 25 mins'
      }
    },
    {
      id: 'room-7',
      name: 'Hearst Premier Studio Suite',
      type: 'Single',
      priceINR: '₹11,500/mo',
      priceUSD: '$990/mo',
      numericPrice: 11500,
      distance: '0.2 km',
      image: 'assets/dorm_main.jpg',
      facilities: ['Wi-Fi', 'AC', 'Attached Bath', 'Furnished', 'Power Backup'],
      bestMatch: false,
      owner: {
        name: 'Col. R.K. Verma (Retd.)',
        role: 'Building Owner',
        phone: '+91 98990 *****',
        whatsapp: '+91 98990 *****',
        responseRate: 'Immediate'
      }
    },
    {
      id: 'room-8',
      name: 'Channing Way Double Share',
      type: 'Shared',
      priceINR: '₹7,200/mo',
      priceUSD: '$450/mo',
      numericPrice: 7200,
      distance: '0.4 km',
      image: 'assets/dorm_study.jpg',
      facilities: ['Wi-Fi', 'Attached Bath', 'AC', 'Study Desk'],
      bestMatch: false,
      owner: {
        name: 'Deepak Joshi',
        role: 'Hostel Manager',
        phone: '+91 98220 *****',
        whatsapp: '+91 98220 *****',
        responseRate: 'Under 30 mins'
      }
    }
  ];

  let currentCollege = 'UC Berkeley';

  const gridContainer = document.getElementById('roomsGrid');
  const campusLabel = document.getElementById('roomsCampusLabel');
  const headerCount = document.getElementById('roomsHeaderCount');
  const resetBtn = document.getElementById('roomsResetBtn');

  const filterRoomType = document.getElementById('filterRoomType');
  const filterDistance = document.getElementById('filterDistance');
  const filterAmenity = document.getElementById('filterAmenity');

  const budgetRangeInput = document.getElementById('budgetRangeInput');
  const budgetRangeDisplay = document.getElementById('budgetRangeDisplay');
  const presetChips = document.querySelectorAll('.rooms-preset-chip');

  function getFeatureBadge(facility) {
    const fLower = facility.toLowerCase();
    if (fLower.includes('ac')) return { icon: '❄️', label: 'AC', className: 'ac' };
    if (fLower.includes('bath')) return { icon: '🚿', label: 'Attached Bath', className: 'bath' };
    if (fLower.includes('wi-fi') || fLower.includes('wifi')) return { icon: '📶', label: 'Wi-Fi', className: 'wifi' };
    if (fLower.includes('power') || fLower.includes('backup')) return { icon: '⚡', label: 'Power Backup', className: 'backup' };
    if (fLower.includes('desk') || fLower.includes('study')) return { icon: '📚', label: 'Study Desk', className: 'desk' };
    if (fLower.includes('food') || fLower.includes('mess')) return { icon: '🍽️', label: 'Mess Nearby', className: 'bath' };
    if (fLower.includes('laundry')) return { icon: '🧺', label: 'Laundry', className: 'wifi' };
    if (fLower.includes('furnished')) return { icon: '🪑', label: 'Furnished', className: 'ac' };
    return { icon: '✨', label: facility, className: '' };
  }

  function init() {
    // 1. Read college context
    const stored = sessionStorage.getItem('relocmate_student_requirements');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.college) currentCollege = parsed.college;
      } catch (e) {
        console.warn('Could not read session', e);
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const queryCollege = urlParams.get('college');
    if (queryCollege) currentCollege = decodeURIComponent(queryCollege);

    if (campusLabel) {
      campusLabel.textContent = `Verified student accommodations & stays near ${currentCollege}`;
    }

    // 2. Setup Filters
    setupFilters();

    // 3. Render
    applyFilter();
  }

  function renderRooms(items) {
    if (!gridContainer) return;

    if (items.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-12) var(--space-4); background: var(--color-white); border-radius: var(--radius-xl); border: 1px dashed var(--slate-300);">
          <p style="color: var(--slate-800); font-size: var(--font-size-base); font-weight: 600; margin-bottom: var(--space-2);">
            No rooms match your specific criteria.
          </p>
          <p style="color: var(--slate-500); font-size: var(--font-size-sm); margin-bottom: var(--space-4);">
            Try adjusting your budget slider, distance, or amenity filters to see more available options.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.resetRoomsFilters()">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = items.map(room => {
      // Highlighted features chips
      const chipsHtml = (room.facilities || []).slice(0, 3).map(f => {
        const badge = getFeatureBadge(f);
        return `<span class="room-feature-chip ${badge.className}" title="${f}"><span>${badge.icon}</span><span>${badge.label}</span></span>`;
      }).join('');

      const moreCount = (room.facilities && room.facilities.length > 3)
        ? `<span class="room-feature-chip more">+${room.facilities.length - 3} more</span>`
        : '';

      const ownerHtml = room.owner ? `
        <div class="room-card-owner-strip" onclick="event.stopPropagation()">
          <div class="room-card-owner-left">
            <div class="room-card-owner-avatar">${room.owner.name.charAt(0)}</div>
            <div class="room-card-owner-meta">
              <span class="room-card-owner-name">${room.owner.name}</span>
              <span class="room-card-owner-label">Owner • ${room.owner.phone}</span>
            </div>
          </div>
          <a href="tel:${room.owner.phone}" class="btn-card-call-owner" title="Direct call to ${room.owner.name}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>Call</span>
          </a>
        </div>
      ` : '';

      return `
      <div class="room-catalog-card" onclick="openRoomDetails('${room.id}')">
        <div class="room-catalog-img-wrapper">
          <img src="${room.image}" alt="${room.name}" class="room-catalog-img">
          
          <div style="position: absolute; top: var(--space-3); left: var(--space-3); display: flex; gap: var(--space-1-5); z-index: 2;">
            <span class="badge badge-success"><span class="badge-dot"></span> ${room.type} Room</span>
            ${room.bestMatch ? '<span class="badge badge-primary">★ Best Match</span>' : ''}
          </div>
        </div>

        <div class="room-catalog-body">
          <h2 class="room-catalog-name">${room.name}</h2>

          <div class="room-features-row" aria-label="Highlighted Room Features">
            ${chipsHtml}
            ${moreCount}
          </div>

          <div class="room-catalog-meta-row">
            <span class="room-catalog-price">${room.priceINR}</span>
            <span class="room-catalog-dist">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
              <span>${room.distance} to Campus</span>
            </span>
          </div>

          ${ownerHtml}

          <div class="room-card-footer-btns">
            <button type="button" class="btn-room-details" onclick="event.stopPropagation(); openRoomDetails('${room.id}')">
              <span>View Full Details & Map</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
    }).join('');
  }

  window.openRoomDetails = function (roomId) {
    window.location.href = `room-details.html?college=${encodeURIComponent(currentCollege)}&id=${encodeURIComponent(roomId)}`;
  };

  window.resetRoomsFilters = function () {
    if (filterRoomType) filterRoomType.value = 'all';
    if (filterDistance) filterDistance.value = 'all';
    if (filterAmenity) filterAmenity.value = 'all';
    if (budgetRangeInput) {
      budgetRangeInput.value = '15000';
    }
    updateSliderVisual(15000);
    applyFilter();
  };

  function updateSliderVisual(val) {
    const pct = Math.min(100, Math.max(0, ((val - 4000) / (15000 - 4000)) * 100));
    if (budgetRangeInput) {
      budgetRangeInput.style.setProperty('--slider-pct', `${pct}%`);
    }
    if (budgetRangeDisplay) {
      budgetRangeDisplay.textContent = val >= 15000 ? 'Any Budget (Up to ₹15,000+)' : `Up to ₹${parseInt(val, 10).toLocaleString('en-IN')}/mo`;
    }
    // Update active preset chip
    presetChips.forEach(chip => {
      const pVal = parseInt(chip.getAttribute('data-preset'), 10);
      chip.classList.toggle('active', pVal === parseInt(val, 10));
    });
  }

  function setupFilters() {
    [filterRoomType, filterDistance, filterAmenity].forEach(el => {
      if (el) {
        el.addEventListener('change', applyFilter);
      }
    });

    if (budgetRangeInput) {
      budgetRangeInput.addEventListener('input', (e) => {
        updateSliderVisual(parseInt(e.target.value, 10));
        applyFilter();
      });
    }

    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const pVal = parseInt(chip.getAttribute('data-preset'), 10);
        if (budgetRangeInput) {
          budgetRangeInput.value = pVal;
        }
        updateSliderVisual(pVal);
        applyFilter();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', window.resetRoomsFilters);
    }
  }

  function applyFilter() {
    const valType = filterRoomType ? filterRoomType.value : 'all';
    const valDist = filterDistance ? filterDistance.value : 'all';
    const valAmenity = filterAmenity ? filterAmenity.value : 'all';
    const valBudget = budgetRangeInput ? parseInt(budgetRangeInput.value, 10) : 15000;

    const isFiltered = valType !== 'all' || valBudget < 15000 || valDist !== 'all' || valAmenity !== 'all';

    if (resetBtn) {
      resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';
    }

    const filtered = roomsData.filter(room => {
      // 1. Room Type
      if (valType !== 'all' && room.type.toLowerCase() !== valType.toLowerCase()) {
        return false;
      }
      // 2. Budget via range strip
      if (valBudget < 15000 && room.numericPrice > valBudget) {
        return false;
      }
      // 3. Distance
      if (valDist !== 'all') {
        const maxDist = parseFloat(valDist);
        const roomDist = parseFloat(room.distance);
        if (roomDist > maxDist) return false;
      }
      // 4. Amenity
      if (valAmenity !== 'all') {
        if (!room.facilities || !room.facilities.some(f => f.toLowerCase() === valAmenity.toLowerCase())) {
          return false;
        }
      }
      return true;
    });

    if (headerCount) {
      headerCount.innerHTML = `Showing <strong>${filtered.length}</strong> of ${roomsData.length} verified stays`;
    }

    renderRooms(filtered);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
