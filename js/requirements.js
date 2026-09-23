/**
 * STUDENT RELOCATION PLATFORM - REQUIREMENTS CONTROLLER
 * Reactive demand form state, sliders with "Any" toggles, and strict criteria syncing
 */

(function () {
  'use strict';

  // Read stored college from Home / session
  let savedCollege = 'IIT Bombay';
  try {
    const stored = sessionStorage.getItem('relocmate_student_requirements');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.college) savedCollege = parsed.college;
    }
  } catch (e) {}

  const urlParams = new URLSearchParams(window.location.search);
  const queryCollege = urlParams.get('college');
  if (queryCollege) {
    savedCollege = decodeURIComponent(queryCollege);
  }

  const state = {
    college: savedCollege,
    maxRent: 8500,
    isRentAny: false,
    room: 'any',
    food: 'any',
    partner: 'none',
    maxDist: 3.0,
    isDistAny: false
  };

  // DOM Elements
  const collegeActiveName = document.getElementById('collegeActiveName');
  const collegeStatusCard = document.getElementById('collegeStatusCard');
  const collegeInputBox = document.getElementById('collegeInputBox');
  const collegeInput = document.getElementById('collegeInput');
  const btnChangeCollege = document.getElementById('btnChangeCollege');
  const btnLockCollege = document.getElementById('btnLockCollege');

  const rentRange = document.getElementById('rentRange');
  const rentAmountNum = document.getElementById('rentAmountNum');
  const rentPillDisplay = document.getElementById('rentPillDisplay');
  const rentBigVal = document.getElementById('rentBigVal');
  const rentControlBox = document.getElementById('rentControlBox');
  const toggleRentAny = document.getElementById('toggleRentAny');

  const distRange = document.getElementById('distRange');
  const distAmountNum = document.getElementById('distAmountNum');
  const distPillDisplay = document.getElementById('distPillDisplay');
  const distBigVal = document.getElementById('distBigVal');
  const distControlBox = document.getElementById('distControlBox');
  const toggleDistAny = document.getElementById('toggleDistAny');

  const previewCampusName = document.getElementById('previewCampusName');
  const previewRadar = document.getElementById('previewRadar');
  const chipCollege = document.getElementById('chipCollege');
  const chipRent = document.getElementById('chipRent');
  const chipRoom = document.getElementById('chipRoom');
  const chipFood = document.getElementById('chipFood');
  const chipPartner = document.getElementById('chipPartner');
  const chipDist = document.getElementById('chipDist');

  const requirementsForm = document.getElementById('requirementsForm');

  function init() {
    updateCollegeUI();
    setupCollegeControls();
    setupRentControls();
    setupDistanceControls();
    setupChoiceCards();
    updateSummaryChips();

    if (requirementsForm) {
      requirementsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveAndProceed();
      });
    }
  }

  function updateCollegeUI() {
    if (collegeActiveName) collegeActiveName.textContent = state.college;
    if (previewCampusName) previewCampusName.textContent = state.college;
    if (chipCollege) chipCollege.textContent = `📍 ${state.college}`;
    if (collegeInput) collegeInput.value = state.college;
  }

  function setupCollegeControls() {
    if (btnChangeCollege) {
      btnChangeCollege.addEventListener('click', () => {
        collegeInputBox.style.display = 'block';
        collegeStatusCard.style.display = 'none';
        collegeInput.focus();
      });
    }

    if (btnLockCollege) {
      btnLockCollege.addEventListener('click', () => {
        const val = collegeInput.value.trim();
        if (val) {
          state.college = val;
          updateCollegeUI();
        }
        collegeInputBox.style.display = 'none';
        collegeStatusCard.style.display = 'flex';
      });
    }
  }

  function setupRentControls() {
    function updateRentSliderTrack() {
      const pct = ((state.maxRent - 3000) / (20000 - 3000)) * 100;
      rentRange.style.background = state.isRentAny
        ? 'var(--slate-200)'
        : `linear-gradient(to right, var(--primary-600) 0%, var(--primary-600) ${pct}%, var(--slate-200) ${pct}%, var(--slate-200) 100%)`;
    }

    if (rentRange) {
      rentRange.addEventListener('input', (e) => {
        state.maxRent = Number(e.target.value);
        if (state.isRentAny) {
          state.isRentAny = false;
          toggleRentAny.classList.remove('active');
          toggleRentAny.innerHTML = '<span>Any / Not Specified</span>';
          rentControlBox.classList.remove('disabled');
          rentRange.disabled = false;
        }
        rentAmountNum.textContent = `₹${state.maxRent.toLocaleString()}`;
        rentPillDisplay.textContent = `Up to ₹${state.maxRent.toLocaleString()}/mo`;
        updateRentSliderTrack();
        updateSummaryChips();
      });
      updateRentSliderTrack();
    }

    if (toggleRentAny) {
      toggleRentAny.addEventListener('click', () => {
        state.isRentAny = !state.isRentAny;
        if (state.isRentAny) {
          toggleRentAny.classList.add('active');
          toggleRentAny.innerHTML = '<span>✓ Any Rent</span>';
          rentControlBox.classList.add('disabled');
          rentRange.disabled = true;
          rentBigVal.innerHTML = '<span class="dimmed">Any / Not Specified</span>';
          rentPillDisplay.textContent = 'Any / Not Specified';
        } else {
          toggleRentAny.classList.remove('active');
          toggleRentAny.innerHTML = '<span>Any / Not Specified</span>';
          rentControlBox.classList.remove('disabled');
          rentRange.disabled = false;
          rentBigVal.innerHTML = `<span>₹${state.maxRent.toLocaleString()}</span> <span style="font-size: var(--font-size-xs); color: var(--slate-500); font-weight: 500;">/month</span>`;
          rentPillDisplay.textContent = `Up to ₹${state.maxRent.toLocaleString()}/mo`;
        }
        updateRentSliderTrack();
        updateSummaryChips();
      });
    }
  }

  function setupDistanceControls() {
    function updateDistSliderTrack() {
      const pct = ((state.maxDist - 0.5) / (10 - 0.5)) * 100;
      distRange.style.background = state.isDistAny
        ? 'var(--slate-200)'
        : `linear-gradient(to right, var(--primary-600) 0%, var(--primary-600) ${pct}%, var(--slate-200) ${pct}%, var(--slate-200) 100%)`;
    }

    if (distRange) {
      distRange.addEventListener('input', (e) => {
        state.maxDist = Number(e.target.value);
        if (state.isDistAny) {
          state.isDistAny = false;
          toggleDistAny.classList.remove('active');
          toggleDistAny.innerHTML = '<span>Any</span>';
          distControlBox.classList.remove('disabled');
          distRange.disabled = false;
        }
        distAmountNum.textContent = state.maxDist.toFixed(1);
        distPillDisplay.textContent = `Within ${state.maxDist.toFixed(1)} km`;
        updateDistSliderTrack();
        updateSummaryChips();
      });
      updateDistSliderTrack();
    }

    if (toggleDistAny) {
      toggleDistAny.addEventListener('click', () => {
        state.isDistAny = !state.isDistAny;
        if (state.isDistAny) {
          toggleDistAny.classList.add('active');
          toggleDistAny.innerHTML = '<span>✓ Any Distance</span>';
          distControlBox.classList.add('disabled');
          distRange.disabled = true;
          distBigVal.innerHTML = '<span class="dimmed">Any Distance</span>';
          distPillDisplay.textContent = 'Any Radius';
        } else {
          toggleDistAny.classList.remove('active');
          toggleDistAny.innerHTML = '<span>Any</span>';
          distControlBox.classList.remove('disabled');
          distRange.disabled = false;
          distBigVal.innerHTML = `<span>${state.maxDist.toFixed(1)}</span> <span style="font-size: var(--font-size-xs); color: var(--slate-500); font-weight: 500;">km from campus</span>`;
          distPillDisplay.textContent = `Within ${state.maxDist.toFixed(1)} km`;
        }
        updateDistSliderTrack();
        updateSummaryChips();
      });
    }
  }

  function setupChoiceCards() {
    document.querySelectorAll('.choice-card').forEach((card) => {
      card.addEventListener('click', () => {
        const group = card.getAttribute('data-group');
        const value = card.getAttribute('data-value');

        // Deselect other cards in same group
        document.querySelectorAll(`.choice-card[data-group="${group}"]`).forEach((c) => {
          c.classList.remove('selected');
        });
        card.classList.add('selected');

        if (group === 'room') {
          state.room = value;
          const displayEl = document.getElementById('roomPillDisplay');
          if (displayEl) displayEl.textContent = value.charAt(0).toUpperCase() + value.slice(1);
        } else if (group === 'food') {
          state.food = value;
          const displayEl = document.getElementById('foodPillDisplay');
          if (displayEl) {
            displayEl.textContent = value === 'veg' ? 'Veg' : value === 'non-veg' ? 'Non-Veg' : value === 'none' ? 'No Need' : 'Any';
          }
        } else if (group === 'partner') {
          state.partner = value;
          const displayEl = document.getElementById('partnerPillDisplay');
          if (displayEl) {
            displayEl.textContent = value === 'male' ? 'Male' : value === 'female' ? 'Female' : 'No Need';
          }
        }

        updateSummaryChips();
      });
    });
  }

  function updateSummaryChips() {
    if (chipRent) {
      chipRent.textContent = state.isRentAny ? '💵 Rent: Any' : `💵 Max Rent: ₹${state.maxRent.toLocaleString()}`;
    }
    if (chipRoom) {
      chipRoom.textContent = `🛏️ Room: ${state.room.toUpperCase()}`;
    }
    if (chipFood) {
      if (state.food === 'none') {
        chipFood.textContent = '🍱 Food: No Need (Hidden)';
        chipFood.style.color = '#dc2626';
        chipFood.style.background = '#fee2e2';
      } else {
        chipFood.textContent = `🍱 Food: ${state.food === 'veg' ? 'Veg Only' : state.food === 'non-veg' ? 'Non-Veg' : 'Any'}`;
        chipFood.style.color = '';
        chipFood.style.background = '';
      }
    }
    if (chipPartner) {
      if (state.partner === 'none') {
        chipPartner.textContent = '🤝 Partner: No Need (Hidden)';
        chipPartner.style.color = '#dc2626';
        chipPartner.style.background = '#fee2e2';
      } else {
        chipPartner.textContent = `🤝 Partner: ${state.partner.charAt(0).toUpperCase() + state.partner.slice(1)} Only`;
        chipPartner.style.color = '';
        chipPartner.style.background = '';
      }
    }
    if (chipDist) {
      chipDist.textContent = state.isDistAny ? '🚶 Radius: Any' : `🚶 Radius: ≤ ${state.maxDist.toFixed(1)} km`;
    }

    if (previewRadar) {
      const radiusPx = state.isDistAny ? 200 : Math.min(200, Math.max(60, state.maxDist * 20));
      previewRadar.style.width = `${radiusPx}px`;
      previewRadar.style.height = `${radiusPx}px`;
    }
  }

  function saveAndProceed() {
    const payload = {
      college: state.college,
      budget: {
        currency: 'INR',
        maxMonthly: state.isRentAny ? null : state.maxRent,
        isAny: state.isRentAny,
        amount: state.isRentAny ? 20000 : state.maxRent,
        formatted: state.isRentAny ? 'Any / Not Specified' : `₹${state.maxRent.toLocaleString()}/mo`
      },
      preferences: {
        maxRent: state.isRentAny ? 'any' : state.maxRent,
        isRentAny: state.isRentAny,
        roomType: state.room,
        foodService: state.food,
        roomPartner: state.partner,
        maxDistance: state.isDistAny ? 'any' : state.maxDist,
        isDistanceAny: state.isDistAny,
        room: state.room,
        food: state.food,
        roommateGender: state.partner,
        maxDistanceKm: state.isDistAny ? 999 : state.maxDist,
        matchRoommate: state.partner !== 'none'
      }
    };

    try {
      sessionStorage.setItem('relocmate_student_requirements', JSON.stringify(payload));
    } catch (e) {}

    window.location.href = 'dashboard.html';
  }

  // Self-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
