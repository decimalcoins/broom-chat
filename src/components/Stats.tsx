import { TrendingUp, Users, ShoppingBag, Award } from "lucide-react";

const stats = [
  {
    icon: ShoppingBag,
    value: "50,000+",
    label: "Products Available",
    description: "Across all categories"
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Verified Sellers",
    description: "Trusted merchants worldwide"
  },
  {
    icon: TrendingUp,
    value: "1M+",
    label: "Transactions",
    description: "Completed with Pi Network"
  },
  {
    icon: Award,
    value: "4.9/5",
    label: "Customer Rating",
    description: "Based on 100K+ reviews"
  }
];

export const Stats = () => {
  return (
    <section className="py-16 bg-gradient-primary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Millions
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Join the world's fastest-growing Pi Network marketplace
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.label}
                className="text-center text-white group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                  <IconComponent className="h-8 w-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-white/80 text-sm">{stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};