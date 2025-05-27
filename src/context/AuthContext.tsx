"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  error: null,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError);
        return { success: false, error: signInError };
      }

      if (!data?.session) {
        const noSessionError = new Error("No session after login");
        setError(noSessionError);
        return { success: false, error: noSessionError };
      }

      return { success: true };
    } catch (error: any) {
      setError(error);
      return { success: false, error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error);
        throw error;
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          setError(error);
        } else {
          if (session?.user?.id !== user?.id) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }
      } catch (error) {
        if (mounted) {
          setError(error as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        if (session?.user?.id !== user?.id) {
          setSession(session);
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user?.id]); // Only re-run if user ID changes

  const value = {
    user,
    session,
    loading,
    error,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}