import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Globe, Heart, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = isScrolled ? "text-dark" : "text-white";
  const isHomePage = location === "/";

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomePage ? "nav-scrolled" : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Globe className={`${isScrolled || !isHomePage ? "text-accent" : "text-accent"} mr-2`} />
              <span
                className={`${
                  isScrolled || !isHomePage ? "text-dark" : textColor
                } font-bold text-xl font-poppins`}
              >
                Wanderlust
              </span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 font-medium">
            <Link
              href="/"
              className={`${
                isScrolled || !isHomePage ? "text-dark" : textColor
              } hover:text-accent transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/packages"
              className={`${
                isScrolled || !isHomePage ? "text-dark" : textColor
              } hover:text-accent transition-colors`}
            >
              Packages
            </Link>
            <Link
              href="/#destinations"
              className={`${
                isScrolled || !isHomePage ? "text-dark" : textColor
              } hover:text-accent transition-colors`}
            >
              Destinations
            </Link>
            <Link
              href="/#testimonials"
              className={`${
                isScrolled || !isHomePage ? "text-dark" : textColor
              } hover:text-accent transition-colors`}
            >
              Testimonials
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/favorites"
              className={`${
                isScrolled || !isHomePage ? "text-dark" : textColor
              } hover:text-accent transition-colors`}
            >
              <Heart className="h-5 w-5" />
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  className={`${
                    isScrolled || !isHomePage
                      ? "bg-primary text-white"
                      : "bg-white text-primary"
                  } hover:bg-gray-100 transition-colors`}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className={textColor}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center py-4 border-b">
                  <div className="flex items-center">
                    <Globe className="text-accent mr-2" />
                    <span className="font-bold text-xl font-poppins">Wanderlust</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex flex-col space-y-4 mt-6">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <div className="py-2 hover:text-primary transition-colors">Home</div>
                  </Link>
                  <Link href="/packages" onClick={() => setIsOpen(false)}>
                    <div className="py-2 hover:text-primary transition-colors">Packages</div>
                  </Link>
                  <Link href="/#destinations" onClick={() => setIsOpen(false)}>
                    <div className="py-2 hover:text-primary transition-colors">Destinations</div>
                  </Link>
                  <Link href="/#testimonials" onClick={() => setIsOpen(false)}>
                    <div className="py-2 hover:text-primary transition-colors">Testimonials</div>
                  </Link>
                  <div className="border-t pt-4 mt-2">
                    {user ? (
                      <>
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                          <div className="py-2 hover:text-primary transition-colors">Dashboard</div>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-0 hover:text-primary"
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <div className="py-2 hover:text-primary transition-colors">Sign In</div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
