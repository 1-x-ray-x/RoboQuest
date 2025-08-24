-- Supabase setup for RoboQuest content management
-- Run this in your Supabase SQL Editor

-- Create the content table
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'video',
  category TEXT DEFAULT 'general',
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration TEXT,
  youtube_id TEXT,
  xp_reward INTEGER DEFAULT 50,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_our_content BOOLEAN DEFAULT false,
  uploaded_by TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_is_our_content ON content(is_our_content);
CREATE INDEX IF NOT EXISTS idx_content_uploaded_at ON content(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category);
CREATE INDEX IF NOT EXISTS idx_content_difficulty ON content(difficulty);

-- Enable Row Level Security (RLS)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read access
CREATE POLICY "Allow public read access" ON content
  FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own content
CREATE POLICY "Allow owner update" ON content
  FOR UPDATE USING (auth.email() = uploaded_by);

-- Allow users to delete their own content
CREATE POLICY "Allow owner delete" ON content
  FOR DELETE USING (auth.email() = uploaded_by);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO content (title, description, type, category, difficulty, duration, youtube_id, xp_reward, is_our_content, uploaded_by) VALUES
('Getting Started with Scratch', 'Learn the basics of Scratch programming', 'video', 'scratch', 'beginner', '15 min', 'dQw4w9WgXcQ', 50, true, 'rayaanm5409@gmail.com'),
('Python Fundamentals', 'Introduction to Python programming language', 'video', 'python', 'beginner', '20 min', 'dQw4w9WgXcQ', 75, true, 'rayaanm5409@gmail.com'),
('Web Development Basics', 'HTML, CSS, and JavaScript fundamentals', 'video', 'web', 'beginner', '25 min', 'dQw4w9WgXcQ', 100, false, 'rayaanm5409@gmail.com'),
('Robotics Introduction', 'Learn about robotics and automation', 'video', 'robotics', 'intermediate', '30 min', 'dQw4w9WgXcQ', 125, false, 'rayaanm5409@gmail.com')
ON CONFLICT (id) DO NOTHING;

