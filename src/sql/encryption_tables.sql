
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

-- Create indexes for search performance
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                 WHERE indexname = 'idx_messages_content_search') THEN
    CREATE INDEX idx_messages_content_search ON public.messages USING GIN (to_tsvector('english', content));
  END IF;
END $$;

DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                 WHERE indexname = 'idx_conversations_subject_search') THEN
    CREATE INDEX idx_conversations_subject_search ON public.conversations USING GIN (to_tsvector('english', subject));
  END IF;
END $$;

-- Policies for user_encryption_keys
-- Anyone can read public keys (needed for encryption)
CREATE POLICY IF NOT EXISTS "Anyone can read public keys"
  ON public.user_encryption_keys
  FOR SELECT
  USING (true);

-- Users can only update their own keys
CREATE POLICY IF NOT EXISTS "Users can update their own keys"
  ON public.user_encryption_keys
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Users can insert their own keys
CREATE POLICY IF NOT EXISTS "Users can insert their own keys"
  ON public.user_encryption_keys
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Create function to update message delivery status
CREATE OR REPLACE FUNCTION update_message_delivery_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If the message is being marked as read
  IF NEW.read = TRUE AND OLD.read = FALSE THEN
    NEW.delivery_status = 'read';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update delivery status when message is read
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_delivery_status_on_read') THEN
    CREATE TRIGGER update_delivery_status_on_read
    BEFORE UPDATE ON messages
    FOR EACH ROW
    WHEN (NEW.read = TRUE AND OLD.read = FALSE)
    EXECUTE FUNCTION update_message_delivery_status();
  END IF;
END $$;
