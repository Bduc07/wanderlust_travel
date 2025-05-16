import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PackageCard from "./PackageCard";
import { Package } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedPackages = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity");

  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const filteredPackages = packages?.filter((pkg) => {
    if (activeFilter === "all") return true;
    return pkg.region.toLowerCase() === activeFilter.toLowerCase();
  });

  const sortedPackages = [...(filteredPackages || [])].sort((a, b) => {
    if (sortBy === "popularity") {
      return b.rating - a.rating;
    } else if (sortBy === "price-low") {
      return a.price - b.price;
    } else if (sortBy === "price-high") {
      return b.price - a.price;
    } else if (sortBy === "duration") {
      return a.duration - b.duration;
    }
    return 0;
  });

  const displayedPackages = sortedPackages.slice(0, 6);

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Featured Travel Packages
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Handpicked packages for your next adventure. From serene beaches to
            mountain treks, we've got you covered.
          </p>
        </div>

        <div className="flex justify-between items-center mb-8 overflow-x-auto py-2 md:py-0 hide-scrollbar">
          <div className="flex space-x-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              className={
                activeFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "europe" ? "default" : "outline"}
              className={
                activeFilter === "europe"
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }
              size="sm"
              onClick={() => setActiveFilter("europe")}
            >
              Europe
            </Button>
            <Button
              variant={activeFilter === "asia" ? "default" : "outline"}
              className={
                activeFilter === "asia"
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }
              size="sm"
              onClick={() => setActiveFilter("asia")}
            >
              Asia
            </Button>
            <Button
              variant={activeFilter === "africa" ? "default" : "outline"}
              className={
                activeFilter === "africa"
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }
              size="sm"
              onClick={() => setActiveFilter("africa")}
            >
              Africa
            </Button>
            <Button
              variant={activeFilter === "america" ? "default" : "outline"}
              className={
                activeFilter === "america"
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }
              size="sm"
              onClick={() => setActiveFilter("america")}
            >
              America
            </Button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] p-2 h-auto border border-gray-300 rounded-md text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden shadow-md">
                    <Skeleton className="w-full h-52" />
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-10" />
                      </div>
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-1/3" />
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-10 w-1/3 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))
            : displayedPackages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/packages" className="inline-flex items-center text-primary hover:text-blue-700 font-medium">
            View All Packages
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
