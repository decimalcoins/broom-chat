import { Button } from "@/components/ui/button";
import heroImage from "@/assets/marketplace-hero.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container relative z-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Discover Amazing Products on 
              <span className="block text-primary-light">Broom Marketplace</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Powered by Pi Network - Shop securely with cryptocurrency and discover unique products from verified sellers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                Start Shopping
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Become a Seller
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-white/80 text-sm">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-white/80 text-sm">Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100K+</div>
                <div className="text-white/80 text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src={heroImage} 
              alt="Broom Marketplace Products" 
              className="w-full h-auto rounded-2xl shadow-large"
            />
          </div>
        </div>
      </div>
    </section>
  );
};