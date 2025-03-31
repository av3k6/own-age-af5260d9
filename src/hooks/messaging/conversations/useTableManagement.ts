
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
        
        // Create conversations table using raw SQL
        const { error: createConversationsError } = await supabase.rpc(
          'execute_sql',
          {
            sql: `
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
          }
        );
        
        if (createConversationsError) {
          // If execute_sql RPC doesn't exist or fails, try direct SQL query approach
          const { error: directSqlError } = await supabase
            .from('_raw_sql')
            .rpc('CREATE TABLE IF NOT EXISTS public.conversations (' +
                'id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),' +
                'participants TEXT[] NOT NULL,' +
                '"lastMessageAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,' +
                'subject TEXT,' +
                '"propertyId" UUID,' +
                '"unreadCount" INTEGER DEFAULT 0,' +
                'created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' +
                ');');
                
          if (directSqlError) {
            console.error("Error creating conversations table:", directSqlError);
            
            // As a last resort, create a minimal version of the table that will work with our app
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
              throw fallbackError;
            }
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
        
        // Create messages table using raw SQL
        const { error: createMessagesError } = await supabase.rpc(
          'execute_sql',
          {
            sql: `
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
          }
        );
        
        if (createMessagesError) {
          // If execute_sql RPC doesn't exist or fails, try direct SQL query approach
          const { error: directSqlError } = await supabase
            .from('_raw_sql')
            .rpc('CREATE TABLE IF NOT EXISTS public.messages (' +
                'id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),' +
                '"senderId" UUID NOT NULL,' +
                '"receiverId" UUID NOT NULL,' +
                'content TEXT NOT NULL,' +
                'subject TEXT,' +
                'read BOOLEAN DEFAULT FALSE,' +
                '"createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,' +
                'attachments JSONB,' +
                '"conversationId" UUID NOT NULL,' +
                'FOREIGN KEY ("conversationId") REFERENCES conversations(id) ON DELETE CASCADE' +
                ');');
                
          if (directSqlError) {
            console.error("Error creating messages table:", directSqlError);
            
            // As a last resort, don't enforce foreign key and create a minimal table
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
              throw fallbackError;
            }
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
