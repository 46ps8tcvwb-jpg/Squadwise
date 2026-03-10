-- Run this in Supabase SQL Editor (Database → SQL Editor → New Query)

-- Create the coach_data table
CREATE TABLE IF NOT EXISTS coach_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  team_name TEXT DEFAULT 'My Team',
  season TEXT DEFAULT '2024-25',
  players JSONB DEFAULT '[]',
  sub_status TEXT DEFAULT 'trial',
  customer_id TEXT DEFAULT '',
  trial_start BIGINT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) — users can only see their own data
ALTER TABLE coach_data ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own data
CREATE POLICY "Users can read own data" ON coach_data
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: users can insert their own data
CREATE POLICY "Users can insert own data" ON coach_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: users can update their own data
CREATE POLICY "Users can update own data" ON coach_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: service role can do everything (for server-side functions)
CREATE POLICY "Service role full access" ON coach_data
  USING (true)
  WITH CHECK (true);
