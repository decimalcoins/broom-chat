import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatRoomList } from "@/components/chat/ChatRoomList";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { AuthForm } from "@/components/auth/AuthForm";
import type { User, Session } from '@supabase/supabase-js';

interface ChatRoomType {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

const ChatApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing Pi auth
    const piAuth = localStorage.getItem('pi_auth');
    if (piAuth) {
      try {
        const authData = JSON.parse(piAuth);
        if (authData.authenticated && authData.user) {
          setUser(authData.user);
          setSession({
            access_token: authData.accessToken,
            user: authData.user,
          } as Session);
        }
      } catch (error) {
        console.error('Error parsing Pi auth data:', error);
        localStorage.removeItem('pi_auth');
      }
    }

    // Listen for Pi auth success
    const handlePiAuthSuccess = (event: CustomEvent) => {
      setUser(event.detail.user);
      setSession({
        access_token: 'pi_token',
        user: event.detail.user,
      } as Session);
    };

    window.addEventListener('pi-auth-success', handlePiAuthSuccess as EventListener);

    return () => {
      window.removeEventListener('pi-auth-success', handlePiAuthSuccess as EventListener);
    };
  }, []);

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="h-screen flex bg-background">
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Pi Chat</h1>
          <p className="text-sm text-muted-foreground">Live video chat dengan Pi coins</p>
        </div>
        <ChatRoomList 
          onSelectRoom={setSelectedRoom}
          selectedRoom={selectedRoom}
        />
      </div>
      
      <div className="flex-1">
        {selectedRoom ? (
          <ChatRoom room={selectedRoom} user={user} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Selamat datang di Pi Chat
              </h2>
              <p className="text-muted-foreground">
                Pilih ruang chat untuk mulai berbincang dan berbagi video
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;