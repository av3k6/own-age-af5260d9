
-- Run these SQL commands in the Supabase SQL Editor to create the viewing request system

-- Create an enum for viewing request status
CREATE TYPE public.viewing_request_status AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELED',
  'COMPLETED'
);

-- Create a table for viewing requests
CREATE TABLE IF NOT EXISTS public.property_viewings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  requested_date DATE NOT NULL,
  requested_time_start TIME NOT NULL,
  requested_time_end TIME NOT NULL,
  status viewing_request_status DEFAULT 'PENDING' NOT NULL,
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  buyer_notes TEXT,
  seller_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional fields
  is_virtual BOOLEAN DEFAULT FALSE,
  meeting_link TEXT
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_property_viewings_property_id ON public.property_viewings(property_id);
CREATE INDEX IF NOT EXISTS idx_property_viewings_buyer_id ON public.property_viewings(buyer_id);
CREATE INDEX IF NOT EXISTS idx_property_viewings_seller_id ON public.property_viewings(seller_id);
CREATE INDEX IF NOT EXISTS idx_property_viewings_status ON public.property_viewings(status);

-- Add RLS policies
ALTER TABLE public.property_viewings ENABLE ROW LEVEL SECURITY;

-- Buyers can view their own viewing requests
CREATE POLICY "Buyers can view their own viewing requests"
  ON public.property_viewings
  FOR SELECT
  USING (auth.uid()::text = buyer_id);

-- Sellers can view viewing requests for their properties
CREATE POLICY "Sellers can view viewing requests for their properties"
  ON public.property_viewings
  FOR SELECT
  USING (auth.uid()::text = seller_id);

-- Buyers can insert viewing requests
CREATE POLICY "Buyers can insert viewing requests"
  ON public.property_viewings
  FOR INSERT
  WITH CHECK (auth.uid()::text = buyer_id);

-- Buyers can update their own viewing requests if not yet approved
CREATE POLICY "Buyers can update their own pending viewing requests"
  ON public.property_viewings
  FOR UPDATE
  USING (
    auth.uid()::text = buyer_id AND
    status = 'PENDING'
  );

-- Sellers can update viewing requests for their properties
CREATE POLICY "Sellers can update viewing requests for their properties"
  ON public.property_viewings
  FOR UPDATE
  USING (auth.uid()::text = seller_id);

-- Create a table for seller availability
CREATE TABLE IF NOT EXISTS public.seller_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
  start_time TEXT NOT NULL, -- HH:MM format
  end_time TEXT NOT NULL, -- HH:MM format
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_seller_availability_seller_id ON public.seller_availability(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_availability_property_id ON public.seller_availability(property_id);

-- Add RLS policies
ALTER TABLE public.seller_availability ENABLE ROW LEVEL SECURITY;

-- Sellers can view and manage their own availability
CREATE POLICY "Sellers can view their own availability"
  ON public.seller_availability
  FOR SELECT
  USING (auth.uid()::text = seller_id);

CREATE POLICY "Sellers can insert their own availability"
  ON public.seller_availability
  FOR INSERT
  WITH CHECK (auth.uid()::text = seller_id);

CREATE POLICY "Sellers can update their own availability"
  ON public.seller_availability
  FOR UPDATE
  USING (auth.uid()::text = seller_id);

CREATE POLICY "Sellers can delete their own availability"
  ON public.seller_availability
  FOR DELETE
  USING (auth.uid()::text = seller_id);

-- Buyers can view availability for properties
CREATE POLICY "Buyers can view property availability"
  ON public.seller_availability
  FOR SELECT
  USING (true); -- Allow all authenticated users to view availability
