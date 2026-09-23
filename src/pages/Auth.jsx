import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRelocation } from '../context/RelocationContext';

export default function Auth() {
  const {
    user,
    loading,
    login,
    register,
    loginAsDemo,
    isFirebaseConfigured
  } = useAuth();
  const { showToast } = useRelocation() || {};
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('register'); // Default to register for new students, easy toggle to login
  const [studentNameInput, setStudentNameInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Destination after authentication
  const destination = location.state?.from?.pathname || '/';

  // If already authenticated, redirect straight to Home
  if (user && !loading) {
    return <Navigate to={destination} replace />;
  }

  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isLogin && (!studentNameInput || !studentNameInput.trim())) {
      setErrorMsg('Please enter your full name or student nickname.');
      return;
    }

    if (!email || !email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    setSubmitting(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          if (showToast) {
            showToast('Welcome Back!', `Signed in as ${res.studentName || email}`, 'success');
          }
          navigate(destination, { replace: true });
        } else {
          setErrorMsg(res.error || 'Failed to sign in. Please check your credentials.');
        }
      } else {
        const res = await register(studentNameInput, email, password);
        if (res.success) {
          if (showToast) {
            showToast('Account Created!', `Welcome to Pluto, ${res.studentName || 'Student'}!`, 'success');
          }
          navigate(destination, { replace: true });
        } else {
          setErrorMsg(res.error || 'Failed to create your account. Please try again.');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoAccess = () => {
    loginAsDemo();
    if (showToast) {
      showToast('Demo Access Granted', 'Exploring Pluto as Demo Account.', 'success');
    }
    navigate(destination, { replace: true });
  };

  return (
    <div
      className="auth-landing-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #eef2ff 0%, #f8fafc 60%, #f1f5f9 100%)',
        padding: '2rem 1.5rem',
        fontFamily: 'var(--font-family-sans, sans-serif)',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="auth-landing-container"
        style={{
          width: '100%',
          maxWidth: '1000px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}
      >
        {/* Left Column: Pluto Branding & Value Props */}
        <div className="auth-branding-section" style={{ padding: '1rem 0' }}>
          {/* Logo Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.45rem 1rem',
              background: 'var(--color-white, #fff)',
              borderRadius: '9999px',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.08)',
              border: '1px solid var(--primary-100, #e0e7ff)',
              marginBottom: '1.5rem'
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'var(--primary-gradient, linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="6"></circle>
                <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-25 12 12)"></ellipse>
              </svg>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-700, #4338ca)' }}>
              Pluto Campus Portal
            </span>
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--slate-900, #0f172a)',
              letterSpacing: '-0.03em',
              margin: '0 0 1rem'
            }}
          >
            Pluto — <span style={{ background: 'var(--primary-gradient, linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Away From Home.</span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: 'var(--slate-600, #475569)',
              margin: '0 0 2rem',
              maxWidth: '480px'
            }}
          >
            Your all-in-one student relocation and campus living companion. Secure your home away from home before classes start.
          </p>

          {/* Feature Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--primary-50, #eef2ff)',
                  color: 'var(--primary-600, #4f46e5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}
              >
                🏠
              </div>
              <span style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--slate-700, #334155)' }}>
                Verified Student Rooms, PGs & Hostels
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}
              >
                🍱
              </div>
              <span style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--slate-700, #334155)' }}>
                Healthy Mess & Home Tiffin Subscriptions
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}
              >
                🤝
              </div>
              <span style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--slate-700, #334155)' }}>
                Compatible Roommate & Batchmate Matching
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Authentication Card */}
        <div
          className="auth-card-wrapper"
          style={{
            background: 'var(--color-white, #ffffff)',
            borderRadius: 'var(--radius-xl, 20px)',
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px var(--slate-200, #e2e8f0)',
            padding: '2rem 2.25rem',
            boxSizing: 'border-box'
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'var(--slate-100, #f1f5f9)',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '1.75rem'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                border: 'none',
                borderRadius: '9px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                background: !isLogin ? '#ffffff' : 'transparent',
                color: !isLogin ? 'var(--primary-600, #4f46e5)' : 'var(--slate-500, #64748b)',
                boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.18s ease'
              }}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                border: 'none',
                borderRadius: '9px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                background: isLogin ? '#ffffff' : 'transparent',
                color: isLogin ? 'var(--primary-600, #4f46e5)' : 'var(--slate-500, #64748b)',
                boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.18s ease'
              }}
            >
              Sign In
            </button>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h2
              style={{
                margin: '0 0 0.35rem',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--slate-900, #0f172a)'
              }}
            >
              {isLogin ? 'Welcome back' : 'Get started with Pluto'}
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--slate-500, #64748b)' }}>
              {isLogin
                ? 'Sign in to access your saved college relocations'
                : 'Join thousands of students finding verified college housing'}
            </p>
          </div>

          {/* Missing Firebase Config Warning */}
          {!isFirebaseConfigured && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '0.75rem 0.85rem',
                background: 'var(--warning-50, #fffbeb)',
                border: '1px solid #fde68a',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}
            >
              <span>⚠️</span>
              <div style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.4 }}>
                <strong>Setup note:</strong> Please configure your Firebase credentials in <code>.env</code> to enable live authentication.
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMsg && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '0.75rem 0.85rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              role="alert"
            >
              <span style={{ color: '#dc2626' }}>⚠️</span>
              <span style={{ fontSize: '0.825rem', color: '#b91c1c', fontWeight: 500 }}>
                {errorMsg}
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Student Name (Register mode only, stored exclusively in client storage) */}
            {!isLogin && (
              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="reg-name"
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--slate-700, #334155)',
                    marginBottom: '0.35rem'
                  }}
                >
                  Student Name <span style={{ color: 'var(--primary-600)' }}>*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    fontSize: '0.9rem',
                    border: '1px solid var(--slate-200, #e2e8f0)',
                    borderRadius: '8px',
                    background: 'var(--slate-50, #f8fafc)',
                    outline: 'none',
                    color: 'var(--slate-900, #0f172a)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            {/* Email Address */}
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="auth-email-input"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--slate-700, #334155)',
                  marginBottom: '0.35rem'
                }}
              >
                Email Address <span style={{ color: 'var(--primary-600)' }}>*</span>
              </label>
              <input
                id="auth-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                required
                autoFocus={isLogin}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  fontSize: '0.9rem',
                  border: '1px solid var(--slate-200, #e2e8f0)',
                  borderRadius: '8px',
                  background: 'var(--slate-50, #f8fafc)',
                  outline: 'none',
                  color: 'var(--slate-900, #0f172a)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: isLogin ? '1.5rem' : '1rem' }}>
              <label
                htmlFor="auth-password-input"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--slate-700, #334155)',
                  marginBottom: '0.35rem'
                }}
              >
                Password <span style={{ color: 'var(--primary-600)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '0.7rem 2.5rem 0.7rem 0.85rem',
                    fontSize: '0.9rem',
                    border: '1px solid var(--slate-200, #e2e8f0)',
                    borderRadius: '8px',
                    background: 'var(--slate-50, #f8fafc)',
                    outline: 'none',
                    color: 'var(--slate-900, #0f172a)',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--slate-400, #94a3b8)',
                    padding: '4px',
                    fontSize: '0.95rem'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password (Register mode only) */}
            {!isLogin && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="auth-confirm-pw"
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--slate-700, #334155)',
                    marginBottom: '0.35rem'
                  }}
                >
                  Confirm Password <span style={{ color: 'var(--primary-600)' }}>*</span>
                </label>
                <input
                  id="auth-confirm-pw"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    fontSize: '0.9rem',
                    border: '1px solid var(--slate-200, #e2e8f0)',
                    borderRadius: '8px',
                    background: 'var(--slate-50, #f8fafc)',
                    outline: 'none',
                    color: 'var(--slate-900, #0f172a)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '0.975rem',
                fontWeight: 600,
                borderRadius: '8px',
                cursor: submitting ? 'wait' : 'pointer'
              }}
            >
              {submitting ? (
                <span>Please wait...</span>
              ) : isLogin ? (
                'Sign In to Pluto'
              ) : (
                'Create Pluto Account'
              )}
            </button>

            {/* Quick Demo Access Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--slate-200, #e2e8f0)' }}></div>
              <span style={{ fontSize: '0.76rem', color: 'var(--slate-400, #94a3b8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                or bypass login
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--slate-200, #e2e8f0)' }}></div>
            </div>

            {/* View as Demo Account Button */}
            <button
              type="button"
              id="view-as-demo-account-btn"
              onClick={handleDemoAccess}
              className="btn btn-secondary"
              style={{
                width: '100%',
                padding: '0.78rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'var(--primary-50, #eef2ff)',
                border: '1.5px dashed var(--primary-300, #a5b4fc)',
                color: 'var(--primary-700, #4338ca)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              aria-label="View as Demo Account"
            >
              <span style={{ fontSize: '1.05rem' }}>⚡</span>
              <span>View as Demo Account</span>
            </button>
          </form>

          {/* Toggle footer */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--slate-500, #64748b)' }}>
            {isLogin ? "New to Pluto? " : 'Already registered? '}
            <button
              type="button"
              onClick={() => {
                setMode(isLogin ? 'register' : 'login');
                setErrorMsg('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-600, #4f46e5)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Create an account' : 'Sign in here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
