
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 bg-white dark:bg-gray-800 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32 transition-colors duration-300">
          <svg
            className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white dark:text-gray-800 lg:block transition-colors duration-300"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="relative px-4 pt-6 sm:px-6 lg:px-8">
            {/* Navigation placeholder */}
          </div>

          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl transition-colors duration-300">
                <span className="block xl:inline">Real Estate Transactions</span>{" "}
                <span className="block text-zen-blue-500 dark:text-zen-blue-400 xl:inline">Made Simple</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0 transition-colors duration-300">
                Buy and sell properties directly online without agents. Schedule showings, make offers, 
                and close deals all in one place with our secure, transparent platform.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/buy">
                    <Button className="flex w-full items-center justify-center rounded-md px-8 py-3 text-base font-medium bg-zen-blue-500 hover:bg-zen-blue-600 dark:bg-zen-blue-600 dark:hover:bg-zen-blue-700 transition-colors duration-300">
                      Find a Home
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/sell">
                    <Button
                      variant="outline"
                      className="flex w-full items-center justify-center rounded-md px-8 py-3 text-base font-medium border-zen-blue-500 text-zen-blue-500 hover:bg-blue-50 dark:border-zen-blue-400 dark:text-zen-blue-400 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      Sell Your Property
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
          src="https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt="Modern home with pool"
        />
      </div>
    </div>
  );
};

export default Hero;
