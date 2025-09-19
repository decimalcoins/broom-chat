import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wallet, X, TrendingUp, Send, Download, History } from "lucide-react";
import type { User } from '@supabase/supabase-js';

interface PiWalletProps {
  onClose: () => void;
  user: User;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'gif';
  amount: number;
  description: string;
  timestamp: string;
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "receive",
    amount: 0.5,
    description: "Received from Pi Faucet",
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    id: "2", 
    type: "gif",
    amount: -0.001,
    description: "Sent Happy Dance GIF",
    timestamp: "2024-01-15T09:15:00Z"
  },
  {
    id: "3",
    type: "gif", 
    amount: -0.002,
    description: "Sent Love GIF",
    timestamp: "2024-01-15T08:45:00Z"
  },
  {
    id: "4",
    type: "send",
    amount: -0.1,
    description: "Sent to User abc123",
    timestamp: "2024-01-14T16:20:00Z"
  }
];

export const PiWallet = ({ onClose, user }: PiWalletProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  
  // Mock balance (in real app, this would come from Pi SDK)
  const balance = 1.234;
  const usdValue = balance * 314159; // GCV rate: 1 π = $314,159

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('id-ID');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <Send size={16} className="text-red-500" />;
      case 'receive':
        return <Download size={16} className="text-green-500" />;
      case 'gif':
        return <TrendingUp size={16} className="text-blue-500" />;
      default:
        return <History size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet size={20} />
              Pi Wallet
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Balance */}
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-6 text-center">
              <div className="space-y-2">
                <p className="text-sm opacity-90">Total Balance</p>
                <div className="text-3xl font-bold">{balance.toFixed(6)} π</div>
                <p className="text-sm opacity-90">
                  ≈ {formatCurrency(usdValue)}
                </p>
                <Badge variant="secondary" className="text-xs">
                  GCV Rate: 1π = $314,159
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('overview')}
              className="flex-1"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'transactions' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('transactions')}
              className="flex-1"
            >
              Transactions
            </Button>
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">+0.497</div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">12</div>
                  <p className="text-sm text-muted-foreground">GIFs Sent</p>
                </Card>
              </div>

              <Card className="p-4">
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Send size={16} className="mr-2" />
                    Kirim Pi
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download size={16} className="mr-2" />
                    Minta Pi
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp size={16} className="mr-2" />
                    Pi Faucet
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="space-y-2">
                {mockTransactions.map((tx, index) => (
                  <div key={tx.id}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(tx.type)}
                        <div>
                          <p className="text-sm font-medium">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(tx.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${
                        tx.amount > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(6)} π
                      </div>
                    </div>
                    {index < mockTransactions.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
              
              {mockTransactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <History size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Belum ada transaksi</p>
                </div>
              )}
            </div>
          )}

          {/* Pi Network Info */}
          <Card className="p-4 bg-accent/50">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Pi Network Integration</p>
              <p className="text-xs text-muted-foreground">
                Wallet terhubung dengan Pi Network untuk transaksi real-time
              </p>
              <Badge variant="outline" className="text-xs">
                Testnet Mode
              </Badge>
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};