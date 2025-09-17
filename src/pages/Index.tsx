import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Stats } from "@/components/Stats";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-marketplace-bg">
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Stats />
      </main>
      <Footer />
    </div>
  );
};

export default Index;