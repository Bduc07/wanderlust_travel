import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Package } from '@shared/schema';
import PackageCard from '@/components/PackageCard';
import PackageFilters from '@/components/PackageFilters';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

const Packages = () => {
  const [location] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    region: 'all',
    priceRange: [0, 5000] as [number, number],
    duration: 'any',
    activities: [] as string[],
    sortBy: 'popularity',
  });

  // Parse query params on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const destination = queryParams.get('destination');
    const date = queryParams.get('date');
    const travelers = queryParams.get('travelers');

    if (destination) {
      setFilters((prev) => ({ ...prev, region: destination }));
    }
  }, [location]);

  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 pt-28">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
          
          <div className="lg:w-3/4">
            <div className="mb-8">
              <Skeleton className="h-10 w-1/3 mb-4" />
              <Skeleton className="h-5 w-2/3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-md">
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
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Skeleton className="h-10 w-80" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredPackages = packages
    ?.filter((pkg) => {
      // Filter by region
      if (filters.region !== 'all' && pkg.region.toLowerCase() !== filters.region.toLowerCase()) {
        return false;
      }

      // Filter by price range
      if (pkg.price < filters.priceRange[0] || pkg.price > filters.priceRange[1]) {
        return false;
      }

      // Filter by duration
      if (filters.duration !== 'any') {
        const [min, max] = filters.duration.split('-').map(Number);
        if (max) {
          if (pkg.duration < min || pkg.duration > max) return false;
        } else {
          // For 15+ case
          if (pkg.duration < min) return false;
        }
      }

      // Filter by activities
      if (filters.activities.length > 0) {
        const hasMatchingActivity = pkg.tags.some(tag => 
          filters.activities.includes(tag.toLowerCase())
        );
        if (!hasMatchingActivity) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'popularity':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'duration':
          return a.duration - b.duration;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil((filteredPackages?.length || 0) / itemsPerPage);
  const paginatedPackages = filteredPackages?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Helmet>
        <title>Travel Packages | Wanderlust Travel & Tours</title>
        <meta name="description" content="Browse our wide selection of travel packages to destinations worldwide. Find your perfect getaway with Wanderlust Travel & Tours." />
      </Helmet>

      <div className="container mx-auto px-4 py-12 pt-28">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <PackageFilters onFilterChange={setFilters} />
          </div>
          
          <div className="lg:w-3/4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Travel Packages</h1>
              <p className="text-gray-600">
                {filteredPackages?.length || 0} packages found. Explore our handpicked travel experiences.
              </p>
            </div>
            
            {paginatedPackages?.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">No Packages Found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters to find available packages.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedPackages?.map((pkg) => (
                    <PackageCard key={pkg.id} package={pkg} />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} href="#" />
                        </PaginationItem>
                      )}
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} href="#" />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Packages;
