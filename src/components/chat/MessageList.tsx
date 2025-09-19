import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Gift } from "lucide-react";
import { format } from "date-fns";
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

interface MessageListProps {
  messages: Message[];
  currentUser: User;
}

export const MessageList = ({ messages, currentUser }: MessageListProps) => {
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), "HH:mm");
  };

  const isOwnMessage = (message: Message) => {
    return message.user_id === currentUser.id;
  };

  const getUserDisplayName = (userId: string) => {
    if (userId === currentUser.id) {
      return "You";
    }
    return `User ${userId.slice(-4)}`;
  };

  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        {messages.map((message) => {
          const isOwn = isOwnMessage(message);
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] ${isOwn ? "ml-auto" : "mr-auto"}`}>
                {/* User info */}
                {!isOwn && (
                  <div className="text-xs text-muted-foreground mb-1 px-3">
                    {getUserDisplayName(message.user_id)}
                  </div>
                )}
                
                <Card className={`p-3 ${
                  isOwn 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card"
                }`}>
                  {/* Message content */}
                  {message.message_type === 'text' && (
                    <p className="text-sm">{message.content}</p>
                  )}
                  
                  {message.message_type === 'video' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Video size={16} />
                        <span>Video shared</span>
                      </div>
                      {message.video_url && (
                        <video
                          controls
                          className="w-full max-w-sm rounded"
                          preload="metadata"
                        >
                          <source src={message.video_url} type="video/mp4" />
                          Your browser does not support video.
                        </video>
                      )}
                      <p className="text-xs opacity-80">{message.content}</p>
                    </div>
                  )}
                  
                  {message.message_type === 'gif' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Gift size={16} />
                        <span>GIF thrown!</span>
                        {message.pi_cost > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {message.pi_cost} π
                          </Badge>
                        )}
                      </div>
                      {message.gif_url && (
                        <img
                          src={message.gif_url}
                          alt="GIF"
                          className="w-full max-w-sm rounded"
                        />
                      )}
                      <p className="text-xs opacity-80">{message.content}</p>
                    </div>
                  )}
                  
                  {/* Timestamp */}
                  <div className={`text-xs mt-1 ${
                    isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}>
                    {formatTime(message.created_at)}
                  </div>
                </Card>
              </div>
            </div>
          );
        })}
        
        {messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Belum ada pesan di ruangan ini.</p>
            <p className="text-sm">Jadilah yang pertama mengirim pesan!</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};