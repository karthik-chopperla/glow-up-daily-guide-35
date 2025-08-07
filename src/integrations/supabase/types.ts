export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_time: string
          created_at: string
          doctor_name: string
          estimated_duration: number | null
          id: string
          location_preference: string | null
          message: string | null
          notes: string | null
          notification_sent: boolean | null
          partner_id: string | null
          service_type: string | null
          specialty: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_time: string
          created_at?: string
          doctor_name: string
          estimated_duration?: number | null
          id?: string
          location_preference?: string | null
          message?: string | null
          notes?: string | null
          notification_sent?: boolean | null
          partner_id?: string | null
          service_type?: string | null
          specialty: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_time?: string
          created_at?: string
          doctor_name?: string
          estimated_duration?: number | null
          id?: string
          location_preference?: string | null
          message?: string | null
          notes?: string | null
          notification_sent?: boolean | null
          partner_id?: string | null
          service_type?: string | null
          specialty?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          partner_id: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          partner_id: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          partner_id?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      health_data: {
        Row: {
          calories_burned: number | null
          created_at: string
          date: string
          id: string
          sleep_hours: number | null
          steps_today: number | null
          updated_at: string
          user_id: string
          water_today: number | null
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string
          date?: string
          id?: string
          sleep_hours?: number | null
          steps_today?: number | null
          updated_at?: string
          user_id: string
          water_today?: number | null
        }
        Update: {
          calories_burned?: number | null
          created_at?: string
          date?: string
          id?: string
          sleep_hours?: number | null
          steps_today?: number | null
          updated_at?: string
          user_id?: string
          water_today?: number | null
        }
        Relationships: []
      }
      health_packages: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          duration_months: number | null
          id: string
          is_active: boolean | null
          package_name: string
          price: number | null
          services_included: string[] | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          duration_months?: number | null
          id?: string
          is_active?: boolean | null
          package_name: string
          price?: number | null
          services_included?: string[] | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          duration_months?: number | null
          id?: string
          is_active?: boolean | null
          package_name?: string
          price?: number | null
          services_included?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      insurance_plans: {
        Row: {
          agent_id: string
          coverage_details: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          plan_name: string
          price_range: string | null
          target_locations: string[] | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          coverage_details?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          plan_name: string
          price_range?: string | null
          target_locations?: string[] | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          coverage_details?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          plan_name?: string
          price_range?: string | null
          target_locations?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      medicine_reminders: {
        Row: {
          auto_refill: boolean | null
          created_at: string
          dose: string
          frequency: string
          id: string
          is_active: boolean | null
          name: string
          times: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_refill?: boolean | null
          created_at?: string
          dose: string
          frequency: string
          id?: string
          is_active?: boolean | null
          name: string
          times: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_refill?: boolean | null
          created_at?: string
          dose?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          name?: string
          times?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          availability_schedule: string | null
          avatar_url: string | null
          business_type: string | null
          city: string | null
          created_at: string
          email: string | null
          expertise_area: string | null
          full_name: string | null
          id: string
          is_available: boolean | null
          is_email_verified: boolean | null
          location_lat: number | null
          location_lng: number | null
          partner_type: string | null
          phone: string | null
          rating: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          service_range: string | null
          state: string | null
          updated_at: string
          vehicle_info: string | null
        }
        Insert: {
          address?: string | null
          availability_schedule?: string | null
          avatar_url?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          expertise_area?: string | null
          full_name?: string | null
          id: string
          is_available?: boolean | null
          is_email_verified?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          partner_type?: string | null
          phone?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          service_range?: string | null
          state?: string | null
          updated_at?: string
          vehicle_info?: string | null
        }
        Update: {
          address?: string | null
          availability_schedule?: string | null
          avatar_url?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          expertise_area?: string | null
          full_name?: string | null
          id?: string
          is_available?: boolean | null
          is_email_verified?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          partner_type?: string | null
          phone?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          service_range?: string | null
          state?: string | null
          updated_at?: string
          vehicle_info?: string | null
        }
        Relationships: []
      }
      reminder_logs: {
        Row: {
          date: string
          id: string
          reminder_id: string
          taken_at: string
          time_slot: string
          user_id: string
          was_taken: boolean | null
        }
        Insert: {
          date?: string
          id?: string
          reminder_id: string
          taken_at?: string
          time_slot: string
          user_id: string
          was_taken?: boolean | null
        }
        Update: {
          date?: string
          id?: string
          reminder_id?: string
          taken_at?: string
          time_slot?: string
          user_id?: string
          was_taken?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reminder_logs_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "medicine_reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      sos_alerts: {
        Row: {
          assigned_partner_id: string | null
          contact_number: string | null
          created_at: string
          emergency_type: string | null
          eta_minutes: number | null
          id: string
          location_lat: number
          location_lng: number
          nearest_partner_id: string | null
          response_notes: string | null
          status: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          assigned_partner_id?: string | null
          contact_number?: string | null
          created_at?: string
          emergency_type?: string | null
          eta_minutes?: number | null
          id?: string
          location_lat: number
          location_lng: number
          nearest_partner_id?: string | null
          response_notes?: string | null
          status?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          assigned_partner_id?: string | null
          contact_number?: string | null
          created_at?: string
          emergency_type?: string | null
          eta_minutes?: number | null
          id?: string
          location_lat?: number
          location_lng?: number
          nearest_partner_id?: string | null
          response_notes?: string | null
          status?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_weeks: number | null
          equipment_needed: string[] | null
          id: string
          is_active: boolean | null
          plan_name: string
          target_muscle_groups: string[] | null
          trainer_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          equipment_needed?: string[] | null
          id?: string
          is_active?: boolean | null
          plan_name: string
          target_muscle_groups?: string[] | null
          trainer_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          equipment_needed?: string[] | null
          id?: string
          is_active?: boolean | null
          plan_name?: string
          target_muscle_groups?: string[] | null
          trainer_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role:
        | "user"
        | "partner"
        | "ambulance_driver"
        | "elder_advisor"
        | "health_advisor"
        | "restaurant_partner"
        | "gym_trainer"
        | "insurance_agent"
        | "health_company"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "user",
        "partner",
        "ambulance_driver",
        "elder_advisor",
        "health_advisor",
        "restaurant_partner",
        "gym_trainer",
        "insurance_agent",
        "health_company",
      ],
    },
  },
} as const
