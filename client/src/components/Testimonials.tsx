import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const startAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    
    if (autoplayEnabled && testimonials && testimonials.length > 0) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
  };

  useEffect(() => {
    startAutoplay();
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplayEnabled, testimonials]);

  const goPrev = () => {
    if (testimonials && testimonials.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setAutoplayEnabled(false);
    }
  };

  const goNext = () => {
    if (testimonials && testimonials.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      setAutoplayEnabled(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoplayEnabled(false);
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          
          <div className="relative">
            <div className="flex overflow-hidden">
              <div className="flex">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                    <div className="bg-white rounded-xl p-6 shadow-md h-full">
                      <div className="flex items-center mb-4">
                        <Skeleton className="w-14 h-14 rounded-full" />
                        <div className="ml-4 space-y-2">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Skeleton className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 rounded-full" />
            <Skeleton className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 rounded-full" />
            
            <div className="flex justify-center mt-8 space-x-2">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="w-3 h-3 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Calculate how many testimonials to show per slide based on screen size
  // This is a simplification, actual implementation would use a more responsive approach
  const itemsPerSlide = 3;
  const numSlides = Math.ceil(testimonials.length / itemsPerSlide);
  
  // Get current testimonials to display
  const startIdx = currentSlide * itemsPerSlide;
  const currentTestimonials = testimonials.slice(
    startIdx,
    Math.min(startIdx + itemsPerSlide, testimonials.length)
  );

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences from our satisfied customers who have explored the world with us.
          </p>
        </div>
        
        <div className="testimonial-slider relative">
          <div className="flex overflow-hidden">
            <div 
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * (100 / numSlides)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className="testimonial-card w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4"
                >
                  <div className="bg-white rounded-xl p-6 shadow-md h-full">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h4 className="font-bold text-dark">{testimonial.name}</h4>
                        <div className="flex text-accent">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < testimonial.rating ? "fill-accent" : ""}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{testimonial.comment}</p>
                    <div className="text-primary font-medium">{testimonial.packageName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            onClick={goPrev}
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white text-primary hover:bg-primary hover:text-white transition-colors w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={goNext}
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white text-primary hover:bg-primary hover:text-white transition-colors w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <div className="flex justify-center mt-8 space-x-2">
            {Array(numSlides).fill(0).map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === idx ? "bg-primary" : "bg-gray-300 hover:bg-primary transition-colors"
                }`}
                aria-current={currentSlide === idx}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => goToSlide(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
