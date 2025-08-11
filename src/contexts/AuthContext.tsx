
import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import SupabaseConnectionAlert from "@/components/SupabaseConnectionAlert";

// Type for user
export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  name?: string;
  avatar?: string;
}

// Auth context type
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (phoneNumber: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (phoneNumber: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(true);

  // Check if Supabase is properly connected
  const checkSupabaseConnection = () => {
    // Since we're using the integrated client, check if it's properly configured
    try {
      return !!supabase && typeof supabase.auth.getSession === 'function';
    } catch {
      return false;
    }
  };

  useEffect(() => {
    // Check Supabase connection first
    if (!checkSupabaseConnection()) {
      setSupabaseConnected(false);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
          avatar: session.user.user_metadata?.avatar_url,
        });
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
          avatar: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (phoneNumber: string, password: string, metadata?: any) => {
    // Use phone number as email for Supabase auth (phone@health.app format)
    const email = `${phoneNumber.replace(/\D/g, '')}@health.app`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone_number: phoneNumber,
          full_name: metadata?.full_name || metadata?.name || '',
          name: metadata?.name || metadata?.full_name || '',
          role: metadata?.role || 'user',
          partner_type: metadata?.partner_type,
          address: metadata?.address,
          location_lat: metadata?.location_lat,
          location_lng: metadata?.location_lng,
        },
      },
    });
    return { error };
  };

  const signIn = async (phoneNumber: string, password: string) => {
    // Convert phone number to email format
    const email = `${phoneNumber.replace(/\D/g, '')}@health.app`;
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Show connection alert if Supabase isn't connected
  if (!supabaseConnected) {
    return <SupabaseConnectionAlert />;
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
