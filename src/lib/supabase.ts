import { createClient } from '@supabase/supabase-js'

// Debug: Log all environment variables to see what's available
console.log('All env vars:', import.meta.env)
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', { supabaseUrl, supabaseAnonKey })
  throw new Error('Missing Supabase environment variables. Please ensure Supabase is properly connected in your Lovable project.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)