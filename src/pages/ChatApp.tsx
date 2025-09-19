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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
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