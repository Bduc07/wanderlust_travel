import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Package, InsertBooking } from "@shared/schema";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Clock,
  Users,
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  ArrowRight,
  Calendar as CalendarIcon,
} from "lucide-react";

// Extend the booking schema with frontend validation
const bookingFormSchema = insertBookingSchema.extend({
  startDate: z.string().min(1, "Start date is required"),
  travelers: z.coerce
    .number()
    .min(1, "At least 1 traveler is required")
    .max(10, "Maximum 10 travelers allowed"),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(8, "Valid phone number is required"),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const PackageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [travelers, setTravelers] = useState(2);

  const { data: packageData, isLoading } = useQuery<Package>({
    queryKey: [`/api/packages/${id}`],
  });

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      packageId: parseInt(id),
      userId: user?.id,
      startDate: "",
      travelers: 2,
      totalPrice: 0,
      contactName: user?.name || "",
      contactEmail: user?.email || "",
      contactPhone: "",
      specialRequests: "",
    },
  });

  // Update total price when travelers change
  const watchTravelers = form.watch("travelers");
  
  // Update the total price when package data is loaded or travelers change
  useState(() => {
    if (packageData && watchTravelers) {
      form.setValue("totalPrice", packageData.price * watchTravelers);
    }
  });

  const createBooking = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      return await apiRequest("POST", "/api/bookings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Booking successful!",
        description: "Your travel package has been booked.",
        variant: "default",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to book this package.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    data.userId = user.id;
    data.totalPrice = packageData!.price * data.travelers;
    createBooking.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="space-y-8">
          <div>
            <Skeleton className="h-10 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          
          <Skeleton className="h-96 w-full rounded-xl" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-1/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-8" />
              
              <Skeleton className="h-8 w-1/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            <div>
              <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Package Not Found</h2>
          <p className="mb-8">The travel package you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/packages")}>
            Browse Available Packages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{packageData.name} | Wanderlust Travel & Tours</title>
        <meta name="description" content={packageData.shortDescription} />
        <meta property="og:title" content={`${packageData.name} | Wanderlust Travel & Tours`} />
        <meta property="og:description" content={packageData.shortDescription} />
        <meta property="og:image" content={packageData.image} />
      </Helmet>

      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{packageData.name}</h1>
            <div className="flex items-center gap-4 text-gray-700">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-secondary mr-1" />
                <span>{packageData.location}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-accent fill-accent mr-1" />
                <span>{packageData.rating.toFixed(1)} ({packageData.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="relative rounded-xl overflow-hidden">
            <Carousel>
              <CarouselContent>
                <CarouselItem>
                  <img 
                    src={packageData.image} 
                    alt={packageData.name} 
                    className="w-full h-96 object-cover rounded-xl"
                  />
                </CarouselItem>
                {packageData.gallery?.map((img, index) => (
                  <CarouselItem key={index}>
                    <img 
                      src={img} 
                      alt={`${packageData.name} - Image ${index + 2}`} 
                      className="w-full h-96 object-cover rounded-xl"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="includes">Inclusions & Exclusions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <div className="flex flex-wrap gap-4 mb-6">
                    {packageData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                      <Clock className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="font-medium">{packageData.duration} days</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                      <Users className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Group Size</div>
                        <div className="font-medium">Up to {packageData.groupSize} people</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                      <Globe className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Region</div>
                        <div className="font-medium">{packageData.region}</div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4">Description</h3>
                  <div className="prose max-w-none mb-8">
                    <p>{packageData.description}</p>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4">Highlights</h3>
                  <ul className="list-disc list-inside space-y-2 mb-8">
                    {packageData.highlights.map((highlight, index) => (
                      <li key={index} className="text-gray-700">{highlight}</li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="itinerary" className="mt-6">
                  <h3 className="text-xl font-bold mb-4">Full Itinerary</h3>
                  <div className="space-y-6">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="border-l-2 border-primary pl-6 pb-6 relative">
                        <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                        <h4 className="text-lg font-bold mb-2">Day {index + 1}: {day.title}</h4>
                        <p className="text-gray-700">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="includes" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {packageData.inclusions.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        What's Not Included
                      </h3>
                      <ul className="space-y-2">
                        {packageData.exclusions.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Book This Package</CardTitle>
                  <CardDescription>
                    Select your travel dates and number of travelers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departure Date</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                <Input 
                                  type="date" 
                                  className="pl-10" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="travelers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Travelers</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                max="10"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(parseInt(e.target.value));
                                  setTravelers(parseInt(e.target.value));
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {!user && (
                        <>
                          <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      
                      <FormField
                        control={form.control}
                        name="specialRequests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requests (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between mb-2">
                          <span>Package Price</span>
                          <span>${packageData.price.toLocaleString()} per person</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Travelers</span>
                          <span>x {travelers}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-4">
                          <span>Total Price</span>
                          <span>${(packageData.price * travelers).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={createBooking.isPending}
                      >
                        {createBooking.isPending ? "Processing..." : "Book Now"}
                      </Button>
                      
                      {!user && (
                        <div className="text-sm text-center text-gray-600 mt-4">
                          Already have an account? <a href="/login" className="text-primary hover:underline">Sign in</a> for faster booking
                        </div>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageDetails;
