import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PackageFiltersProps {
  onFilterChange: (filters: {
    region: string;
    priceRange: [number, number];
    duration: string;
    activities: string[];
    sortBy: string;
  }) => void;
}

const regions = [
  { value: "all", label: "All Regions" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "africa", label: "Africa" },
  { value: "america", label: "America" },
  { value: "oceania", label: "Oceania" },
];

const durations = [
  { value: "any", label: "Any Duration" },
  { value: "1-3", label: "1-3 Days" },
  { value: "4-7", label: "4-7 Days" },
  { value: "8-14", label: "8-14 Days" },
  { value: "15+", label: "15+ Days" },
];

const activities = [
  { value: "beach", label: "Beach & Relaxation" },
  { value: "adventure", label: "Adventure" },
  { value: "culture", label: "Cultural Experience" },
  { value: "hiking", label: "Hiking & Trekking" },
  { value: "food", label: "Food & Culinary" },
  { value: "wildlife", label: "Wildlife & Safari" },
  { value: "city", label: "City Exploration" },
  { value: "luxury", label: "Luxury" },
];

const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "duration", label: "Duration" },
  { value: "rating", label: "Customer Rating" },
];

const PackageFilters: React.FC<PackageFiltersProps> = ({ onFilterChange }) => {
  const [region, setRegion] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [duration, setDuration] = useState("any");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popularity");

  const handleActivityChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedActivities([...selectedActivities, value]);
    } else {
      setSelectedActivities(selectedActivities.filter((item) => item !== value));
    }
  };

  const handleApplyFilter = () => {
    onFilterChange({
      region,
      priceRange,
      duration,
      activities: selectedActivities,
      sortBy,
    });
  };

  const handleResetFilter = () => {
    setRegion("all");
    setPriceRange([0, 5000]);
    setDuration("any");
    setSelectedActivities([]);
    setSortBy("popularity");
    
    onFilterChange({
      region: "all",
      priceRange: [0, 5000],
      duration: "any",
      activities: [],
      sortBy: "popularity",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleResetFilter}
          className="text-primary hover:text-primary/90"
        >
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((regionOption) => (
                <SelectItem key={regionOption.value} value={regionOption.value}>
                  {regionOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (${priceRange[0]} - ${priceRange[1]})
          </label>
          <Slider
            defaultValue={[0, 5000]}
            min={0}
            max={10000}
            step={100}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="my-6"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>$0</span>
            <span>$10,000</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((durationOption) => (
                <SelectItem key={durationOption.value} value={durationOption.value}>
                  {durationOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="activities">
            <AccordionTrigger className="text-sm font-medium text-gray-700">
              Activities & Experiences
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {activities.map((activity) => (
                  <div key={activity.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`activity-${activity.value}`} 
                      checked={selectedActivities.includes(activity.value)}
                      onCheckedChange={(checked) => 
                        handleActivityChange(activity.value, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`activity-${activity.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {activity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleApplyFilter}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default PackageFilters;
