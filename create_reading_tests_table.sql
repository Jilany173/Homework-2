-- Run this in your Supabase SQL Editor:

-- 1. Create the table for reading tests
CREATE TABLE IF NOT EXISTS public.reading_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    test_type TEXT DEFAULT 'Reading',
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Disable RLS for now (or configure for Admin only)
ALTER TABLE public.reading_tests DISABLE ROW LEVEL SECURITY;
