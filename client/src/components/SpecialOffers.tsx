import { useQuery } from "@tanstack/react-query";
import { SpecialOffer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const SpecialOffers = () => {
  const { data: offers, isLoading } = useQuery<SpecialOffer[]>({
    queryKey: ["/api/offers"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row rounded-xl overflow-hidden shadow-md">
                <Skeleton className="w-full md:w-2/5 h-48 md:h-auto" />
                <div className="p-6 flex-1 space-y-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-10 w-24 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!offers || offers.length === 0) {
    return null;
  }

  // Take first two offers
  const displayedOffers = offers.slice(0, 2);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Special Offers & Deals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Limited-time discounts and exclusive packages for our customers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedOffers.map((offer) => (
            <div key={offer.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row">
              <img 
                src={offer.image} 
                alt={offer.title} 
                className="w-full md:w-2/5 h-48 md:h-auto object-cover"
              />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 bg-secondary text-white text-xs font-semibold rounded-full mb-4">
                    {offer.discountPercent}% OFF
                  </div>
                  <h3 className="text-xl font-bold font-poppins text-dark mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 line-through">${offer.originalPrice.toLocaleString()}</span>
                    <span className="text-xl font-bold text-secondary ml-2">
                      ${offer.discountedPrice.toLocaleString()}
                    </span>
                  </div>
                  <Button className="bg-primary hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
