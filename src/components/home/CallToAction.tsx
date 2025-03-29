
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 mx-auto">
        <div className="bg-gradient-to-r from-zen-blue-500 to-zen-teal-500 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="p-8 md:p-12 md:w-3/5">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Experience Agent-Free Real Estate?
              </h2>
              <p className="text-blue-100 text-lg mb-6 md:pr-8">
                Join thousands of buyers and sellers who are saving money and enjoying a stress-free real estate experience with our platform.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button className="bg-white text-zen-blue-600 hover:bg-blue-50">
                  Get Started
                </Button>
                <Link to="/how-it-works">
                  <Button variant="outline" className="border-white text-white hover:bg-blue-600">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block md:w-2/5">
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                alt="Beautiful home"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
