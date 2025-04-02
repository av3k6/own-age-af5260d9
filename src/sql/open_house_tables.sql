
-- Create the property_open_houses table for storing open house schedule
CREATE TABLE IF NOT EXISTS public.property_open_houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TEXT NOT NULL, -- HH:MM format
  end_time TEXT NOT NULL, -- HH:MM format
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_property_open_houses_property_id ON public.property_open_houses(property_id);
CREATE INDEX IF NOT EXISTS idx_property_open_houses_date ON public.property_open_houses(date);

-- Add RLS policies
ALTER TABLE public.property_open_houses ENABLE ROW LEVEL SECURITY;

-- Sellers can manage their own property's open houses
CREATE POLICY "Sellers can view their own property open houses"
  ON public.property_open_houses
  FOR SELECT
  USING (property_id IN (
    SELECT id FROM properties WHERE seller_id = auth.uid()
  ));

CREATE POLICY "Sellers can insert their own property open houses"
  ON public.property_open_houses
  FOR INSERT
  WITH CHECK (property_id IN (
    SELECT id FROM properties WHERE seller_id = auth.uid()
  ));

CREATE POLICY "Sellers can update their own property open houses"
  ON public.property_open_houses
  FOR UPDATE
  USING (property_id IN (
    SELECT id FROM properties WHERE seller_id = auth.uid()
  ));

CREATE POLICY "Sellers can delete their own property open houses"
  ON public.property_open_houses
  FOR DELETE
  USING (property_id IN (
    SELECT id FROM properties WHERE seller_id = auth.uid()
  ));

-- Buyers can view any property's open houses
CREATE POLICY "Buyers can view any property open houses"
  ON public.property_open_houses
  FOR SELECT
  USING (true);
