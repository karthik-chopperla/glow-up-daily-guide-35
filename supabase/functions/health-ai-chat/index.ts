import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('Received health chat request:', { message, userId });

    // For now, provide a simple health-focused response
    // In a real implementation, you would integrate with OpenAI or another AI service
    const healthResponse = generateHealthResponse(message);

    // Log the interaction (optional)
    if (userId) {
      await supabase
        .from('chat_logs')
        .insert({
          user_id: userId,
          message: message,
          response: healthResponse,
          created_at: new Date().toISOString()
        });
    }

    return new Response(
      JSON.stringify({ 
        response: healthResponse,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in health-ai-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process health chat request',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateHealthResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Simple health response logic
  if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
    return "I understand you're experiencing a headache. Here are some general suggestions: stay hydrated, rest in a quiet dark room, and consider applying a cold compress. If headaches persist or worsen, please consult with a healthcare professional.";
  }
  
  if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
    return "For fever management, stay hydrated, rest, and monitor your temperature. If fever exceeds 101.3°F (38.5°C) or persists for more than 3 days, please seek medical attention.";
  }
  
  if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('fitness')) {
    return "Regular exercise is great for your health! Start with 30 minutes of moderate activity most days. Always warm up before and cool down after exercise. Consult your doctor before starting any new fitness routine.";
  }
  
  if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
    return "A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Stay hydrated and limit processed foods. For personalized nutrition advice, consider consulting a registered dietitian.";
  }
  
  if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('insomnia')) {
    return "Good sleep hygiene is essential! Aim for 7-9 hours nightly, maintain a consistent sleep schedule, avoid screens before bed, and create a relaxing bedtime routine. If sleep problems persist, consult a healthcare provider.";
  }
  
  if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('mental health')) {
    return "Managing stress is important for overall health. Try deep breathing, meditation, regular exercise, and adequate sleep. Don't hesitate to reach out to a mental health professional if you need support.";
  }
  
  // Default response
  return "Thank you for your health question. While I can provide general wellness information, please remember that I'm not a replacement for professional medical advice. For specific health concerns, always consult with a qualified healthcare provider.";
}