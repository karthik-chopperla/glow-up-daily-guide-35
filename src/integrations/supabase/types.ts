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
      ambulance_vehicles: {
        Row: {
          created_at: string
          current_lat: number | null
          current_lng: number | null
          driver_id: string
          equipment_list: Json | null
          id: string
          insurance_expiry: string | null
          is_available: boolean | null
          last_maintenance: string | null
          license_plate: string | null
          updated_at: string
          vehicle_number: string
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          driver_id: string
          equipment_list?: Json | null
          id?: string
          insurance_expiry?: string | null
          is_available?: boolean | null
          last_maintenance?: string | null
          license_plate?: string | null
          updated_at?: string
          vehicle_number: string
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          driver_id?: string
          equipment_list?: Json | null
          id?: string
          insurance_expiry?: string | null
          is_available?: boolean | null
          last_maintenance?: string | null
          license_plate?: string | null
          updated_at?: string
          vehicle_number?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_time: string
          bed_id: string | null
          consultation_type: string | null
          created_at: string
          doctor_name: string
          estimated_duration: number | null
          hospital_id: string | null
          id: string
          insurance_details: Json | null
          location_preference: string | null
          message: string | null
          notes: string | null
          notification_id: string | null
          notification_sent: boolean | null
          partner_id: string | null
          service_type: string | null
          specialty: string
          status: string
          symptoms: string | null
          type: string
          updated_at: string
          user_id: string
          vitals: Json | null
        }
        Insert: {
          appointment_time: string
          bed_id?: string | null
          consultation_type?: string | null
          created_at?: string
          doctor_name: string
          estimated_duration?: number | null
          hospital_id?: string | null
          id?: string
          insurance_details?: Json | null
          location_preference?: string | null
          message?: string | null
          notes?: string | null
          notification_id?: string | null
          notification_sent?: boolean | null
          partner_id?: string | null
          service_type?: string | null
          specialty: string
          status?: string
          symptoms?: string | null
          type: string
          updated_at?: string
          user_id: string
          vitals?: Json | null
        }
        Update: {
          appointment_time?: string
          bed_id?: string | null
          consultation_type?: string | null
          created_at?: string
          doctor_name?: string
          estimated_duration?: number | null
          hospital_id?: string | null
          id?: string
          insurance_details?: Json | null
          location_preference?: string | null
          message?: string | null
          notes?: string | null
          notification_id?: string | null
          notification_sent?: boolean | null
          partner_id?: string | null
          service_type?: string | null
          specialty?: string
          status?: string
          symptoms?: string | null
          type?: string
          updated_at?: string
          user_id?: string
          vitals?: Json | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          entity_id: string
          entity_type: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
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
      hospital_beds: {
        Row: {
          available_count: number
          bed_type: string
          hospital_id: string
          id: string
          total_count: number
          updated_at: string
        }
        Insert: {
          available_count?: number
          bed_type: string
          hospital_id: string
          id?: string
          total_count?: number
          updated_at?: string
        }
        Update: {
          available_count?: number
          bed_type?: string
          hospital_id?: string
          id?: string
          total_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          address: string
          available_beds: number | null
          city: string | null
          contact_info: Json | null
          created_at: string
          email: string | null
          emergency_beds: number | null
          facilities: Json | null
          id: string
          is_active: boolean | null
          location_lat: number
          location_lng: number
          name: string
          phone: string | null
          rating: number | null
          specialties: Json | null
          state: string | null
          total_beds: number | null
          updated_at: string
        }
        Insert: {
          address: string
          available_beds?: number | null
          city?: string | null
          contact_info?: Json | null
          created_at?: string
          email?: string | null
          emergency_beds?: number | null
          facilities?: Json | null
          id?: string
          is_active?: boolean | null
          location_lat: number
          location_lng: number
          name: string
          phone?: string | null
          rating?: number | null
          specialties?: Json | null
          state?: string | null
          total_beds?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          available_beds?: number | null
          city?: string | null
          contact_info?: Json | null
          created_at?: string
          email?: string | null
          emergency_beds?: number | null
          facilities?: Json | null
          id?: string
          is_active?: boolean | null
          location_lat?: number
          location_lng?: number
          name?: string
          phone?: string | null
          rating?: number | null
          specialties?: Json | null
          state?: string | null
          total_beds?: number | null
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
      lab_samples: {
        Row: {
          collection_date: string | null
          created_at: string
          id: string
          lab_id: string
          patient_id: string
          result_date: string | null
          results: Json | null
          sample_id: string
          status: string | null
          test_type: string
          updated_at: string
        }
        Insert: {
          collection_date?: string | null
          created_at?: string
          id?: string
          lab_id: string
          patient_id: string
          result_date?: string | null
          results?: Json | null
          sample_id: string
          status?: string | null
          test_type: string
          updated_at?: string
        }
        Update: {
          collection_date?: string | null
          created_at?: string
          id?: string
          lab_id?: string
          patient_id?: string
          result_date?: string | null
          results?: Json | null
          sample_id?: string
          status?: string | null
          test_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      location_index: {
        Row: {
          entity_id: string
          entity_type: string
          geohash: string | null
          id: string
          is_active: boolean | null
          location_lat: number
          location_lng: number
          radius_km: number | null
          updated_at: string
        }
        Insert: {
          entity_id: string
          entity_type: string
          geohash?: string | null
          id?: string
          is_active?: boolean | null
          location_lat: number
          location_lng: number
          radius_km?: number | null
          updated_at?: string
        }
        Update: {
          entity_id?: string
          entity_type?: string
          geohash?: string | null
          id?: string
          is_active?: boolean | null
          location_lat?: number
          location_lng?: number
          radius_km?: number | null
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
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          partner_id: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          partner_id?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          partner_id?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nurse_certifications: {
        Row: {
          certificate_number: string | null
          certification_type: string
          created_at: string
          expiry_date: string | null
          id: string
          issue_date: string | null
          issued_by: string | null
          nurse_id: string
          verification_status: string | null
        }
        Insert: {
          certificate_number?: string | null
          certification_type: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issued_by?: string | null
          nurse_id: string
          verification_status?: string | null
        }
        Update: {
          certificate_number?: string | null
          certification_type?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issued_by?: string | null
          nurse_id?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          currency: string | null
          description: string | null
          gateway_transaction_id: string | null
          id: string
          partner_id: string | null
          payment_gateway: string | null
          payment_method: string | null
          service_id: string
          service_type: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          gateway_transaction_id?: string | null
          id?: string
          partner_id?: string | null
          payment_gateway?: string | null
          payment_method?: string | null
          service_id: string
          service_type: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          gateway_transaction_id?: string | null
          id?: string
          partner_id?: string | null
          payment_gateway?: string | null
          payment_method?: string | null
          service_id?: string
          service_type?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pharmacy_stock: {
        Row: {
          brand_name: string | null
          created_at: string
          expiry_date: string | null
          generic_name: string | null
          id: string
          medicine_name: string
          pharmacy_id: string
          prescription_required: boolean | null
          price: number | null
          stock_quantity: number | null
          strength: string | null
          updated_at: string
        }
        Insert: {
          brand_name?: string | null
          created_at?: string
          expiry_date?: string | null
          generic_name?: string | null
          id?: string
          medicine_name: string
          pharmacy_id: string
          prescription_required?: boolean | null
          price?: number | null
          stock_quantity?: number | null
          strength?: string | null
          updated_at?: string
        }
        Update: {
          brand_name?: string | null
          created_at?: string
          expiry_date?: string | null
          generic_name?: string | null
          id?: string
          medicine_name?: string
          pharmacy_id?: string
          prescription_required?: boolean | null
          price?: number | null
          stock_quantity?: number | null
          strength?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          age: number | null
          availability_schedule: string | null
          avatar_url: string | null
          booking_price: number | null
          business_type: string | null
          city: string | null
          created_at: string
          education: string | null
          expertise_area: string | null
          full_name: string | null
          hospital_affiliation: string | null
          id: string
          is_available: boolean | null
          is_email_verified: boolean | null
          location_lat: number | null
          location_lng: number | null
          partner_type: string | null
          phone: string | null
          rating: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          service_charge: number | null
          service_range: string | null
          service_type: string | null
          state: string | null
          updated_at: string
          vehicle_info: string | null
          work_description: string | null
          years_experience: number | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          availability_schedule?: string | null
          avatar_url?: string | null
          booking_price?: number | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          education?: string | null
          expertise_area?: string | null
          full_name?: string | null
          hospital_affiliation?: string | null
          id: string
          is_available?: boolean | null
          is_email_verified?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          partner_type?: string | null
          phone?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          service_charge?: number | null
          service_range?: string | null
          service_type?: string | null
          state?: string | null
          updated_at?: string
          vehicle_info?: string | null
          work_description?: string | null
          years_experience?: number | null
        }
        Update: {
          address?: string | null
          age?: number | null
          availability_schedule?: string | null
          avatar_url?: string | null
          booking_price?: number | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          education?: string | null
          expertise_area?: string | null
          full_name?: string | null
          hospital_affiliation?: string | null
          id?: string
          is_available?: boolean | null
          is_email_verified?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          partner_type?: string | null
          phone?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          service_charge?: number | null
          service_range?: string | null
          service_type?: string | null
          state?: string | null
          updated_at?: string
          vehicle_info?: string | null
          work_description?: string | null
          years_experience?: number | null
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
          assigned_driver_id: string | null
          assigned_partner_id: string | null
          contact_number: string | null
          created_at: string
          distance_km: number | null
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
          assigned_driver_id?: string | null
          assigned_partner_id?: string | null
          contact_number?: string | null
          created_at?: string
          distance_km?: number | null
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
          assigned_driver_id?: string | null
          assigned_partner_id?: string | null
          contact_number?: string | null
          created_at?: string
          distance_km?: number | null
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
      sos_assignments: {
        Row: {
          accepted_at: string | null
          arrived_at: string | null
          assigned_at: string
          completed_at: string | null
          distance_km: number | null
          driver_id: string | null
          eta_minutes: number | null
          id: string
          partner_id: string
          response_notes: string | null
          sos_id: string
          state: string | null
          vehicle_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          arrived_at?: string | null
          assigned_at?: string
          completed_at?: string | null
          distance_km?: number | null
          driver_id?: string | null
          eta_minutes?: number | null
          id?: string
          partner_id: string
          response_notes?: string | null
          sos_id: string
          state?: string | null
          vehicle_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          arrived_at?: string | null
          assigned_at?: string
          completed_at?: string | null
          distance_km?: number | null
          driver_id?: string | null
          eta_minutes?: number | null
          id?: string
          partner_id?: string
          response_notes?: string | null
          sos_id?: string
          state?: string | null
          vehicle_id?: string | null
        }
        Relationships: []
      }
      sos_cases: {
        Row: {
          assigned_at: string | null
          billing_amount: number | null
          completed_at: string | null
          contacts: Json | null
          created_at: string
          device_info: Json | null
          emergency_type: string | null
          id: string
          location_accuracy: number | null
          location_lat: number
          location_lng: number
          medical_flags: Json | null
          preferred_hospital_id: string | null
          priority_score: number | null
          state: string | null
          subscription_level: string | null
          symptoms_summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          billing_amount?: number | null
          completed_at?: string | null
          contacts?: Json | null
          created_at?: string
          device_info?: Json | null
          emergency_type?: string | null
          id?: string
          location_accuracy?: number | null
          location_lat: number
          location_lng: number
          medical_flags?: Json | null
          preferred_hospital_id?: string | null
          priority_score?: number | null
          state?: string | null
          subscription_level?: string | null
          symptoms_summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          billing_amount?: number | null
          completed_at?: string | null
          contacts?: Json | null
          created_at?: string
          device_info?: Json | null
          emergency_type?: string | null
          id?: string
          location_accuracy?: number | null
          location_lat?: number
          location_lng?: number
          medical_flags?: Json | null
          preferred_hospital_id?: string | null
          priority_score?: number | null
          state?: string | null
          subscription_level?: string | null
          symptoms_summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renewal: boolean | null
          billing_cycle: string | null
          created_at: string
          expires_at: string | null
          features: Json | null
          id: string
          plan_level: string | null
          plan_name: string
          price: number | null
          started_at: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renewal?: boolean | null
          billing_cycle?: string | null
          created_at?: string
          expires_at?: string | null
          features?: Json | null
          id?: string
          plan_level?: string | null
          plan_name: string
          price?: number | null
          started_at?: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renewal?: boolean | null
          billing_cycle?: string | null
          created_at?: string
          expires_at?: string | null
          features?: Json | null
          id?: string
          plan_level?: string | null
          plan_name?: string
          price?: number | null
          started_at?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trainer_sessions: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_available: boolean | null
          max_participants: number | null
          price: number | null
          requirements: Json | null
          session_name: string
          session_type: string | null
          trainer_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_available?: boolean | null
          max_participants?: number | null
          price?: number | null
          requirements?: Json | null
          session_name: string
          session_type?: string | null
          trainer_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_available?: boolean | null
          max_participants?: number | null
          price?: number | null
          requirements?: Json | null
          session_name?: string
          session_type?: string | null
          trainer_id?: string
          updated_at?: string
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
        | "home_remedies_expert"
        | "hospital"
        | "private_doctor"
        | "medical_shop"
        | "pharmacy_dealership"
        | "mental_health_support"
        | "in_home_nursing"
        | "pregnancy_care_plan"
        | "diet_plan_advisor"
        | "fitness_recovery_advisor"
        | "health_insurance_agent"
        | "restaurant"
        | "catering_service"
        | "hotel"
        | "cloud_kitchen"
        | "omlens_driver"
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
        "home_remedies_expert",
        "hospital",
        "private_doctor",
        "medical_shop",
        "pharmacy_dealership",
        "mental_health_support",
        "in_home_nursing",
        "pregnancy_care_plan",
        "diet_plan_advisor",
        "fitness_recovery_advisor",
        "health_insurance_agent",
        "restaurant",
        "catering_service",
        "hotel",
        "cloud_kitchen",
        "omlens_driver",
      ],
    },
  },
} as const
