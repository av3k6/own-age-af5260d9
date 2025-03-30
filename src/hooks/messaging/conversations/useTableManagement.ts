
import { useSupabase } from "@/hooks/useSupabase";

export function useTableManagement() {
  const { supabase } = useSupabase();

  const ensureTablesExist = async () => {
    try {
      // Check if the conversations table exists
      const { error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .limit(1);
          
      if (checkError && checkError.message.includes('does not exist')) {
        console.log("Creating conversations and messages tables for development");
        
        // Create conversations table
        const { error: createConvError } = await supabase
          .rpc('create_conversations_table_if_not_exists');
          
        if (createConvError) {
          console.error("Error creating conversations table:", createConvError);
        }
        
        // Create messages table
        const { error: createMsgError } = await supabase
          .rpc('create_messages_table_if_not_exists');
          
        if (createMsgError) {
          console.error("Error creating messages table:", createMsgError);
        }
      }
    } catch (e) {
      console.error("Error checking or creating tables:", e);
    }
  };

  return { ensureTablesExist };
}
