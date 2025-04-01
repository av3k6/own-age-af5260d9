
-- Run these SQL commands in the Supabase SQL Editor to create proper tables

-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  participants TEXT[] NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subject TEXT,
  property_id TEXT,  -- Changed from UUID with foreign key to simple TEXT
  unread_count INTEGER DEFAULT 0,
  
  -- Add proper RLS policies
  CONSTRAINT participants_not_empty CHECK (array_length(participants, 1) > 0)
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  attachments JSONB
);

-- Add proper indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations USING GIN(participants);

-- Enable RLS on both tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view their own conversations"
  ON public.conversations
  FOR SELECT
  USING (auth.uid()::text = ANY(participants));

CREATE POLICY "Users can insert conversations they're part of"
  ON public.conversations
  FOR INSERT
  WITH CHECK (auth.uid()::text = ANY(participants));

CREATE POLICY "Users can update their own conversations"
  ON public.conversations
  FOR UPDATE
  USING (auth.uid()::text = ANY(participants));

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND auth.uid()::text = ANY(conversations.participants)
  ));

CREATE POLICY "Users can insert messages in their conversations"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND auth.uid()::text = ANY(conversations.participants)
    )
  );

-- Create a function to update unread counts
CREATE OR REPLACE FUNCTION update_conversation_unread_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment unread count when a new message is added
  UPDATE conversations
  SET unread_count = unread_count + 1
  WHERE id = NEW.conversation_id
  AND NOT (participants @> ARRAY[NEW.sender_id]);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call this function when a new message is inserted
CREATE TRIGGER update_unread_count_on_new_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_unread_count();
