import { Link } from "wouter";
import { Globe, MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="flex items-center mb-6">
              <Globe className="text-accent text-2xl mr-2" />
              <span className="text-white font-bold text-xl font-poppins">Wanderlust</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Discover the world with our expertly crafted travel packages and personalized experiences.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterestP />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-accent transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-gray-400 hover:text-accent transition-colors">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-accent transition-colors">
                  Travel Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Popular Destinations</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/destinations/bali" className="text-gray-400 hover:text-accent transition-colors">
                  Bali, Indonesia
                </Link>
              </li>
              <li>
                <Link href="/destinations/paris" className="text-gray-400 hover:text-accent transition-colors">
                  Paris, France
                </Link>
              </li>
              <li>
                <Link href="/destinations/santorini" className="text-gray-400 hover:text-accent transition-colors">
                  Santorini, Greece
                </Link>
              </li>
              <li>
                <Link href="/destinations/tokyo" className="text-gray-400 hover:text-accent transition-colors">
                  Tokyo, Japan
                </Link>
              </li>
              <li>
                <Link href="/destinations/new-york" className="text-gray-400 hover:text-accent transition-colors">
                  New York, USA
                </Link>
              </li>
              <li>
                <Link href="/destinations/maldives" className="text-gray-400 hover:text-accent transition-colors">
                  Maldives
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-accent mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">123 Travel Street, Cityscape, Country 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-accent mr-3 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-accent mr-3 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">info@wanderlust.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="text-accent mr-3 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">Mon-Fri: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} Wanderlust Travel. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-500 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-accent transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
