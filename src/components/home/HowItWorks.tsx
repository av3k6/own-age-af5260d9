
import { Check } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Browse & Research",
      description: "Search properties based on your criteria and view detailed information including photos, virtual tours, and neighborhood data.",
      icon: (
        <div className="bg-zen-blue-100 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zen-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      ),
    },
    {
      title: "Schedule Showings",
      description: "Arrange property viewings directly with sellers through our integrated scheduling system. No agents required.",
      icon: (
        <div className="bg-zen-teal-100 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zen-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ),
    },
    {
      title: "Make Offers",
      description: "Submit and negotiate offers directly through our platform with our guided offer creation system.",
      icon: (
        <div className="bg-zen-green-100 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zen-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
    },
    {
      title: "Finalize & Close",
      description: "Complete your transaction with secure document sharing and electronic signatures, all on our platform.",
      icon: (
        <div className="bg-zen-gray-100 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zen-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-zen-gray-800">How It Works</h2>
          <p className="mt-2 text-lg text-zen-gray-600">
            Our agent-free platform makes real estate transactions simple and transparent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-zen-gray-800 mb-2">{step.title}</h3>
              <p className="text-zen-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-zen-blue-50 rounded-xl p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-zen-gray-800 mb-4">
                Why Choose Our Platform?
              </h3>
              <ul className="space-y-3">
                {[
                  "Save on commission fees",
                  "Direct communication between buyers and sellers",
                  "Transparent transaction process",
                  "Integrated professional services",
                  "Secure document management",
                  "Electronic signatures",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-zen-blue-500 mr-2 mt-0.5" />
                    <span className="text-zen-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
                alt="Happy homeowners"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
