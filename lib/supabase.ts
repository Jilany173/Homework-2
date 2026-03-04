
import { createClient } from '@supabase/supabase-js';

// আপনার নতুন সুপাবেস প্রোজেক্ট ক্রেডেনশিয়াল
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
