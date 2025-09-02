
import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import SupabaseConnectionAlert from "@/components/SupabaseConnectionAlert";

// Type for user profile
export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'user' | 'partner';
  partner_services?: string[];
  partner_type?: string;
  contact_info?: any;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

// Type for user
export interface User {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  avatar?: string;
}

// Auth context type
interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setRole: (role: 'user' | 'partner', partnerData?: {services: string[], type: string}) => Promise<{ error: any }>;
  checkProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const checkProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    const profile = await fetchProfile(user.id);
    setProfile(profile);
    return profile;
  };

  useEffect(() => {
    // Check Supabase connection first
    if (!checkSupabaseConnection()) {
      setSupabaseConnected(false);
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
            avatar: session.user.user_metadata?.avatar_url,
          };
          setUser(userData);

          // Fetch user profile
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
          avatar: session.user.user_metadata?.avatar_url,
        };
        setUser(userData);

        // Fetch user profile after authentication
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        console.error('Error signing up:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Error signing in:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/role-selection`,
      },
    });
    
    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const setRole = async (role: 'user' | 'partner', partnerData?: {services: string[], type: string}) => {
    if (!user) {
      return { error: { message: 'User not authenticated' } };
    }

    try {
      const profileData: any = {
        id: user.id,
        role,
        full_name: user.full_name || user.name,
      };

      if (role === 'partner' && partnerData) {
        profileData.partner_services = partnerData.services;
        profileData.partner_type = partnerData.type;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error setting role:', error);
        return { error };
      }

      // Refresh profile data
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);

      return { error: null };
    } catch (error) {
      console.error('Error setting role:', error);
      return { error };
    }
  };


  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Show connection alert if Supabase isn't connected
  if (!supabaseConnected) {
    return <SupabaseConnectionAlert />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      loading, 
      signUp,
      signIn,
      signInWithGoogle, 
      signOut, 
      setRole,
      checkProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
