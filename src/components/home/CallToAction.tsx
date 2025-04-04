
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-zen-blue-700 to-zen-blue-500 opacity-90">
        <img
          src="public/lovable-uploads/f8ab30ab-c80f-45ce-bfa8-72ad4cb2d8c3.png"
          alt="Luxury home with pool"
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>
      <div className="relative container mx-auto px-6 py-8 text-white z-10">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience Agent-Free Real Estate?</h2>
          <p className="text-lg mb-8">
            Join thousands of buyers and sellers who are saving money and enjoying a stress-free
            real estate experience with our platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-zen-blue-700 hover:bg-white/90 font-semibold">
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white bg-transparent hover:bg-white/20 dark:text-white dark:border-white dark:hover:bg-white/20 font-semibold"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
