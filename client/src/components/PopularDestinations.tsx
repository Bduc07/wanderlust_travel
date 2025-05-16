import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Destination } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const DestinationCard = ({ destination }: { destination: Destination }) => {
  return (
    <div className="relative rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
      <img
        src={destination.image}
        alt={`${destination.name}, ${destination.country}`}
        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-white text-xl font-bold mb-1">{destination.name}</h3>
          <div className="flex items-center">
            <span className="text-white text-sm">{destination.country}</span>
            <div className="ml-auto bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm">{destination.tourCount} Tours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopularDestinations = () => {
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  if (isLoading) {
    return (
      <section id="destinations" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {Array(2).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!destinations || destinations.length === 0) {
    return null;
  }

  // Split destinations into two groups
  const topDestinations = destinations.slice(0, 4);
  const largeDestinations = destinations.slice(4, 6);

  return (
    <section id="destinations" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Popular Destinations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our most sought-after destinations around the world and find your next adventure.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topDestinations.map(destination => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {largeDestinations.map(destination => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/destinations" className="inline-flex items-center text-primary hover:text-blue-700 font-medium">
            Explore All Destinations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
