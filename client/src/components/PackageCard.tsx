import { Link } from "wouter";
import { Package } from "@shared/schema";
import { MapPin, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PackageCardProps {
  package: Package;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg }) => {
  return (
    <div className="package-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl">
      <img
        src={pkg.image}
        alt={pkg.name}
        className="w-full h-52 object-cover"
      />

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold font-poppins text-dark">{pkg.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-accent fill-accent" />
            <span className="ml-1 font-medium">{pkg.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="text-secondary mr-2 h-4 w-4" />
          <span>{pkg.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {pkg.tags.map((tag, idx) => (
            <Badge 
              key={idx} 
              variant="outline"
              className="bg-blue-50 text-primary text-xs font-medium px-3 py-1 rounded-full"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <Clock className="mr-2 h-4 w-4" />
          <span>{pkg.duration} Days, {pkg.duration - 1} Nights</span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-dark">
              ${pkg.price.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm">/person</span>
          </div>
          <Link href={`/packages/${pkg.id}`}>
            <Button className="bg-primary hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
