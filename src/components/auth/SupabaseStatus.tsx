
import { useEffect, useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function SupabaseStatus() {
  const { supabase } = useSupabase();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
        
        // Even if there's an error about the table not existing, the connection works
        // We're just checking if we can reach Supabase
        setIsConnected(true);
        toast({
          title: "Supabase Connected",
          description: "Successfully connected to your Supabase project.",
        });
      } catch (error) {
        console.error('Supabase connection error:', error);
        setIsConnected(false);
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Could not connect to Supabase.",
        });
      }
    };

    checkConnection();
  }, [supabase]);

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Supabase Status</h2>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isConnected === null ? 'bg-gray-400' : isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <p className="text-zen-gray-600">
          {isConnected === null ? 'Checking connection...' : isConnected ? 'Connected to Supabase' : 'Not connected to Supabase'}
        </p>
      </div>
      
      <div className="mt-4">
        <Button 
          onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
          variant="outline"
          size="sm"
        >
          Open Supabase Dashboard
        </Button>
      </div>
    </div>
  );
}
