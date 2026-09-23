/**
 * STUDENT RELOCATION PLATFORM - INTERACTIVE DESIGN SYSTEM ENGINE
 * Reusable components controller (Drawer, Tabs, Toasts, Modals, Shortcuts)
 */

(function () {
  'use strict';

  // ==========================================================================
  // Header Scroll State
  // ==========================================================================
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ==========================================================================
  // Mobile Drawer Controller
  // ==========================================================================
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  function openDrawer() {
    if (!drawerBackdrop) return;
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawerBackdrop) return;
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openDrawer);
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) {
        closeDrawer();
      }
    });
  }

  // ==========================================================================
  // Tab Switcher Controller
  // ==========================================================================
  document.querySelectorAll('[data-tabs]').forEach((tabContainer) => {
    const tabButtons = tabContainer.querySelectorAll('.tab-btn');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab-target');
        
        // Deactivate all buttons in this container
        tabButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle corresponding tab panes if defined
        if (targetId) {
          const tabPaneContainer = tabContainer.closest('.tabs-wrapper') || document;
          const panes = tabPaneContainer.querySelectorAll('.tab-pane');
          panes.forEach((pane) => {
            if (pane.id === targetId) {
              pane.classList.add('active');
            } else {
              pane.classList.remove('active');
            }
          });
        }
      });
    });
  });

  // ==========================================================================
  // Toast Notification System
  // ==========================================================================
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  window.showToast = function ({ title = 'Notification', message = '', type = 'primary', duration = 3500 }) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Choose icon according to type
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-600)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning-600)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="btn-icon btn-icon-sm" style="color: var(--slate-400); margin: -4px -4px 0 0;" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const closeBtn = toast.querySelector('button');
    const dismiss = () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    closeBtn.addEventListener('click', dismiss);
    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  };

  // ==========================================================================
  // Modal Controller Foundation
  // ==========================================================================
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Global ESC Key Listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      document.querySelectorAll('.modal-backdrop.open').forEach((m) => {
        m.classList.remove('open');
      });
      document.body.style.overflow = '';
    }
    // Quick search shortcut (Ctrl+K or Cmd+K)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('.search-pill input, #globalSearchInput');
      if (searchInput) {
        searchInput.focus();
        window.showToast({
          title: 'Quick Search Activated',
          message: 'Type any campus, dorm, or relocation question.',
          type: 'primary',
          duration: 2000
        });
      }
    }
  });

  // ==========================================================================
  // Interactive Token Swatch Copy-to-Clipboard
  // ==========================================================================
  document.querySelectorAll('[data-copy-token]').forEach((element) => {
    element.addEventListener('click', () => {
      const token = element.getAttribute('data-copy-token');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(token).then(() => {
          window.showToast({
            title: 'Copied Token',
            message: `CSS token <code>${token}</code> copied to clipboard!`,
            type: 'success',
            duration: 2500
          });
        });
      }
    });
  });

})();
