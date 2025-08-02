// AI Health Service - handles health-related AI responses
// Note: Add your OpenAI API key to use real AI responses

const HEALTH_RESPONSES = {
  nutrition: [
    "🥗 For a balanced meal today, try including:\n• Leafy greens (spinach, kale)\n• Lean protein (chicken, fish, tofu)\n• Complex carbs (quinoa, sweet potato)\n• Healthy fats (avocado, nuts)\n• Colorful vegetables for antioxidants\n\nRemember to stay hydrated! 💧",
    "🍎 Here's a simple nutrition tip:\n• Start with half your plate as vegetables\n• Quarter lean protein\n• Quarter whole grains\n• Add a healthy fat source\n\nThis creates a nutrient-dense, satisfying meal!",
  ],
  anxiety: [
    "🌸 Here are some gentle anxiety-reducing techniques:\n\n1. **4-7-8 Breathing**: Inhale for 4, hold for 7, exhale for 8\n2. **Grounding**: Name 5 things you see, 4 you hear, 3 you touch\n3. **Progressive muscle relaxation**\n4. **Gentle movement** like walking\n\nRemember: It's okay to feel anxious. You're not alone. 💙",
    "💆‍♀️ Try this quick anxiety relief:\n\n• Place your hand on your heart\n• Take 3 deep breaths\n• Remind yourself: 'This feeling will pass'\n• Do something kind for yourself\n\nConsider talking to a counselor if anxiety persists.",
  ],
  breathing: [
    "🫁 **Box Breathing Exercise**:\n\n1. Inhale slowly for 4 counts\n2. Hold your breath for 4 counts\n3. Exhale slowly for 4 counts\n4. Hold empty for 4 counts\n5. Repeat 4-6 times\n\nThis activates your body's relaxation response. Perfect for stress relief! ✨",
    "🌬️ **4-7-8 Calming Breath**:\n\n1. Exhale completely\n2. Inhale through nose for 4\n3. Hold breath for 7\n4. Exhale through mouth for 8\n5. Repeat 3-4 cycles\n\nGreat for bedtime or when feeling overwhelmed! 😌",
  ],
  sleep: [
    "😴 **Better Sleep Tips**:\n\n• Keep room cool (65-68°F)\n• No screens 1 hour before bed\n• Try chamomile tea or magnesium\n• Read or meditate instead\n• Keep consistent sleep schedule\n• Create a calming bedtime routine\n\nYour body will thank you! 🌙",
    "🛏️ **Sleep Hygiene Essentials**:\n\n• Dark, quiet environment\n• Comfortable mattress/pillows\n• No caffeine after 2 PM\n• Light exercise earlier in day\n• Journal worries before bed\n\nQuality sleep = better health! 💤",
  ],
  exercise: [
    "🚶‍♀️ **Gentle Movement Ideas**:\n\n• 10-minute morning walk\n• Desk stretches every hour\n• Dance to 2-3 favorite songs\n• Yoga poses before bed\n• Take stairs when possible\n\nMovement is medicine! Start small and build up. 💪",
  ],
  default: [
    "🌟 I'm here to help with health and wellness questions! I can provide guidance on:\n\n• Nutrition and healthy eating\n• Stress management techniques\n• Sleep improvement tips\n• Gentle exercise suggestions\n• Breathing exercises\n• Mental wellness practices\n\nWhat would you like to know about? 💚",
  ]
};

class AIHealthService {
  private apiKey: string | null = null;

  constructor() {
    // Try to get API key from localStorage first
    this.apiKey = this.getApiKey();
  }

  // Method to set API key (can be called from settings)
  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  // Check if API key is available
  private getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    return localStorage.getItem('openai_api_key');
  }

  // Get AI response for health queries
  async getHealthAdvice(query: string): Promise<string> {
    const apiKey = this.getApiKey();
    
    // If no API key, use predefined responses
    if (!apiKey) {
      return this.getPredefinedResponse(query);
    }

    // Try to use OpenAI API with gpt-3.5-turbo as requested
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a friendly, supportive health and wellness assistant. Provide helpful, evidence-based advice while being warm and encouraging. Always remind users to consult healthcare professionals for serious concerns. Keep responses concise but caring. Use emojis to make responses friendly.`
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to predefined responses
      return this.getPredefinedResponse(query);
    }
  }

  // Get predefined response based on query content
  private getPredefinedResponse(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('eat') || lowerQuery.includes('food') || lowerQuery.includes('nutrition') || lowerQuery.includes('diet')) {
      return this.getRandomResponse(HEALTH_RESPONSES.nutrition);
    }
    
    if (lowerQuery.includes('anxiety') || lowerQuery.includes('stress') || lowerQuery.includes('worried') || lowerQuery.includes('anxious')) {
      return this.getRandomResponse(HEALTH_RESPONSES.anxiety);
    }
    
    if (lowerQuery.includes('breath') || lowerQuery.includes('breathing') || lowerQuery.includes('calm')) {
      return this.getRandomResponse(HEALTH_RESPONSES.breathing);
    }
    
    if (lowerQuery.includes('sleep') || lowerQuery.includes('tired') || lowerQuery.includes('insomnia')) {
      return this.getRandomResponse(HEALTH_RESPONSES.sleep);
    }
    
    if (lowerQuery.includes('exercise') || lowerQuery.includes('workout') || lowerQuery.includes('fitness') || lowerQuery.includes('move')) {
      return this.getRandomResponse(HEALTH_RESPONSES.exercise);
    }
    
    return this.getRandomResponse(HEALTH_RESPONSES.default);
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const aiHealthService = new AIHealthService();

// Note: Add your OpenAI API key to use real AI responses
