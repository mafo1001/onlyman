import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

/**
 * Auth provider that wraps the app.
 * When Supabase is configured, it handles real authentication.
 * When not configured, falls back to localStorage-based mock auth.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      // Fallback: load from localStorage (current behavior)
      try {
        const stored = JSON.parse(localStorage.getItem('om_currentUser') || 'null');
        setUser(stored);
      } catch {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    // Real Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  /**
   * Sign up with email + password
   */
  const signUp = async (email, password, metadata = {}) => {
    if (!configured) {
      // Fallback mock
      const mockUser = { id: `local-${Date.now()}`, email, ...metadata };
      setUser(mockUser);
      localStorage.setItem('om_currentUser', JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });

    if (error) return { user: null, error };
    return { user: data.user, error: null };
  };

  /**
   * Sign in with email + password
   */
  const signIn = async (email, password) => {
    if (!configured) {
      const mockUser = { id: `local-${Date.now()}`, email };
      setUser(mockUser);
      localStorage.setItem('om_currentUser', JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error };
    return { user: data.user, error: null };
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    if (!configured) {
      setUser(null);
      localStorage.removeItem('om_currentUser');
      localStorage.removeItem('om_signedUp');
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    configured,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
