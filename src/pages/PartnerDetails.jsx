import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRelocation } from '../context/RelocationContext';
import { roommatesData, vacantSharedRooms } from '../data/mockData';

export default function PartnerDetails() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useRelocation();

  // Check if partnerId corresponds to a student looking for a room or a vacant shared room
  const student = roommatesData.find(p => p.id === partnerId);
  const vacantRoom = vacantSharedRooms.find(r => r.id === partnerId);

  // If neither found, fallback to first student
  const item = student || vacantRoom || roommatesData[0];
  const isVacantRoom = Boolean(vacantRoom);

  const handleConnect = () => {
    if (isVacantRoom) {
      showToast('Inquiry Sent', `Connected with current occupant (${vacantRoom.currentOccupant}).`, 'success');
    } else {
      showToast('Connect Request Sent', `Message sent to ${student?.name || 'student'}.`, 'success');
    }
  };

  return (
    <main className="main-content">
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
        {/* Back to /roommates */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/roommates')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Room Partner Finder</span>
          </button>
        </div>

        {/* Vacant Shared Room Details */}
        {isVacantRoom ? (
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid var(--slate-200)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '200px' }}>
              <img
                src={vacantRoom.image}
                alt={vacantRoom.room}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  {vacantRoom.sharingType}
                </span>
              </div>
            </div>

            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 var(--space-1)', color: 'var(--slate-900)' }}>
                  {vacantRoom.room}
                </h1>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)', fontWeight: 600 }}>
                  Vacant Shared Room • Near {vacantRoom.college}
                </div>
              </div>

              {/* Attributes Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--space-3)',
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 700, letterSpacing: '0.04em' }}>
                    Rent
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                    {vacantRoom.rent}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 700, letterSpacing: '0.04em' }}>
                    Sharing Type
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                    {vacantRoom.sharingType}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 700, letterSpacing: '0.04em' }}>
                    Current Occupant
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                    {vacantRoom.currentOccupant}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 700, letterSpacing: '0.04em' }}>
                    Location
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                    {vacantRoom.location}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 'var(--space-2)' }}>
                  Room Features
                </div>
                <div className="partner-tags-row">
                  {vacantRoom.tags.map((tag, idx) => {
                    let icon = '✓';
                    const lower = tag.toLowerCase();
                    if (lower.includes('bath') || lower.includes('washroom')) icon = '🚿';
                    else if (lower.includes('wi-fi') || lower.includes('wifi')) icon = '📶';
                    else if (lower.includes('furnish')) icon = '🛋️';
                    else if (lower.includes('balcony') || lower.includes('garden')) icon = '🌿';
                    else if (lower.includes('ac')) icon = '❄️';
                    else if (lower.includes('cook') || lower.includes('kitchen')) icon = '🍳';
                    else if (lower.includes('backup') || lower.includes('power')) icon = '⚡';
                    else if (lower.includes('desk') || lower.includes('study')) icon = '📚';

                    return (
                      <span key={idx} className="partner-tag tag-amenity">
                        <span>{icon}</span>
                        <span>{tag}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                className="btn btn-primary btn-md"
                style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
                onClick={handleConnect}
              >
                <span>Contact Occupant</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* Student Looking For a Room Details */
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid var(--slate-200)',
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-5)'
            }}
          >
            {/* Student Header: Avatar, Name, College */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div
                className="partner-avatar"
                style={{
                  width: '56px',
                  height: '56px',
                  fontSize: '1.25rem',
                  background: student.avatarBg
                }}
              >
                {student.initials}
              </div>
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 2px', color: 'var(--slate-900)' }}>
                  {student.name}
                </h1>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--slate-500)', fontWeight: 600 }}>
                  {student.college} • Looking for a Room
                </span>
              </div>
            </div>

            {/* Metrics: Budget & Distance */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-3)',
                background: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 700, letterSpacing: '0.04em' }}>
                  Budget
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                  {student.budgetINR}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 700, letterSpacing: '0.04em' }}>
                  Preferred Distance
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                  {student.distance}
                </div>
              </div>
            </div>

            {/* Basic Tags */}
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 'var(--space-2)' }}>
                Preferences
              </div>
              <div className="partner-tags-row">
                {student.tags.map((tag, idx) => {
                  let tagClass = 'partner-tag';
                  let icon = '';
                  const lower = tag.toLowerCase();
                  if (lower.includes('non-veg')) { tagClass += ' tag-nonveg'; icon = '🍗'; }
                  else if (lower.includes('veg')) { tagClass += ' tag-veg'; icon = '🌱'; }
                  else if (lower.includes('quiet')) { tagClass += ' tag-quiet'; icon = '🤫'; }
                  else if (lower.includes('early')) { tagClass += ' tag-early'; icon = '🌅'; }
                  else if (lower.includes('shared')) { tagClass += ' tag-shared'; icon = '👥'; }
                  else if (lower.includes('night')) { tagClass += ' tag-night'; icon = '🌙'; }
                  else if (lower.includes('smoker')) { tagClass += ' tag-veg'; icon = '🚭'; }
                  else if (lower.includes('food')) { tagClass += ' tag-early'; icon = '🍽️'; }
                  else if (lower.includes('single')) { tagClass += ' tag-shared'; icon = '🛏️'; }

                  return (
                    <span key={idx} className={tagClass}>
                      {icon && <span style={{ fontSize: '0.8rem' }}>{icon}</span>}
                      <span>{tag}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Connect Action */}
            <button
              type="button"
              className="btn btn-primary btn-md"
              style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
              onClick={handleConnect}
            >
              <span>Connect</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
