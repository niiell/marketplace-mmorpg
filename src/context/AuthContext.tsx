"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      console.log("[AuthContext] Attempting sign in...");
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("[AuthContext] Sign in error:", signInError);
        setError(signInError);
        return { success: false, error: signInError };
      }

      if (!data?.session) {
        const noSessionError = new Error("No session after login");
        console.error("[AuthContext] Sign in error:", noSessionError);
        setError(noSessionError);
        return { success: false, error: noSessionError };
      }

      console.log("[AuthContext] Sign in successful, updating state...");
      setSession(data.session);
      setUser(data.user);
      setError(null);
      return { success: true };
    } catch (error: any) {
      console.error("[AuthContext] Unexpected sign in error:", error);
      setError(error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error);
        throw error;
      }
      setSession(null);
      setUser(null);
    } catch (error: any) {
      console.error("[AuthContext] Sign out error:", error);
      setError(error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("[AuthContext] Initializing auth state...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error("[AuthContext] Initial session error:", error);
          setError(error);
        } else {
          console.log("[AuthContext] Initial session:", session ? "Found" : "None");
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("[AuthContext] Auth initialization error:", error);
        if (mounted) {
          setError(error as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.debug("[AuthContext] Auth state changed:", { event, sessionExists: !!session });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}