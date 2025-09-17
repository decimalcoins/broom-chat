import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-primary"></div>
              <h3 className="text-xl font-bold">Broom Marketplace</h3>
            </div>
            <p className="text-white/70 leading-relaxed">
              The world's first Pi Network-powered marketplace. Shop securely with cryptocurrency and discover amazing products from verified sellers.
            </p>
            <div className="flex items-center gap-4">
              <Facebook className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Seller Center</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Pi Network Integration</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Electronics</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Fashion</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Home & Garden</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Sports</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Books & Media</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-white/70">support@broommarketplace.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-white/70">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-white/70">123 Pi Network Street, Crypto City</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white/70 text-sm">
            © 2024 Broom Marketplace. All rights reserved. Powered by Pi Network.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};