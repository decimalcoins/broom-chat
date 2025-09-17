import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  badge?: string;
}

export const ProductCard = ({ 
  name, 
  price, 
  originalPrice, 
  image, 
  rating, 
  reviews, 
  seller,
  badge 
}: ProductCardProps) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card className="group overflow-hidden bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 border-0">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            {badge}
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            -{discount}%
          </Badge>
        )}
        <Button 
          size="sm" 
          variant="ghost" 
          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground">by {seller}</p>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-rating text-rating' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-price text-lg">π{price}</span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  π{originalPrice}
                </span>
              )}
            </div>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary-hover">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};