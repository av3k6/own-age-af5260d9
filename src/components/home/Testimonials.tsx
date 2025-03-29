
const testimonials = [
  {
    quote: "We saved over $20,000 in commission fees using TransacZen Haven. The process was smooth, and we had full control over the sale of our home.",
    author: "Sarah & Michael Davis",
    role: "Sellers from Toronto",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
  },
  {
    quote: "As a first-time buyer, I was worried about navigating the process without an agent. TransacZen Haven made it simple with their step-by-step guidance.",
    author: "Jason Wong",
    role: "Buyer from Vancouver",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    quote: "The scheduling system made it easy to arrange showings that worked with my busy schedule. I could filter professionals by rating to find the best home inspector.",
    author: "Rebecca Johnson",
    role: "Buyer from Montreal",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80",
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 bg-zen-blue-500 dark:bg-zen-blue-800 text-white transition-colors duration-300">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">What Our Users Say</h2>
          <p className="mt-2 text-lg text-blue-100">
            Real stories from people who've experienced our agent-free platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-zen-gray-800 dark:text-white transition-colors duration-300"
            >
              <div className="mb-4">
                <svg width="45" height="36" className="text-zen-blue-200 dark:text-zen-blue-500 mb-4" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.4 36C11.3333 36 9.53333 35.2 8 33.6C6.53333 32 5.8 30.1333 5.8 28C5.8 25.8667 6.53333 24 8 22.4C9.53333 20.8 11.3333 20 13.4 20C13.8 20 14.3333 20.0667 15 20.2C14.6 17.8667 13.5333 15.8 11.8 14C10.0667 12.1333 7.93333 11.0667 5.4 10.8L5 10.6L5.2 10.2C5.33333 9.93333 5.46667 9.73333 5.6 9.6C5.8 9.46667 6 9.33333 6.2 9.2C6.4 8.93333 6.73333 8.66667 7.2 8.4C7.66667 8.13333 8.2 8 8.8 8C12.9333 8 16.4 9.53333 19.2 12.6C22 15.6667 23.4 19.0667 23.4 22.8C23.4 26.5333 22.2 29.4667 19.8 31.6C17.4 33.7333 15.4 34.8 13.8 35C13.6667 35.0667 13.5333 35.0667 13.4 36ZM35 36C32.9333 36 31.1333 35.2 29.6 33.6C28.1333 32 27.4 30.1333 27.4 28C27.4 25.8667 28.1333 24 29.6 22.4C31.1333 20.8 32.9333 20 35 20C35.4 20 35.9333 20.0667 36.6 20.2C36.2 17.8667 35.1333 15.8 33.4 14C31.6667 12.1333 29.5333 11.0667 27 10.8L26.6 10.6L26.8 10.2C26.9333 9.93333 27.0667 9.73333 27.2 9.6C27.4 9.46667 27.6 9.33333 27.8 9.2C28.0667 8.93333 28.4 8.66667 28.8 8.4C29.2667 8.13333 29.8 8 30.4 8C34.5333 8 38 9.53333 40.8 12.6C43.6 15.6667 45 19.0667 45 22.8C45 26.5333 43.8 29.4667 41.4 31.6C39 33.7333 37 34.8 35.4 35C35.2667 35.0667 35.1333 35.0667 35 36Z" fill="currentColor"/>
                </svg>
                <p className="text-lg mb-4 dark:text-gray-200">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-zen-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
