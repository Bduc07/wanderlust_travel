import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";

const Hero = () => {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState("2");

  return (
    <header className="hero-section flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Discover Your Dream Destination
        </h1>
        <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto">
          Explore our handpicked travel packages and embark on unforgettable adventures around the world.
        </p>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Destination</label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="w-full p-3 h-auto border border-gray-300 rounded-md">
                  <SelectValue placeholder="Where to go?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="africa">Africa</SelectItem>
                  <SelectItem value="america">America</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">When</label>
              <Input 
                type="date" 
                className="w-full p-3 h-auto border border-gray-300 rounded-md" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Travelers</label>
              <Select value={travelers} onValueChange={setTravelers}>
                <SelectTrigger className="w-full p-3 h-auto border border-gray-300 rounded-md">
                  <SelectValue placeholder="Select travelers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Person</SelectItem>
                  <SelectItem value="2">2 People</SelectItem>
                  <SelectItem value="3">3 People</SelectItem>
                  <SelectItem value="4+">4+ People</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Link href={`/packages?destination=${destination}&date=${date}&travelers=${travelers}`}>
                <Button className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors h-auto">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
