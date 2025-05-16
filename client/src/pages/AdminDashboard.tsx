import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { formatCurrency } from "@/lib/utils";
import { Package, User, Booking } from "@shared/schema";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package as PackageIcon,
  Users,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Map,
  CreditCard,
} from "lucide-react";

const AdminDashboard = () => {
  const { data: packages, isLoading: isLoadingPackages } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: bookings, isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Determine loading state
  const isLoading = isLoadingPackages || isLoadingUsers || isLoadingBookings;

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const totalPackages = packages?.length || 0;
  const totalBookings = bookings?.length || 0;
  const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.totalPrice, 0) || 0;

  // Get recent bookings
  const recentBookings = bookings
    ? [...bookings].sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()).slice(0, 5)
    : [];

  // Get popular packages based on bookings count
  const packageBookingCounts = new Map<number, number>();
  bookings?.forEach((booking) => {
    const currentCount = packageBookingCounts.get(booking.packageId) || 0;
    packageBookingCounts.set(booking.packageId, currentCount + 1);
  });

  const popularPackages = packages
    ? [...packages]
        .map((pkg) => ({
          ...pkg,
          bookingCount: packageBookingCounts.get(pkg.id) || 0,
        }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 5)
    : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="space-y-8">
          <div>
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-5 w-1/2 mb-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>

          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Wanderlust Travel & Tours</title>
        <meta name="description" content="Manage your travel agency with the Wanderlust admin dashboard." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">
                Welcome to your Wanderlust admin dashboard. Manage packages, bookings, and users.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/admin/packages">Manage Packages</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/bookings">Manage Bookings</Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Bookings</p>
                    <h3 className="text-3xl font-bold mt-2">{totalBookings}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 text-sm flex items-center text-blue-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <Link href="/admin/bookings">View all bookings</Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Revenue</p>
                    <h3 className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue)}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 text-sm flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Revenue statistics</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Packages</p>
                    <h3 className="text-3xl font-bold mt-2">{totalPackages}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <PackageIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 text-sm flex items-center text-purple-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <Link href="/admin/packages">Manage packages</Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Users</p>
                    <h3 className="text-3xl font-bold mt-2">{totalUsers}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4 text-sm flex items-center text-amber-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>User statistics</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings & Popular Packages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  The latest customer bookings across all packages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentBookings.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No bookings to display
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.packageName}</TableCell>
                          <TableCell>{booking.contactName}</TableCell>
                          <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">{formatCurrency(booking.totalPrice)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                <div className="mt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/admin/bookings">View All Bookings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Packages</CardTitle>
                <CardDescription>
                  Your best performing travel packages based on bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {popularPackages.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No packages to display
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Bookings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {popularPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">{pkg.name}</TableCell>
                          <TableCell>{pkg.location}</TableCell>
                          <TableCell>{formatCurrency(pkg.price)}</TableCell>
                          <TableCell className="text-right">{pkg.bookingCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                <div className="mt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/admin/packages">Manage Packages</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
