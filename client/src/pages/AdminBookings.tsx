import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Booking } from "@shared/schema";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, MoreVertical, Eye, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const deleteBooking = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/bookings/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Booking cancelled",
        description: "The booking has been successfully cancelled.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedBooking(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to cancel booking",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleDeleteBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  // Get upcoming and past bookings
  const upcomingBookings = bookings?.filter(booking => 
    new Date(booking.startDate) >= new Date()
  ) || [];
  
  const pastBookings = bookings?.filter(booking => 
    new Date(booking.startDate) < new Date()
  ) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-10 w-1/3 mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-1/4 mb-2" />
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Bookings | Wanderlust Admin</title>
        <meta name="description" content="Manage customer bookings in the Wanderlust admin panel." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ChevronLeft className="h-4 w-4" /> Back to Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold mb-2">Manage Bookings</h1>
              <p className="text-gray-600">
                View and manage customer bookings for your travel packages.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>
                {upcomingBookings.length} upcoming bookings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                  <p className="text-gray-500">
                    There are no upcoming bookings at the moment.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Travelers</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.contactName}
                            <div className="text-xs text-gray-500">
                              {booking.contactEmail}
                            </div>
                          </TableCell>
                          <TableCell>{booking.packageName}</TableCell>
                          <TableCell>{formatDate(booking.startDate)}</TableCell>
                          <TableCell>{booking.travelers}</TableCell>
                          <TableCell>{formatCurrency(booking.totalPrice)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                              Upcoming
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewBooking(booking)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive" 
                                  onClick={() => handleDeleteBooking(booking)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Bookings</CardTitle>
              <CardDescription>
                {pastBookings.length} completed bookings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pastBookings.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No past bookings</h3>
                  <p className="text-gray-500">
                    There are no past bookings to display.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Travelers</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.contactName}
                            <div className="text-xs text-gray-500">
                              {booking.contactEmail}
                            </div>
                          </TableCell>
                          <TableCell>{booking.packageName}</TableCell>
                          <TableCell>{formatDate(booking.startDate)}</TableCell>
                          <TableCell>{booking.travelers}</TableCell>
                          <TableCell>{formatCurrency(booking.totalPrice)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-gray-100 text-gray-600">
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewBooking(booking)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Booking ID: #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Package Information</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-lg font-semibold">{selectedBooking.packageName}</p>
                    <p className="text-gray-600">{selectedBooking.packageLocation}</p>
                    <div className="flex items-center">
                      <Badge variant={new Date(selectedBooking.startDate) < new Date() ? "secondary" : "primary"}>
                        {new Date(selectedBooking.startDate) < new Date() ? "Completed" : "Upcoming"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Booking Information</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Date:</span>
                      <span>{formatDate(selectedBooking.bookingDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span>{formatDate(selectedBooking.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Travelers:</span>
                      <span>{selectedBooking.travelers}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total Price:</span>
                      <span>{formatCurrency(selectedBooking.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span>{selectedBooking.contactName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{selectedBooking.contactEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedBooking.contactPhone}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Special Requests</h3>
                  <p className="text-gray-600">{selectedBooking.specialRequests}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                {new Date(selectedBooking.startDate) >= new Date() && (
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleDeleteBooking(selectedBooking);
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
              onClick={() => selectedBooking && deleteBooking.mutate(selectedBooking.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteBooking.isPending ? "Cancelling..." : "Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminBookings;
