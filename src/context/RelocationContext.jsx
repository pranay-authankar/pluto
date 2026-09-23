import React, { createContext, useContext, useState, useEffect } from 'react';

export const getCollegeId = (name) => {
  if (!name) return '';
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

const RelocationContext = createContext();

export function RelocationProvider({ children }) {
  const [college, setCollege] = useState(() => {
    try {
      const stored = sessionStorage.getItem('relocmate_student_requirements');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.college && parsed.college !== 'UC Berkeley') return parsed.college;
      }
    } catch (e) {}
    return '';
  });

  const collegeId = getCollegeId(college);

  const [requirements, setRequirements] = useState(() => {
    try {
      const stored = sessionStorage.getItem('relocmate_student_requirements');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return {
      college: '',
      budget: { currency: 'INR', maxMonthly: 8500 },
      preferences: {
        roomType: 'single',
        food: 'any',
        maxDistanceKm: 3,
        matchRoommate: true
      }
    };
  });

  const [toasts, setToasts] = useState([]);

  // Save changes to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('relocmate_student_requirements', JSON.stringify({
        ...requirements,
        college
      }));
    } catch (e) {}
  }, [college, requirements]);

  const showToast = (title, message = '', type = 'primary') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const updateRequirements = (newReqs) => {
    setRequirements(newReqs);
    if (newReqs.college) {
      setCollege(newReqs.college);
    }
  };

  return (
    <RelocationContext.Provider value={{ college, collegeId, setCollege, requirements, updateRequirements, showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type} show`}>
            <div className="toast-icon">
              {t.type === 'success' ? '✓' : '⚡'}
            </div>
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              {t.message && <div className="toast-message">{t.message}</div>}
            </div>
          </div>
        ))}
      </div>
    </RelocationContext.Provider>
  );
}

export function useRelocation() {
  return useContext(RelocationContext);
}
