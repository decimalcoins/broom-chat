import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, X, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/types/pi";

interface GifPanelProps {
  onClose: () => void;
  onSendGif: (gifUrl: string) => void;
}

// Popular GIF URLs (in real app, this would come from GIPHY API)
const popularGifs = [
  {
    id: "1",
    url: "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
    title: "Happy Dance",
    cost: 0.001
  },
  {
    id: "2", 
    url: "https://media.giphy.com/media/l4FGuhL4U2WyjdkaY/giphy.gif",
    title: "Thumbs Up",
    cost: 0.001
  },
  {
    id: "3",
    url: "https://media.giphy.com/media/26BRrSvJUa0crqw4E/giphy.gif", 
    title: "High Five",
    cost: 0.001
  },
  {
    id: "4",
    url: "https://media.giphy.com/media/l0MYryZTmQgvHI5TG/giphy.gif",
    title: "Clap",
    cost: 0.001
  },
  {
    id: "5",
    url: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
    title: "Love",
    cost: 0.002
  },
  {
    id: "6",
    url: "https://media.giphy.com/media/l0MYGb8173drMQx5S/giphy.gif",
    title: "Surprise",
    cost: 0.002
  },
  {
    id: "7",
    url: "https://media.giphy.com/media/3orieUe6ejxSFxYCXe/giphy.gif",
    title: "Celebration",
    cost: 0.003
  },
  {
    id: "8",
    url: "https://media.giphy.com/media/l0MYP6WAFfaR7Q1jO/giphy.gif",
    title: "Gold Star",
    cost: 0.005
  }
];

export const GifPanel = ({ onClose, onSendGif }: GifPanelProps) => {
  const [selectedGif, setSelectedGif] = useState<typeof popularGifs[0] | null>(null);
  const { toast } = useToast();

  const handleGifSelect = (gif: typeof popularGifs[0]) => {
    setSelectedGif(gif);
  };

  const handleSendGif = async () => {
    if (!selectedGif) return;

    try {
      // Create Pi payment
      await window.Pi.createPayment({
        amount: selectedGif.cost,
        memo: `GIF: ${selectedGif.title}`,
        metadata: { gifId: selectedGif.id, type: 'gif_purchase' }
      }, {
        onReadyForServerApproval: function(paymentId) {
          console.log('Payment ready for server approval:', paymentId);
        },
        onReadyForServerCompletion: function(paymentId, txid) {
          console.log('Payment completed:', paymentId, txid);
          toast({
            title: "GIF Terkirim!",
            description: `Berhasil mengirim ${selectedGif.title} dengan ${selectedGif.cost} Pi`,
          });
          onSendGif(selectedGif.url);
          onClose();
        },
        onCancel: function(paymentId) {
          console.log('Payment cancelled:', paymentId);
          toast({
            title: "Pembayaran Dibatalkan",
            description: "Transaksi Pi dibatalkan",
            variant: "destructive",
          });
        },
        onError: function(error, payment) {
          console.error('Payment error:', error);
          toast({
            title: "Error",
            description: "Gagal memproses pembayaran Pi",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error('Pi payment error:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim GIF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gift size={20} />
              Lempar GIF dengan Pi Coins
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins size={20} className="text-primary" />
              <span className="font-medium">Pi Coin Balance: 1.234 π</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Setiap GIF memiliki harga berbeda dalam Pi coins
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularGifs.map((gif) => (
              <Card
                key={gif.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedGif?.id === gif.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleGifSelect(gif)}
              >
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={gif.url}
                    alt={gif.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{gif.title}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {gif.cost} π
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          {selectedGif && (
            <Card className="p-4 bg-accent/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedGif.url}
                    alt={selectedGif.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{selectedGif.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Harga: {selectedGif.cost} π
                    </p>
                  </div>
                </div>
                
                <Button onClick={handleSendGif} className="flex items-center gap-2">
                  <Gift size={16} />
                  Lempar GIF
                </Button>
              </div>
            </Card>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>💡 Tip: GIF yang lebih eksklusif memiliki harga Pi yang lebih tinggi</p>
            <p>Pi coins akan otomatis dipotong dari wallet Anda</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};