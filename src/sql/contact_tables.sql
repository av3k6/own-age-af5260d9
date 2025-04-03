
-- Table for contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  preferred_contact TEXT,
  best_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_note TEXT
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id ON public.contact_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at);

-- Add contact preferences fields to user_profiles table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'preferred_contact_method'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN preferred_contact_method TEXT,
    ADD COLUMN preferred_contact_time TEXT;
  END IF;
END
$$;

-- Set up RLS policies
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY contact_submissions_select_policy ON public.contact_submissions
  FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- Users can insert their own submissions
CREATE POLICY contact_submissions_insert_policy ON public.contact_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Only admins can update submissions
CREATE POLICY contact_submissions_update_policy ON public.contact_submissions
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create a view for FAQs (would be populated by admin panel)
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable public read access to FAQs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY faqs_select_policy ON public.faqs FOR SELECT USING (is_published = true);

-- Only admins can modify FAQs
CREATE POLICY faqs_insert_policy ON public.faqs FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY faqs_update_policy ON public.faqs FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY faqs_delete_policy ON public.faqs FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Create an analytics table for contact page interactions
CREATE TABLE IF NOT EXISTS public.contact_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  properties JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics is write-only for users and read-only for admins
ALTER TABLE public.contact_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY contact_analytics_insert_policy ON public.contact_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY contact_analytics_select_policy ON public.contact_analytics FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
