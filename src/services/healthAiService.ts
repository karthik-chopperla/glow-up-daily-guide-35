import { supabase } from "@/integrations/supabase/client";

export interface HealthChatResponse {
  response: string;
  timestamp: string;
}

export class HealthAiService {
  static async sendMessage(message: string, userId?: string): Promise<HealthChatResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('health-ai-chat', {
        body: {
          message,
          userId
        }
      });

      if (error) {
        console.error('Error calling health AI function:', error);
        throw new Error('Failed to get AI response');
      }

      return data;
    } catch (error) {
      console.error('Health AI service error:', error);
      throw error;
    }
  }

  static async getHealthData(userId: string) {
    try {
      const { data, error } = await supabase
        .from('health_data')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(7); // Get last 7 days

      if (error) {
        console.error('Error fetching health data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getHealthData:', error);
      return null;
    }
  }

  static async updateHealthData(userId: string, date: string, data: Partial<{
    steps_today: number;
    water_today: number;
    sleep_hours: number;
    calories_burned: number;
  }>) {
    try {
      const { data: result, error } = await supabase
        .from('health_data')
        .upsert({
          user_id: userId,
          date,
          ...data,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating health data:', error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error in updateHealthData:', error);
      throw error;
    }
  }

  static async getMedicineReminders(userId: string) {
    try {
      const { data, error } = await supabase
        .from('medicine_reminders')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching medicine reminders:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMedicineReminders:', error);
      return [];
    }
  }

  static async addMedicineReminder(userId: string, reminder: {
    name: string;
    dose: string;
    frequency: string;
    times: string[];
    auto_refill?: boolean;
  }) {
    try {
      const { data, error } = await supabase
        .from('medicine_reminders')
        .insert({
          user_id: userId,
          ...reminder
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding medicine reminder:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in addMedicineReminder:', error);
      throw error;
    }
  }

  static async getAppointments(userId: string) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAppointments:', error);
      return [];
    }
  }

  static async addAppointment(userId: string, appointment: {
    doctor_name: string;
    appointment_time: string;
    type: 'online' | 'in-person';
    specialty: string;
    notes?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: userId,
          ...appointment
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding appointment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in addAppointment:', error);
      throw error;
    }
  }
}