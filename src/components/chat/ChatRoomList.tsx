import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Users, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface ChatRoomListProps {
  onSelectRoom: (room: ChatRoom) => void;
  selectedRoom: ChatRoom | null;
}

export const ChatRoomList = ({ onSelectRoom, selectedRoom }: ChatRoomListProps) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal memuat daftar ruangan",
        variant: "destructive",
      });
    }
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const { data, error } = await supabase
        .from("chat_rooms")
        .insert({
          name: newRoomName,
          description: newRoomDesc,
        })
        .select()
        .single();

      if (error) throw error;

      setRooms([data, ...rooms]);
      setNewRoomName("");
      setNewRoomDesc("");
      setShowCreateForm(false);
      
      toast({
        title: "Ruangan dibuat!",
        description: `Ruangan "${data.name}" berhasil dibuat`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal membuat ruangan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="w-full flex items-center gap-2"
        variant="outline"
      >
        <Plus size={16} />
        Buat Ruangan
      </Button>

      {showCreateForm && (
        <Card className="p-4 space-y-3">
          <Input
            placeholder="Nama ruangan"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <Input
            placeholder="Deskripsi (opsional)"
            value={newRoomDesc}
            onChange={(e) => setNewRoomDesc(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={createRoom} size="sm" className="flex-1">
              Buat
            </Button>
            <Button
              onClick={() => setShowCreateForm(false)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Batal
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
              selectedRoom?.id === room.id ? "bg-accent border-primary" : ""
            }`}
            onClick={() => onSelectRoom(room)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Video size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{room.name}</h3>
                {room.description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {room.description}
                  </p>
                )}
              </div>
              <Users size={14} className="text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Video size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm">Belum ada ruangan chat.</p>
          <p className="text-sm">Buat ruangan pertama!</p>
        </div>
      )}
    </div>
  );
};