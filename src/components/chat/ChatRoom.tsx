import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { VideoPlayer } from "./VideoPlayer";
import { GifPanel } from "./GifPanel";
import { PiWallet } from "./PiWallet";
import { Button } from "@/components/ui/button";
import { Video, Gift, Wallet, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@supabase/supabase-js';

interface Message {
  id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'video' | 'gif';
  video_url?: string;
  gif_url?: string;
  pi_cost: number;
  created_at: string;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
}

interface ChatRoomProps {
  room: ChatRoom;
  user: User;
}

export const ChatRoom = ({ room, user }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showGifPanel, setShowGifPanel] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${room.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', room.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as Message[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal memuat pesan",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (content: string, type: 'text' | 'video' | 'gif' = 'text', mediaUrl?: string) => {
    try {
      const messageData = {
        room_id: room.id,
        user_id: user.id,
        content,
        message_type: type,
        ...(type === 'video' && { video_url: mediaUrl }),
        ...(type === 'gif' && { gif_url: mediaUrl }),
        pi_cost: type === 'gif' ? 0.001 : 0,
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      if (type === 'gif') {
        toast({
          title: "GIF terkirim!",
          description: "GIF berhasil dikirim dengan 0.001 Pi",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{room.name}</h2>
            {room.description && (
              <p className="text-sm text-muted-foreground">{room.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWallet(true)}
            >
              <Wallet size={16} className="mr-1" />
              Pi Wallet
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVideoPlayer(true)}
            >
              <Video size={16} className="mr-1" />
              Video
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGifPanel(true)}
            >
              <Gift size={16} className="mr-1" />
              GIF
            </Button>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users size={16} />
              <span className="text-sm">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} currentUser={user} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput onSendMessage={sendMessage} />

      {/* Modals */}
      {showVideoPlayer && (
        <VideoPlayer
          onClose={() => setShowVideoPlayer(false)}
          onSendVideo={(videoUrl) => {
            sendMessage("Shared a video", "video", videoUrl);
            setShowVideoPlayer(false);
          }}
        />
      )}

      {showGifPanel && (
        <GifPanel
          onClose={() => setShowGifPanel(false)}
          onSendGif={(gifUrl) => {
            sendMessage("Sent a GIF", "gif", gifUrl);
            setShowGifPanel(false);
          }}
        />
      )}

      {showWallet && (
        <PiWallet
          onClose={() => setShowWallet(false)}
          user={user}
        />
      )}
    </div>
  );
};