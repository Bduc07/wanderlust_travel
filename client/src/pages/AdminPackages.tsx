import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Package, InsertPackage, insertPackageSchema } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Plus, PencilIcon, TrashIcon, Star } from "lucide-react";

// Extend the schema with client-side validation
const packageFormSchema = insertPackageSchema
  .omit({ id: true })
  .extend({
    tags: z.string().transform((val) => val.split(',').map(tag => tag.trim())),
    highlights: z.string().transform((val) => val.split('\n').filter(Boolean).map(h => h.trim())),
    inclusions: z.string().transform((val) => val.split('\n').filter(Boolean).map(i => i.trim())),
    exclusions: z.string().transform((val) => val.split('\n').filter(Boolean).map(e => e.trim())),
    itinerary: z.string().transform((val) => {
      const days = val.split('\n\n').filter(Boolean);
      return days.map(day => {
        const [title, ...description] = day.split('\n');
        return {
          title: title.trim(),
          description: description.join('\n').trim()
        };
      });
    }),
    gallery: z.string().optional().transform((val) => val ? val.split(',').map(url => url.trim()) : []),
  });

type PackageFormValues = z.input<typeof packageFormSchema>;

const AdminPackages = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const { toast } = useToast();

  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const addForm = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      price: 0,
      duration: 0,
      location: "",
      region: "",
      image: "",
      gallery: "",
      rating: 4.5,
      reviews: 0,
      groupSize: 10,
      tags: "",
      highlights: "",
      inclusions: "",
      exclusions: "",
      itinerary: "",
    },
  });

  const editForm = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      price: 0,
      duration: 0,
      location: "",
      region: "",
      image: "",
      gallery: "",
      rating: 4.5,
      reviews: 0,
      groupSize: 10,
      tags: "",
      highlights: "",
      inclusions: "",
      exclusions: "",
      itinerary: "",
    },
  });

  const createPackage = useMutation({
    mutationFn: async (data: z.output<typeof packageFormSchema>) => {
      await apiRequest("POST", "/api/packages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({
        title: "Package created",
        description: "The travel package has been successfully created.",
      });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to create package",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const updatePackage = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.output<typeof packageFormSchema> }) => {
      await apiRequest("PUT", `/api/packages/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({
        title: "Package updated",
        description: "The travel package has been successfully updated.",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update package",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const deletePackage = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/packages/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({
        title: "Package deleted",
        description: "The travel package has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
      setCurrentPackage(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete package",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onAddSubmit = (data: PackageFormValues) => {
    createPackage.mutate(data as z.output<typeof packageFormSchema>);
  };

  const onEditSubmit = (data: PackageFormValues) => {
    if (currentPackage) {
      updatePackage.mutate({
        id: currentPackage.id,
        data: data as z.output<typeof packageFormSchema>,
      });
    }
  };

  const handleEditClick = (pkg: Package) => {
    setCurrentPackage(pkg);
    
    // Transform arrays back to string format for the form
    editForm.reset({
      name: pkg.name,
      description: pkg.description,
      shortDescription: pkg.shortDescription,
      price: pkg.price,
      duration: pkg.duration,
      location: pkg.location,
      region: pkg.region,
      image: pkg.image,
      gallery: pkg.gallery?.join(', ') || '',
      rating: pkg.rating,
      reviews: pkg.reviews,
      groupSize: pkg.groupSize,
      tags: pkg.tags.join(', '),
      highlights: pkg.highlights.join('\n'),
      inclusions: pkg.inclusions.join('\n'),
      exclusions: pkg.exclusions.join('\n'),
      itinerary: pkg.itinerary.map(day => `${day.title}\n${day.description}`).join('\n\n'),
    });
    
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (pkg: Package) => {
    setCurrentPackage(pkg);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-10 w-1/3 mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <Skeleton className="h-10 w-36" />
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
        <title>Manage Packages | Wanderlust Admin</title>
        <meta name="description" content="Manage your travel packages in the Wanderlust admin panel." />
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
              <h1 className="text-3xl font-bold mb-2">Manage Packages</h1>
              <p className="text-gray-600">
                Create, edit, and delete travel packages for your customers.
              </p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add New Package
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Packages</CardTitle>
              <CardDescription>
                You have {packages?.length || 0} travel packages available.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!packages || packages.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No packages found</h3>
                  <p className="text-gray-500 mb-4">Create your first travel package to get started.</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add New Package
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <img 
                                src={pkg.image} 
                                alt={pkg.name} 
                                className="h-10 w-10 rounded-md object-cover" 
                              />
                              <span>{pkg.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{pkg.location}</TableCell>
                          <TableCell>{pkg.duration} days</TableCell>
                          <TableCell>${pkg.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-accent fill-accent mr-1" />
                              <span>{pkg.rating.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(pkg)}
                              >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteClick(pkg)}
                              >
                                <TrashIcon className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
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

      {/* Add Package Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Package</DialogTitle>
            <DialogDescription>
              Create a new travel package to offer to your customers.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Santorini Island Escape" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Santorini, Greece" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="asia">Asia</SelectItem>
                          <SelectItem value="africa">Africa</SelectItem>
                          <SelectItem value="america">America</SelectItem>
                          <SelectItem value="oceania">Oceania</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (per person)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1299" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (days)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="7" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="groupSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Size</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="10" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="gallery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gallery Image URLs</FormLabel>
                      <FormControl>
                        <Input placeholder="URL1, URL2, URL3" {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate multiple URLs with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="Beach, Island, Culture" {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate tags with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addForm.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A brief description of the package for listings..."
                        className="h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the package..."
                        className="h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="highlights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highlights</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Visit the blue-domed churches&#10;Enjoy sunset in Oia&#10;Swim in crystal-clear waters"
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each highlight on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="itinerary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Itinerary</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Arrival in Santorini&#10;Transfer to your hotel and welcome dinner&#10;&#10;Exploring Oia&#10;Visit the famous village and enjoy the sunset"
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Format: Day Title, then description. Separate days with blank lines.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="inclusions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inclusions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Accommodation&#10;Daily breakfast&#10;Airport transfers"
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each inclusion on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="exclusions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exclusions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="International flights&#10;Travel insurance&#10;Personal expenses"
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each exclusion on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createPackage.isPending}
                >
                  {createPackage.isPending ? "Creating..." : "Create Package"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Package Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>
              Update the details of {currentPackage?.name}.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="asia">Asia</SelectItem>
                          <SelectItem value="africa">Africa</SelectItem>
                          <SelectItem value="america">America</SelectItem>
                          <SelectItem value="oceania">Oceania</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (per person)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (days)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="groupSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Size</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="gallery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gallery Image URLs</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate multiple URLs with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate tags with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="highlights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highlights</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each highlight on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="itinerary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Itinerary</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Format: Day Title, then description. Separate days with blank lines.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="inclusions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inclusions</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each inclusion on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="exclusions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exclusions</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each exclusion on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updatePackage.isPending}
                >
                  {updatePackage.isPending ? "Updating..." : "Update Package"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{currentPackage?.name}" package and cannot be undone.
              This may affect existing bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentPackage && deletePackage.mutate(currentPackage.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePackage.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminPackages;
