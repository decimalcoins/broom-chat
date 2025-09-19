import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Coins, Shield } from "lucide-react";

// Declare Pi global type
declare global {
  interface Window {
    Pi: {
      init: (config: any) => Promise<void>;
      authenticate: (scopes: string[], onIncompletePaymentFound?: (payment: any) => void) => Promise<{
        accessToken: string;
        user: {
          uid: string;
          username: string;
        };
      }>;
    };
  }
}

export const AuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [piInitialized, setPiInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Pi Network SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.onload = initializePi;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializePi = async () => {
    try {
      await window.Pi.init({
        version: "2.0",
        sandbox: true, // Change to false for production
      });
      setPiInitialized(true);
      
      toast({
        title: "Pi SDK Ready",
        description: "Pi Network SDK berhasil dimuat",
      });
    } catch (error) {
      console.error('Pi SDK initialization failed:', error);
      toast({
        title: "Error",
        description: "Gagal memuat Pi Network SDK",
        variant: "destructive",
      });
    }
  };

  const handlePiAuth = async () => {
    if (!piInitialized) {
      toast({
        title: "Error",
        description: "Pi SDK belum siap. Silakan tunggu...",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Authenticate with Pi Network
      const authResult = await window.Pi.authenticate(
        ["username", "payments"], 
        (payment) => {
          console.log("Incomplete payment found:", payment);
        }
      );

      console.log("Pi authentication successful:", authResult);

      // Create or update user profile in Supabase
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('pi_user_id', authResult.user.uid)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!existingProfile) {
        // Create new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            pi_user_id: authResult.user.uid,
            username: authResult.user.username,
          });

        if (insertError) throw insertError;
      }

      // Create a custom auth session using Pi data
      const customUser = {
        id: authResult.user.uid,
        email: `${authResult.user.username}@pi.network`,
        user_metadata: {
          username: authResult.user.username,
          pi_user_id: authResult.user.uid,
        }
      };

      // Store Pi auth data in localStorage for session management
      localStorage.setItem('pi_auth', JSON.stringify({
        accessToken: authResult.accessToken,
        user: customUser,
        authenticated: true,
        timestamp: Date.now(),
      }));

      // Trigger a custom event for auth state change
      window.dispatchEvent(new CustomEvent('pi-auth-success', { 
        detail: { user: customUser } 
      }));

      toast({
        title: "Login berhasil!",
        description: `Selamat datang ${authResult.user.username}!`,
      });

    } catch (error: any) {
      console.error('Pi authentication error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal login dengan Pi Network",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Coins size={32} className="text-primary" />
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Pi Chat
            </CardTitle>
          </div>
          <p className="text-muted-foreground">
            Live chat dengan video sharing menggunakan Pi Network
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Pi Network Login */}
          <div className="space-y-4">
            <Button 
              onClick={handlePiAuth} 
              className="w-full h-12 flex items-center gap-3 bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={loading || !piInitialized}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Coins size={20} />
                  Login dengan Pi Network
                </>
              )}
            </Button>

            {!piInitialized && (
              <div className="text-center">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Memuat Pi Network SDK...
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-center">Fitur Aplikasi:</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                <span>Otentikasi aman dengan Pi Network</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-primary" />
                <span>Kirim GIF dengan Pi coins</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-primary/20 rounded text-center text-xs leading-4">📹</span>
                <span>Share video singkat real-time</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Dengan masuk, Anda menyetujui penggunaan Pi Network untuk transaksi
            </p>
            <p className="text-xs text-primary">
              Mode Sandbox Aktif - Untuk Testing
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};