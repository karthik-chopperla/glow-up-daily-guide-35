
import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import SupabaseConnectionAlert from "@/components/SupabaseConnectionAlert";

// Type for user profile
export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'patient' | 'doctor' | 'pharmacy_partner' | 'elder_expert' | 'nurse' | 'admin';
  
  // Basic profile fields
  age?: number;
  gender?: string;
  
  // Health-related fields
  medical_history?: string[];
  allergies?: string[];
  chronic_conditions?: string[];
  preferred_medicine_system?: 'Allopathy' | 'Ayurveda' | 'Homeopathy';
  emergency_contacts?: any[];
  blood_group?: string;
  height_cm?: number;
  weight_kg?: number;
  date_of_birth?: string;
  
  // Legacy fields for backward compatibility
  partner_services?: string[];
  partner_type?: string;
  contact_info?: any;
  address?: string;
  phone?: string;
  city?: string;
  state?: string;
  created_at?: string;
  updated_at?: string;
  consultation_price?: number;
  specialty?: string;
  doctor_name?: string;
  hospital_name?: string;
  facilities?: any[];
  doctors?: any[];
  partner_setup_complete?: boolean;
  education?: string;
  years_experience?: number;
  availability_schedule?: string;
  hospital_affiliation?: string;
  expertise_area?: string;
  service_charge?: number;
  work_description?: string;
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
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setRole: (role: 'patient' | 'doctor' | 'pharmacy_partner' | 'elder_expert' | 'nurse' | 'admin', partnerData?: {services: string[], type: string}) => Promise<{ error: any }>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ error: any }>;
  checkProfile: () => Promise<UserProfile | null>;
  redirectToRoleDashboard: (role: 'patient' | 'doctor' | 'pharmacy_partner' | 'elder_expert' | 'nurse' | 'admin') => void;
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

      if (!data) return null;

      // Map database role values and fix data types
      const mappedProfile: UserProfile = {
        ...data,
        role: mapDatabaseRole(data.role),
        emergency_contacts: Array.isArray(data.emergency_contacts) ? data.emergency_contacts : [],
        facilities: Array.isArray(data.facilities) ? data.facilities : [],
        doctors: Array.isArray(data.doctors) ? data.doctors : [],
        medical_history: Array.isArray(data.medical_history) ? data.medical_history : [],
        allergies: Array.isArray(data.allergies) ? data.allergies : [],
        chronic_conditions: Array.isArray(data.chronic_conditions) ? data.chronic_conditions : []
      };

      return mappedProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Helper function to map database roles to TypeScript types
  const mapDatabaseRole = (dbRole: string): UserProfile['role'] => {
    switch (dbRole) {
      case 'user':
        return 'patient';
      case 'partner':
        return 'doctor'; // Default partner to doctor for now
      case 'patient':
      case 'doctor':
      case 'pharmacy_partner':
      case 'elder_expert':
      case 'nurse':
      case 'admin':
        return dbRole as UserProfile['role'];
      default:
        return 'patient'; // Default fallback
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

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName
          }
        },
      });
      
      if (error) {
        console.error('Error signing up:', error);
        return { error };
      }
      
      // Account is created immediately (no email verification)
      return { error: null, data };
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

  // Remove Google sign-in as per requirements
  const signInWithGoogle = async () => {
    throw new Error('Google sign-in is not available. Please use email and password.');
  };

  const setRole = async (role: 'patient' | 'doctor' | 'pharmacy_partner' | 'elder_expert' | 'nurse' | 'admin', partnerData?: {services: string[], type: string}) => {
    if (!user) {
      return { error: { message: 'User not authenticated' } };
    }

    try {
      const profileData: any = {
        id: user.id,
        role,
        full_name: user.full_name || user.name,
      };

      // For backward compatibility, keep partner-specific logic
      if ((role === 'doctor' || role === 'pharmacy_partner' || role === 'elder_expert') && partnerData) {
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

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      return { error: { message: 'User not authenticated' } };
    }

    try {
      // Remove role from update if it exists to prevent conflicts
      const { role, ...updateData } = profileData;
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return { error };
      }

      // Refresh profile data
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);

      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const redirectToRoleDashboard = (role: 'patient' | 'doctor' | 'pharmacy_partner' | 'elder_expert' | 'nurse' | 'admin') => {
    if (typeof window !== 'undefined') {
      if (role === 'patient') {
        window.location.href = '/patient-dashboard';
      } else if (role === 'doctor') {
        window.location.href = '/doctor-dashboard';
      } else if (role === 'pharmacy_partner') {
        window.location.href = '/pharmacy-dashboard';
      } else if (role === 'elder_expert') {
        window.location.href = '/elder-dashboard';
      } else if (role === 'nurse') {
        window.location.href = '/nurse-dashboard';
      }
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
      updateProfile,
      checkProfile,
      redirectToRoleDashboard
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
