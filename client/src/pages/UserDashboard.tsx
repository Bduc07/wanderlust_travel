import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Booking } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  CreditCard,
  MapPin,
  User,
  Users,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: [`/api/bookings/user/${user?.id}`],
  });

  const cancelBooking = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/bookings/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bookings/user/${user?.id}`] });
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled.",
      });
      setBookingToCancel(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get upcoming and past bookings
  const currentDate = new Date();
  const upcomingBookings = bookings?.filter(booking => 
    new Date(booking.startDate) >= currentDate
  ) || [];
  
  const pastBookings = bookings?.filter(booking => 
    new Date(booking.startDate) < currentDate
  ) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="space-y-8">
          <div>
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-5 w-1/2 mb-8" />
          </div>

          <Skeleton className="h-12 w-80 rounded-lg mb-6" />
          
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Dashboard | Wanderlust Travel & Tours</title>
        <meta name="description" content="Manage your bookings and account details on your Wanderlust dashboard." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}! Manage your travel bookings and account details.
            </p>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">
                Upcoming Trips ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Trips ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {upcomingBookings.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-10">
                    <div className="flex flex-col items-center space-y-3">
                      <Calendar className="h-10 w-10 text-gray-400" />
                      <h3 className="font-semibold text-xl">No upcoming trips</h3>
                      <p className="text-gray-500 max-w-md">
                        You don't have any upcoming trips booked. Explore our packages and plan your next adventure!
                      </p>
                      <Button 
                        className="mt-4 bg-primary hover:bg-primary/90"
                        onClick={() => window.location.href = "/packages"}
                      >
                        Explore Packages
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {upcomingBookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      onCancelClick={() => setBookingToCancel(booking.id)}
                      showCancelButton
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {pastBookings.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-10">
                    <div className="flex flex-col items-center space-y-3">
                      <Calendar className="h-10 w-10 text-gray-400" />
                      <h3 className="font-semibold text-xl">No past trips</h3>
                      <p className="text-gray-500 max-w-md">
                        You haven't completed any trips yet. Book a package and start your journey!
                      </p>
                      <Button 
                        className="mt-4 bg-primary hover:bg-primary/90"
                        onClick={() => window.location.href = "/packages"}
                      >
                        Explore Packages
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {pastBookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking}
                      onCancelClick={() => {}} 
                      showCancelButton={false}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <AlertDialog open={bookingToCancel !== null} onOpenChange={(open) => !open && setBookingToCancel(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => bookingToCancel && cancelBooking.mutate(bookingToCancel)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {cancelBooking.isPending ? "Cancelling..." : "Cancel Booking"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

interface BookingCardProps {
  booking: Booking;
  onCancelClick: () => void;
  showCancelButton: boolean;
}

const BookingCard = ({ booking, onCancelClick, showCancelButton }: BookingCardProps) => {
  const isPast = new Date(booking.startDate) < new Date();
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 bg-gray-100 p-6">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <div>
                  <div className="font-medium">Start Date</div>
                  <div>{formatDate(booking.startDate)}</div>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <div>
                  <div className="font-medium">Travelers</div>
                  <div>{booking.travelers} {booking.travelers === 1 ? "person" : "people"}</div>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                <div>
                  <div className="font-medium">Total Cost</div>
                  <div>{formatCurrency(booking.totalPrice)}</div>
                </div>
              </div>
              
              <div className="pt-2">
                <Badge variant={isPast ? "secondary" : "primary"}>
                  {isPast ? "Completed" : "Upcoming"}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{booking.packageName}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{booking.packageLocation}</span>
                </div>
              </div>
              
              {showCancelButton && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={onCancelClick}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              )}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2">Booking Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Booked by: {booking.contactName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Booking Date: {formatDate(booking.bookingDate)}</span>
                </div>
              </div>
              
              {booking.specialRequests && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Special Requests</h4>
                  <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDashboard;
