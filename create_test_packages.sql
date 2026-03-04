-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.test_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    listening_id TEXT,
    reading_id TEXT,
    writing_id TEXT,
    speaking_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: RLS needs to be disabled or configured so admins can insert and public users can select.
-- For simplicity (since we aren't enforcing strict RLS on other tables yet), disable RLS on this table:
ALTER TABLE public.test_packages DISABLE ROW LEVEL SECURITY;
