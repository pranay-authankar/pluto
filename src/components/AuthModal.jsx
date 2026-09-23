import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRelocation } from '../context/RelocationContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    login,
    register,
    isFirebaseConfigured
  } = useAuth();

  const { showToast } = useRelocation() || {};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isAuthModalOpen) {
      setLocalError('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [isAuthModalOpen, authModalMode]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Client-side basic validation
    if (!email || !email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }

    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setLocalError('Passwords do not match. Please re-check.');
      return;
    }

    setSubmitting(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          if (showToast) {
            showToast('Welcome Back!', `Signed in as ${email.trim()}`, 'success');
          }
          closeAuthModal();
        } else {
          setLocalError(res.error || 'Failed to sign in. Please verify your credentials.');
        }
      } else {
        const res = await register('', email, password);
        if (res.success) {
          if (showToast) {
            showToast('Account Created!', `Welcome to Pluto, ${email.trim()}`, 'success');
          }
          closeAuthModal();
        } else {
          setLocalError(res.error || 'Failed to create account. Please try again.');
        }
      }
    } catch (err) {
      setLocalError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="auth-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'authFadeIn 0.2s ease-out'
      }}
    >
      <div
        className="auth-modal-card"
        style={{
          backgroundColor: 'var(--color-white, #ffffff)',
          borderRadius: 'var(--radius-xl, 16px)',
          width: '100%',
          maxWidth: '440px',
          boxShadow: 'var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
          border: '1px solid var(--slate-200, #e2e8f0)',
          overflow: 'hidden',
          animation: 'authSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.5rem 1.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--slate-100, #f1f5f9)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-gradient, linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 700
              }}
            >
              P
            </div>
            <div>
              <h2
                id="auth-modal-title"
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--slate-900, #0f172a)',
                  lineHeight: 1.2
                }}
              >
                {isLogin ? 'Sign in to Pluto' : 'Join Pluto'}
              </h2>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '0.825rem',
                  color: 'var(--slate-500, #64748b)'
                }}
              >
                {isLogin
                  ? 'Access your saved relocations and college preferences'
                  : 'Start your seamless campus relocation journey'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="btn-icon"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--slate-400, #94a3b8)',
              padding: '0.35rem',
              borderRadius: '8px',
              fontSize: '1.2rem',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Toggle (Sign In / Register) */}
        <div
          style={{
            display: 'flex',
            margin: '1rem 1.5rem 0',
            background: 'var(--slate-100, #f1f5f9)',
            borderRadius: '10px',
            padding: '4px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setLocalError('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              background: isLogin ? 'var(--color-white, #ffffff)' : 'transparent',
              color: isLogin ? 'var(--primary-600, #4f46e5)' : 'var(--slate-500, #64748b)',
              boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setLocalError('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              background: !isLogin ? 'var(--color-white, #ffffff)' : 'transparent',
              color: !isLogin ? 'var(--primary-600, #4f46e5)' : 'var(--slate-500, #64748b)',
              boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Firebase Config Notice (if not configured yet) */}
        {!isFirebaseConfigured && (
          <div
            style={{
              margin: '1rem 1.5rem 0',
              padding: '0.75rem 1rem',
              background: 'var(--warning-50, #fffbeb)',
              border: '1px solid #fde68a',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            <div style={{ fontSize: '0.825rem', color: '#92400e', lineHeight: 1.4 }}>
              <strong>Firebase Setup Note:</strong> Add your Firebase configuration keys to <code>.env</code> to connect directly to your live Firebase project.
            </div>
          </div>
        )}

        {/* Error Alert */}
        {localError && (
          <div
            style={{
              margin: '1rem 1.5rem 0',
              padding: '0.75rem 1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
            role="alert"
          >
            <span style={{ color: '#dc2626', fontSize: '1.1rem' }}>⚠️</span>
            <div style={{ fontSize: '0.85rem', color: '#b91c1c', fontWeight: 500 }}>
              {localError}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
          {/* Email Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="auth-email"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--slate-700, #334155)',
                marginBottom: '0.35rem'
              }}
            >
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              required
              autoFocus
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                fontSize: '0.9rem',
                border: '1px solid var(--slate-200, #e2e8f0)',
                borderRadius: '8px',
                background: 'var(--slate-50, #f8fafc)',
                outline: 'none',
                color: 'var(--slate-900, #0f172a)',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary-500, #6366f1)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--slate-200, #e2e8f0)')}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: isLogin ? '1.25rem' : '1rem' }}>
            <label
              htmlFor="auth-password"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--slate-700, #334155)',
                marginBottom: '0.35rem'
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.65rem 2.5rem 0.65rem 0.85rem',
                  fontSize: '0.9rem',
                  border: '1px solid var(--slate-200, #e2e8f0)',
                  borderRadius: '8px',
                  background: 'var(--slate-50, #f8fafc)',
                  outline: 'none',
                  color: 'var(--slate-900, #0f172a)',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease'
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary-500, #6366f1)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--slate-200, #e2e8f0)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--slate-400, #94a3b8)',
                  padding: '4px',
                  fontSize: '0.9rem'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400, #94a3b8)', display: 'block', marginTop: '3px' }}>
              {isLogin ? '' : 'Must be at least 6 characters'}
            </span>
          </div>

          {/* Confirm Password Field (Register Mode Only) */}
          {!isLogin && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="auth-confirm-password"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--slate-700, #334155)',
                  marginBottom: '0.35rem'
                }}
              >
                Confirm Password
              </label>
              <input
                id="auth-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.9rem',
                  border: '1px solid var(--slate-200, #e2e8f0)',
                  borderRadius: '8px',
                  background: 'var(--slate-50, #f8fafc)',
                  outline: 'none',
                  color: 'var(--slate-900, #0f172a)',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease'
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary-500, #6366f1)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--slate-200, #e2e8f0)')}
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
              padding: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: submitting ? 'wait' : 'pointer'
            }}
          >
            {submitting ? (
              <>
                <span
                  style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'authSpin 0.7s linear infinite'
                  }}
                />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Pluto Account'
            )}
          </button>

          {/* Footer note */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--slate-500, #64748b)' }}>
              {isLogin ? "Don't have an account yet? " : 'Already have an account? '}
            </span>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode(isLogin ? 'register' : 'login');
                setLocalError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-600, #4f46e5)',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Register now' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes authFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes authSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
