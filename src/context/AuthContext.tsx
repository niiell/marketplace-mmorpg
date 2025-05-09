"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error);
        throw error;
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setError(null);
    } catch (error: any) {
      console.error("[AuthContext] Sign in error:", error);
      setError(error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error);
        throw error;
      }
      setSession(null);
      setUser(null);
      setError(null);
    } catch (error: any) {
      console.error("[AuthContext] Sign out error:", error);
      setError(error);
    }
  };

  useEffect(() => {
    // Get initial session and user
    supabase.auth.getSession().then(({ data }) => {
      console.debug("[AuthContext] Initial session fetch:", data.session);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      setError(null);
    }).catch((error) => {
      setError(error);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.debug("[AuthContext] Auth state changed event:", event);
      console.debug("[AuthContext] Auth state changed session:", session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      setError(null);
    });

    return () => {
      listener?.subscription.unsubscribe();
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