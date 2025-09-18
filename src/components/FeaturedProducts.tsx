import { ProductCard } from "./ProductCard";
import phoneImage from "@/assets/product-phone.jpg";
import headphonesImage from "@/assets/product-headphones.jpg";
import laptopImage from "@/assets/product-laptop.jpg";
import shoesImage from "@/assets/product-shoes.jpg";
import watchImage from "@/assets/product-watch.jpg";

const featuredProducts = [
  {
    id: "1",
    name: "Premium Smartphone Pro Max 256GB",
    price: 899,
    originalPrice: 1199,
    image: phoneImage,
    rating: 4.8,
    reviews: 1250,
    seller: "TechStore Official",
    badge: "Best Seller"
  },
  {
    id: "2", 
    name: "Wireless Noise-Canceling Headphones",
    price: 299,
    originalPrice: 399,
    image: headphonesImage,
    rating: 4.7,
    reviews: 856,
    seller: "AudioPro",
    badge: "New"
  },
  {
    id: "3",
    name: "MacBook Pro 14-inch M3 Chip",
    price: 1999,
    image: laptopImage,
    rating: 4.9,
    reviews: 542,
    seller: "Apple Authorized",
  },
  {
    id: "4",
    name: "Premium Running Sneakers",
    price: 129,
    originalPrice: 179,
    image: shoesImage,
    rating: 4.6,
    reviews: 923,
    seller: "SportGear",
    badge: "Sale"
  },
  {
    id: "5",
    name: "Smart Watch Series 9 GPS + Cellular",
    price: 449,
    image: watchImage,
    rating: 4.8,
    reviews: 1134,
    seller: "WearableTech",
  },
  {
    id: "6",
    name: "Premium Smartphone Pro Max 256GB",
    price: 899,
    originalPrice: 1199,
    image: phoneImage,
    rating: 4.8,
    reviews: 1250,
    seller: "TechStore Official",
  }
];

export const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-marketplace-bg">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Handpicked products from trusted sellers
            </p>
          </div>
          <button className="text-primary hover:text-primary-hover font-semibold transition-colors">
            View All →
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};