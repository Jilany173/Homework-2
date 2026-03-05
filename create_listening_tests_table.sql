-- Run this in your Supabase SQL Editor:

-- 1. Create the table for listening tests
CREATE TABLE IF NOT EXISTS public.listening_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    test_type TEXT DEFAULT 'Listening',
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Disable RLS for now (or configure for Admin only)
ALTER TABLE public.listening_tests DISABLE ROW LEVEL SECURITY;

-- 3. Create a bucket for audio files if it doesn't exist
-- Note: You may need to create this manually in the Supabase Storage UI named 'tests'
-- and set its access to PUBLIC.
