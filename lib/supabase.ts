
import { createClient } from '@supabase/supabase-js';

// আপনার নতুন সুপাবেস প্রোজেক্ট ক্রেডেনশিয়াল
const supabaseUrl = 'https://bnyzgipykiutrzyolzrb.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJueXpnaXB5a2l1dHJ6eW9senJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NDk3NTQsImV4cCI6MjA4NTQyNTc1NH0.Hah9MSIPP-Z-M7u1yVONznuI1huvrdL8Nj7F1v79OR0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
