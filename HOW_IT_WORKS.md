# Wanderlust Travel Website - How It Works

## Overview
Wanderlust is a full-featured travel booking platform that allows users to browse and book travel packages to destinations around the world. The system includes both user-facing features and an administrative backend for managing packages, bookings, and user accounts.

## User Features

### Homepage
The homepage provides an overview of what Wanderlust offers:
- Hero section with search functionality
- Featured travel packages
- Popular destinations
- Special offers with discounted prices
- Testimonials from previous travelers
- Newsletter subscription

### Package Browsing
Users can browse all available travel packages with powerful filtering options:
- Filter by region (Asia, Europe, Africa, North America, etc.)
- Filter by price range
- Filter by trip duration
- Filter by activities and interests
- Sort by popularity, price, or rating

### Package Details
Each package has a detailed page showing:
- Comprehensive package description
- Detailed day-by-day itinerary
- Pricing information
- What's included/excluded
- Package highlights
- Image gallery
- Reviews and ratings
- Booking form

### User Registration & Login
- New users can create accounts with email and password
- Existing users can log in securely
- Password reset functionality available

### Booking Process
1. Select a travel package
2. Choose travel dates and number of travelers
3. Fill in contact and traveler information
4. Add any special requests
5. Review booking summary with total price
6. Complete booking

### User Dashboard
Once logged in, users can access their dashboard to:
- View all their bookings (past and upcoming)
- See booking details and trip information
- Cancel bookings if needed
- Update their profile information

### Newsletter Subscription
Users can subscribe to receive updates about:
- New travel packages
- Special promotions and discounts
- Travel tips and destination guides

## Admin Features

### Admin Dashboard
Administrators have access to a comprehensive dashboard showing:
- Overview of total bookings
- Revenue statistics
- Recent user registrations
- Recent bookings
- Quick access to main admin functions

### Package Management
Admins can manage the travel package catalog:
- View all packages with sorting and filtering
- Add new travel packages with full details
- Edit existing package information
- Upload package images
- Set pricing and availability
- Remove packages from the catalog

### Booking Management
The booking management system allows admins to:
- View all bookings with filtering options
- See detailed booking information
- Process booking requests
- Cancel bookings if necessary
- Contact customers regarding their bookings

### User Management
Administrators can manage user accounts:
- View all registered users
- See user details and booking history
- Change user roles (regular user or admin)
- Disable or enable user accounts

## Technical Implementation

### Frontend
- Built with React.js for a responsive and interactive user interface
- Uses Tailwind CSS for modern, mobile-friendly styling
- Implements client-side form validation for better user experience
- Optimized image loading for faster page rendering

### Backend
- Express.js server handles API requests
- RESTful API architecture for communication between frontend and backend
- JWT (JSON Web Token) authentication for secure access
- Role-based access control for protecting admin features

### Database
- MySQL database stores all application data
- Tables for users, packages, bookings, destinations, etc.
- Relationships between tables maintain data integrity
- Optimized queries for faster data retrieval

### Security Features
- Password hashing for secure user authentication
- Protected API endpoints requiring authentication
- Input validation to prevent malicious data
- Role-based permissions for administrative actions

## Getting Started

### For Regular Users
1. Visit the homepage
2. Browse available travel packages or use search/filters
3. Create an account or log in
4. Select a package and complete the booking process
5. Access your user dashboard to view your bookings

### For Administrators
1. Log in with admin credentials
2. Access the admin dashboard
3. Manage packages, bookings, and users
4. View statistics and reports

## Default Credentials

### Admin Access
- Email: admin@wanderlust.com
- Password: admin123

### Sample User
- Email: john@example.com
- Password: admin123