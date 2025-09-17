import { Smartphone, Headphones, Laptop, ShirtIcon, Home, Watch, Camera, Gamepad2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Electronics", icon: Smartphone, count: "12.5K", color: "bg-blue-100 text-blue-600" },
  { name: "Audio", icon: Headphones, count: "3.2K", color: "bg-purple-100 text-purple-600" },
  { name: "Computers", icon: Laptop, count: "8.1K", color: "bg-green-100 text-green-600" },
  { name: "Fashion", icon: ShirtIcon, count: "15.8K", color: "bg-pink-100 text-pink-600" },
  { name: "Home & Garden", icon: Home, count: "6.4K", color: "bg-orange-100 text-orange-600" },
  { name: "Watches", icon: Watch, count: "2.7K", color: "bg-indigo-100 text-indigo-600" },
  { name: "Cameras", icon: Camera, count: "1.9K", color: "bg-red-100 text-red-600" },
  { name: "Gaming", icon: Gamepad2, count: "4.3K", color: "bg-yellow-100 text-yellow-600" },
];

export const Categories = () => {
  return (
    <section className="py-16 bg-marketplace-section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover thousands of products across all categories with Pi Network payments
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.name} 
                className="group cursor-pointer hover:shadow-medium transition-all duration-300 bg-gradient-card border-0"
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`w-12 h-12 mx-auto rounded-full ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.count} items</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};