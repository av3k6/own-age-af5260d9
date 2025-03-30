
-- This file contains SQL statements to create the tables needed for e-signatures
-- You can run these statements in your Supabase SQL editor

-- Table for signature requests
CREATE TABLE IF NOT EXISTS public.signature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  provider TEXT NOT NULL DEFAULT 'manual',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Enable Row Level Security
  CONSTRAINT valid_status CHECK (status IN ('pending', 'signed', 'declined', 'expired', 'completed'))
);

-- Table for signers
CREATE TABLE IF NOT EXISTS public.signature_signers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.signature_requests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT,
  order INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  signed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'signed', 'declined', 'expired'))
);

-- Table for signature records (to store signatures)
CREATE TABLE IF NOT EXISTS public.signature_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signer_id UUID NOT NULL REFERENCES public.signature_signers(id) ON DELETE CASCADE,
  signature_data TEXT NOT NULL, -- Base64 encoded signature image
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.signature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signature_signers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signature_records ENABLE ROW LEVEL SECURITY;

-- Policy for signature_requests: users can view and modify their own requests
CREATE POLICY "Users can view their own signature requests"
  ON public.signature_requests
  FOR SELECT
  USING (auth.uid() = created_by);
  
CREATE POLICY "Users can insert their own signature requests"
  ON public.signature_requests
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);
  
CREATE POLICY "Users can update their own signature requests"
  ON public.signature_requests
  FOR UPDATE
  USING (auth.uid() = created_by);
  
CREATE POLICY "Users can delete their own signature requests"
  ON public.signature_requests
  FOR DELETE
  USING (auth.uid() = created_by);

-- Policy for signature_signers: users can view and modify signers for their requests
CREATE POLICY "Users can view signers for their requests"
  ON public.signature_signers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.signature_requests
      WHERE id = signature_signers.request_id
      AND created_by = auth.uid()
    )
  );
  
CREATE POLICY "Users can insert signers for their requests"
  ON public.signature_signers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.signature_requests
      WHERE id = signature_signers.request_id
      AND created_by = auth.uid()
    )
  );

-- Policy for signature_records: users can view records for their requests
CREATE POLICY "Users can view signature records for their requests"
  ON public.signature_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.signature_signers
      JOIN public.signature_requests ON signature_requests.id = signature_signers.request_id
      WHERE signature_signers.id = signature_records.signer_id
      AND signature_requests.created_by = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_signature_requests_document_id ON public.signature_requests(document_id);
CREATE INDEX IF NOT EXISTS idx_signature_requests_created_by ON public.signature_requests(created_by);
CREATE INDEX IF NOT EXISTS idx_signature_signers_request_id ON public.signature_signers(request_id);
CREATE INDEX IF NOT EXISTS idx_signature_signers_email ON public.signature_signers(email);
CREATE INDEX IF NOT EXISTS idx_signature_records_signer_id ON public.signature_records(signer_id);
