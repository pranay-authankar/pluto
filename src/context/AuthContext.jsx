import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext(null);

export const getFriendlyErrorMessage = (error) => {
  if (!error) return 'An error occurred';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account exists with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is disabled in your Firebase console.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
};

const getFallbackNameFromEmail = (email) => {
  if (!email) return 'Student';
  const username = email.split('@')[0] || 'Student';
  return username
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Student Name stored exclusively in browser localStorage (NOT in Firebase)
  const [studentName, setStudentName] = useState(() => {
    try {
      return localStorage.getItem('pluto_student_name') || '';
    } catch {
      return '';
    }
  });

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    // 1. Check if demo session is active
    try {
      const isDemo = localStorage.getItem('pluto_is_demo') === 'true';
      if (isDemo) {
        setUser({
          uid: 'demo-student-user',
          email: 'demo@pluto.app',
          isDemo: true,
          displayName: 'Hey there'
        });
        setStudentName('Hey there');
        setLoading(false);
        return;
      }
    } catch {}

    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    // Persist login session across page refreshes via onAuthStateChanged
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // If user switched to demo account, do not overwrite with null
      if (localStorage.getItem('pluto_is_demo') === 'true') {
        setLoading(false);
        return;
      }
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        try {
          const emailKey = `pluto_name_${currentUser.email.toLowerCase()}`;
          const savedName = localStorage.getItem(emailKey) || localStorage.getItem('pluto_student_name');
          if (savedName && savedName.trim()) {
            setStudentName(savedName.trim());
          } else {
            const fallback = getFallbackNameFromEmail(currentUser.email);
            setStudentName(fallback);
            localStorage.setItem(emailKey, fallback);
            localStorage.setItem('pluto_student_name', fallback);
          }
        } catch {}
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStudentName = (name) => {
    const cleanName = (name || '').trim();
    setStudentName(cleanName);
    try {
      localStorage.setItem('pluto_student_name', cleanName);
      if (user && user.email) {
        localStorage.setItem(`pluto_name_${user.email.toLowerCase()}`, cleanName);
      }
    } catch {}
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Register with student name, email and password
  // Student Name is stored exclusively in client storage, NOT in Firebase
  const register = async (name, email, password) => {
    if (!isFirebaseConfigured || !auth) {
      const errorMsg = 'Firebase configuration is missing. Please add your Firebase credentials to the .env file.';
      return { success: false, error: errorMsg };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      const cleanName = (name && name.trim()) ? name.trim() : getFallbackNameFromEmail(email);
      setStudentName(cleanName);
      try {
        localStorage.setItem('pluto_student_name', cleanName);
        localStorage.setItem(`pluto_name_${email.trim().toLowerCase()}`, cleanName);
      } catch {}

      return { success: true, user: userCredential.user, studentName: cleanName };
    } catch (error) {
      return { success: false, error: getFriendlyErrorMessage(error), rawError: error };
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      const errorMsg = 'Firebase configuration is missing. Please add your Firebase credentials to the .env file.';
      return { success: false, error: errorMsg };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      
      let resolvedName = '';
      try {
        const emailKey = `pluto_name_${email.trim().toLowerCase()}`;
        resolvedName = localStorage.getItem(emailKey) || localStorage.getItem('pluto_student_name');
        if (!resolvedName) {
          resolvedName = getFallbackNameFromEmail(email);
          localStorage.setItem(emailKey, resolvedName);
          localStorage.setItem('pluto_student_name', resolvedName);
        }
      } catch {
        resolvedName = getFallbackNameFromEmail(email);
      }
      setStudentName(resolvedName);

      return { success: true, user: userCredential.user, studentName: resolvedName };
    } catch (error) {
      return { success: false, error: getFriendlyErrorMessage(error), rawError: error };
    }
  };

  // Demo Account Bypass: Instant login as demo student with "Hey there"
  const loginAsDemo = () => {
    const demoUser = {
      uid: 'demo-student-user',
      email: 'demo@pluto.app',
      isDemo: true,
      displayName: 'Hey there'
    };
    try {
      localStorage.setItem('pluto_is_demo', 'true');
      localStorage.setItem('pluto_student_name', 'Hey there');
    } catch {}
    setUser(demoUser);
    setStudentName('Hey there');
    return { success: true, user: demoUser, studentName: 'Hey there' };
  };

  // Logout
  const logout = async () => {
    try {
      localStorage.removeItem('pluto_is_demo');
      localStorage.removeItem('pluto_student_name');
    } catch {}

    if (!auth) {
      setUser(null);
      setStudentName('');
      return { success: true };
    }

    try {
      await signOut(auth);
      setUser(null);
      setStudentName('');
      return { success: true };
    } catch (error) {
      return { success: false, error: getFriendlyErrorMessage(error) };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentName,
        updateStudentName,
        loading,
        isFirebaseConfigured,
        register,
        login,
        loginAsDemo,
        logout,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
