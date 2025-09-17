import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/src/assets/broom-logo.png" alt="broom" className="h-8" />
            <h1 className="text-xl font-bold text-foreground">broom</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Categories</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Deals</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Sellers</a>
          </nav>
        </div>

        <div className="flex-1 max-w-sm mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 bg-marketplace-section border-border focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};