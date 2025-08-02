import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase connection status:', {
  url: supabaseUrl ? 'Available' : 'Missing',
  key: supabaseAnonKey ? 'Available' : 'Missing'
})

// Create a mock client if Supabase isn't connected
let supabase: any

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('Supabase not connected - using mock client')
  // Mock client for development when Supabase isn't connected
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ error: { message: 'Supabase not connected' } }),
      signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not connected' } }),
      signOut: () => Promise.resolve({ error: null })
    }
  }
}

export { supabase }