
import Hero from "@/components/home/Hero";
import FeaturedListings from "@/components/home/FeaturedListings";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import SupabaseStatus from "@/components/auth/SupabaseStatus";

const Index = () => {
  console.log("Rendering Index/Home component");
  return (
    <div>
      <Hero />
      <FeaturedListings />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      
      {/* Only visible during development */}
      {import.meta.env.DEV && (
        <div className="container mx-auto px-4 py-8">
          <SupabaseStatus />
        </div>
      )}
    </div>
  );
};

export default Index;
