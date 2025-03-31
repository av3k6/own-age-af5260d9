
import { useSupabase } from "@/hooks/useSupabase";

export function useTableManagement() {
  const { supabase } = useSupabase();

  const ensureTablesExist = async () => {
    try {
      console.log("Creating conversations and messages tables for development");
      
      // Check if conversations table exists
      const { error: checkConversationsError, count } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true });
      
      // If we get a "relation does not exist" error, create the table
      if (checkConversationsError && checkConversationsError.code === '42P01') {
        console.log("Conversations table doesn't exist, creating it now");
        
        // Try to create the table with direct SQL
        try {
          // First try to enable the uuid-ossp extension for uuid_generate_v4()
          await supabase.rpc('execute_sql', {
            query: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
          });
          
          // Then create the conversations table
          await supabase.rpc('execute_sql', {
            query: `
              CREATE TABLE IF NOT EXISTS public.conversations (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                participants TEXT[] NOT NULL,
                "lastMessageAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                subject TEXT,
                "propertyId" UUID,
                "unreadCount" INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
              );
            `
          });
        } catch (sqlError) {
          console.error("Error creating conversations table with SQL:", sqlError);
          
          // As a last resort, try to create a minimal version by inserting a record
          try {
            const { error: fallbackError } = await supabase
              .from('conversations')
              .insert({
                id: '00000000-0000-0000-0000-000000000000',
                participants: ['system'],
                lastMessageAt: new Date().toISOString(),
                subject: 'System Initialization',
                unreadCount: 0
              })
              .select();
              
            if (fallbackError && fallbackError.code !== '23505') { // Ignore duplicate key errors
              console.error("Fallback conversation creation failed:", fallbackError);
            }
          } catch (insertError) {
            console.error("Failed to create conversations table with insert:", insertError);
          }
        }
      }
      
      // Check if messages table exists
      const { error: checkMessagesError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });
      
      // If we get a "relation does not exist" error, create the table
      if (checkMessagesError && checkMessagesError.code === '42P01') {
        console.log("Messages table doesn't exist, creating it now");
        
        // Try to create the table with direct SQL
        try {
          await supabase.rpc('execute_sql', {
            query: `
              CREATE TABLE IF NOT EXISTS public.messages (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "senderId" UUID NOT NULL,
                "receiverId" UUID NOT NULL,
                content TEXT NOT NULL,
                subject TEXT,
                read BOOLEAN DEFAULT FALSE,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                attachments JSONB,
                "conversationId" UUID NOT NULL,
                FOREIGN KEY ("conversationId") REFERENCES conversations(id) ON DELETE CASCADE
              );
            `
          });
        } catch (sqlError) {
          console.error("Error creating messages table with SQL:", sqlError);
          
          // As a last resort, try to create a minimal version by inserting a record
          try {
            const { error: fallbackError } = await supabase
              .from('messages')
              .insert({
                id: '00000000-0000-0000-0000-000000000000',
                senderId: '00000000-0000-0000-0000-000000000000',
                receiverId: '00000000-0000-0000-0000-000000000000',
                content: 'System initialization message',
                read: true,
                createdAt: new Date().toISOString(),
                conversationId: '00000000-0000-0000-0000-000000000000'
              })
              .select();
              
            if (fallbackError && fallbackError.code !== '23505') { // Ignore duplicate key errors
              console.error("Fallback message creation failed:", fallbackError);
            }
          } catch (insertError) {
            console.error("Failed to create messages table with insert:", insertError);
          }
        }
      }
      
      console.log("Finished checking/creating tables");
      return true;
    } catch (error) {
      console.error("Error ensuring tables exist:", error);
      return false;
    }
  };

  return { ensureTablesExist };
}
