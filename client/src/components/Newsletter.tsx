import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeNewsletter = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest("POST", "/api/newsletter/subscribe", { email });
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      });
      setEmail("");
    },
    onError: (error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email is required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    subscribeNewsletter.mutate(email);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-blue-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Inspired For Your Next Trip
          </h2>
          <p className="opacity-90 mb-8">
            Subscribe to our newsletter and receive exclusive offers, travel tips, and destination guides.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 h-auto rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              type="submit" 
              className="bg-accent hover:bg-yellow-500 text-dark font-medium px-6 py-3 h-auto rounded-lg transition-colors"
              disabled={subscribeNewsletter.isPending}
            >
              {subscribeNewsletter.isPending ? "Subscribing..." : "Subscribe Now"}
            </Button>
          </form>
          
          <p className="text-sm opacity-80 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from us.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
