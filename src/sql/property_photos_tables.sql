
-- Create property_photos table
CREATE TABLE IF NOT EXISTS public.property_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add a foreign key if you have a properties table
  -- CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE
  
  -- If you don't have the properties table yet, comment out the foreign key constraint above
  -- and uncomment this index to improve query performance
  -- CREATE INDEX idx_property_photos_property_id ON public.property_photos(property_id);
);

-- Create RLS policies for property_photos
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select their own property photos
CREATE POLICY "Users can view their own property photos" ON public.property_photos
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.properties WHERE id = property_id
    )
  );

-- Allow authenticated users to insert their own property photos
CREATE POLICY "Users can insert their own property photos" ON public.property_photos
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.properties WHERE id = property_id
    )
  );

-- Allow authenticated users to update their own property photos
CREATE POLICY "Users can update their own property photos" ON public.property_photos
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.properties WHERE id = property_id
    )
  );

-- Allow authenticated users to delete their own property photos
CREATE POLICY "Users can delete their own property photos" ON public.property_photos
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.properties WHERE id = property_id
    )
  );

-- Create property_documents table
CREATE TABLE IF NOT EXISTS public.property_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT,
  description TEXT
);

-- Create RLS policies for property_documents
ALTER TABLE public.property_documents ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own property documents
CREATE POLICY "Users can view their own property documents" ON public.property_documents
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.properties WHERE id = property_id
    ) OR auth.uid() = uploaded_by
  );

-- Allow authenticated users to insert their own property documents
CREATE POLICY "Users can insert their own property documents" ON public.property_documents
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.properties WHERE id = property_id
    ) OR auth.uid() = uploaded_by
  );

-- Allow authenticated users to update their own property documents
CREATE POLICY "Users can update their own property documents" ON public.property_documents
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.properties WHERE id = property_id
    ) OR auth.uid() = uploaded_by
  );

-- Allow authenticated users to delete their own property documents
CREATE POLICY "Users can delete their own property documents" ON public.property_documents
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.properties WHERE id = property_id
    ) OR auth.uid() = uploaded_by
  );
