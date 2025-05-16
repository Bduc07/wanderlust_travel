import { Globe, DollarSign, Headphones, Shield } from "lucide-react";

const features = [
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Handpicked Destinations",
    description: "We carefully select each destination to ensure exceptional experiences for our travelers."
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Best Price Guarantee",
    description: "We promise the best rates with no hidden fees. If you find a better price, we'll match it."
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "24/7 Customer Support",
    description: "Our dedicated team is available around the clock to assist with any questions or concerns."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Trusted & Safe",
    description: "With over 10 years of experience and thousands of satisfied customers, you're in good hands."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Wanderlust</h2>
          <p className="max-w-2xl mx-auto opacity-90">
            We're dedicated to providing unforgettable travel experiences with exceptional service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="opacity-90">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
