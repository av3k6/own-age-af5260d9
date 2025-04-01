
-- Create table for storing user public keys
CREATE TABLE IF NOT EXISTS public.user_encryption_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_encryption_keys_user_id ON public.user_encryption_keys(user_id);

-- Enable row-level security
ALTER TABLE public.user_encryption_keys ENABLE ROW LEVEL SECURITY;

-- Add category field to conversations table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'conversations' 
                 AND column_name = 'category') THEN
    ALTER TABLE public.conversations ADD COLUMN category TEXT DEFAULT 'general';
  END IF;
END $$;

-- Add is_encrypted field to conversations table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'conversations' 
                 AND column_name = 'is_encrypted') THEN
    ALTER TABLE public.conversations ADD COLUMN is_encrypted BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add encrypted_content field to messages table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'messages' 
                 AND column_name = 'encrypted_content') THEN
    ALTER TABLE public.messages ADD COLUMN encrypted_content JSONB;
  END IF;
END $$;

-- Add delivery_status field to messages table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'messages' 
                 AND column_name = 'delivery_status') THEN
    ALTER TABLE public.messages ADD COLUMN delivery_status TEXT DEFAULT 'sent';
  END IF;
END $$;

-- Policies for user_encryption_keys
-- Anyone can read public keys (needed for encryption)
CREATE POLICY "Anyone can read public keys"
  ON public.user_encryption_keys
  FOR SELECT
  USING (true);

-- Users can only update their own keys
CREATE POLICY "Users can update their own keys"
  ON public.user_encryption_keys
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Users can insert their own keys
CREATE POLICY "Users can insert their own keys"
  ON public.user_encryption_keys
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);
