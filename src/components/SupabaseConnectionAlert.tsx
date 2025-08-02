import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle } from 'lucide-react';

const SupabaseConnectionAlert = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-md w-full">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Supabase Not Connected</h3>
              <p>
                Your Health Mate app requires Supabase to be connected for authentication and data storage.
              </p>
              <div className="space-y-2">
                <p className="font-medium">To connect Supabase:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Click the green <strong>"Supabase"</strong> button in the top-right of your Lovable interface</li>
                  <li>Follow the prompts to connect or create a Supabase project</li>
                  <li>Once connected, refresh this page</li>
                </ol>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Refresh Page After Connecting
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default SupabaseConnectionAlert;