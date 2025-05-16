-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS newsletter_subscriptions;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS special_offers;
DROP TABLE IF EXISTS destinations;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user'
);

-- Create packages table
CREATE TABLE packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  shortDescription TEXT NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  duration INT NOT NULL,
  location VARCHAR(255) NOT NULL,
  region VARCHAR(100) NOT NULL,
  image VARCHAR(255) NOT NULL,
  rating DECIMAL(3,1) NOT NULL DEFAULT 4.5,
  reviews INT NOT NULL DEFAULT 0,
  groupSize INT NOT NULL DEFAULT 10,
  tags JSON NOT NULL,
  highlights JSON NOT NULL,
  inclusions JSON NOT NULL,
  exclusions JSON NOT NULL,
  itinerary JSON NOT NULL,
  gallery JSON
);

-- Create bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  packageId INT NOT NULL,
  packageName VARCHAR(255) NOT NULL,
  packageLocation VARCHAR(255) NOT NULL,
  bookingDate VARCHAR(50) NOT NULL,
  startDate VARCHAR(50) NOT NULL,
  travelers INT NOT NULL,
  totalPrice INT NOT NULL,
  contactName VARCHAR(255) NOT NULL,
  contactEmail VARCHAR(255) NOT NULL,
  contactPhone VARCHAR(100) NOT NULL,
  specialRequests TEXT,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (packageId) REFERENCES packages(id)
);

-- Create destinations table
CREATE TABLE destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  tourCount INT NOT NULL,
  featured BOOLEAN DEFAULT FALSE
);

-- Create special offers table
CREATE TABLE specialOffers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  originalPrice INT NOT NULL,
  discountedPrice INT NOT NULL,
  discountPercent INT NOT NULL,
  expiryDate VARCHAR(50)
);

-- Create testimonials table
CREATE TABLE testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  rating INT NOT NULL,
  packageName VARCHAR(255) NOT NULL
);

-- Create newsletter subscriptions table
CREATE TABLE newsletterSubscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscriptionDate VARCHAR(50) NOT NULL
);

-- Insert sample data for initial setup

-- Insert sample users
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@wanderlust.com', '$2b$10$CwTycUXWue0Thq9StjUM0uQxTmPDkWM3AF/F6jLmU9SH6wPtHFM8K', 'admin'),
('John Doe', 'john@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uQxTmPDkWM3AF/F6jLmU9SH6wPtHFM8K', 'user');

-- Insert sample packages
INSERT INTO packages (
  name, 
  shortDescription, 
  description, 
  price, 
  duration, 
  location, 
  region, 
  image,
  rating,
  reviews,
  groupSize,
  tags,
  highlights,
  inclusions,
  exclusions,
  itinerary,
  gallery
) VALUES
(
  'Santorini Island Escape',
  'Experience the magic of Santorini with its stunning sunsets, blue-domed churches, and crystal-clear waters.',
  'Escape to the idyllic island of Santorini, where whitewashed buildings cascade down volcanic cliffs, offering breathtaking views of the Aegean Sea. This carefully crafted package lets you experience the island''s unique charm, from its iconic blue-domed churches to its world-famous sunsets. Explore ancient ruins, relax on distinctive beaches with red, black, or white sand, and indulge in authentic Greek cuisine paired with local wines. With comfortable accommodations and expert guides, this Santorini escape promises memories that will last a lifetime.',
  1299,
  7,
  'Santorini, Greece',
  'europe',
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500',
  4.9,
  128,
  12,
  JSON_ARRAY('Island', 'Culture', 'Relaxation'),
  JSON_ARRAY('Watch the famous sunset from Oia', 'Visit the ancient ruins of Akrotiri', 'Cruise around the caldera', 'Wine tasting at local vineyards', 'Explore the unique black sand beaches'),
  JSON_ARRAY('6 nights accommodation in boutique hotels', 'Daily breakfast', 'Welcome dinner with Greek specialties', 'Guided tour of Akrotiri archaeological site', 'Sunset catamaran cruise with dinner', 'Wine tasting experience', 'Airport transfers'),
  JSON_ARRAY('International flights', 'Travel insurance', 'Personal expenses', 'Optional activities not mentioned in inclusions', 'Lunches and some dinners'),
  JSON_ARRAY(
    JSON_OBJECT('title', 'Arrival in Santorini', 'description', 'Arrival at Santorini Airport and transfer to your hotel in Fira. Evening welcome dinner with local specialties and orientation briefing.'),
    JSON_OBJECT('title', 'Fira & Firostefani Exploration', 'description', 'Morning walking tour of Fira, the island''s capital. Continue to neighboring Firostefani for stunning caldera views. Afternoon at leisure to explore the winding streets and boutique shops.'),
    JSON_OBJECT('title', 'Ancient Akrotiri & Beach Time', 'description', 'Morning visit to the archaeological site of Akrotiri, a Minoan Bronze Age settlement. Afternoon relaxation at Kamari black sand beach with optional water activities.'),
    JSON_OBJECT('title', 'Wine & Culture Experience', 'description', 'Visit traditional wineries and taste the unique volcanic wines of Santorini. Afternoon visit to a local art gallery and traditional crafts workshop.'),
    JSON_OBJECT('title', 'Caldera Cruise', 'description', 'Full-day catamaran cruise around the caldera, visiting hot springs, red beach, and white beach with opportunities for swimming and snorkeling. BBQ lunch onboard.'),
    JSON_OBJECT('title', 'Oia & Sunset Experience', 'description', 'Morning at leisure. Afternoon transfer to the picturesque village of Oia with its blue-domed churches and winding alleys. Farewell dinner at a cliff-side restaurant while watching the world-famous Santorini sunset.'),
    JSON_OBJECT('title', 'Departure Day', 'description', 'After breakfast, transfer to Santorini Airport for your departure flight.')
  ),
  JSON_ARRAY('https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500', 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500')
),
(
  'Bali Tropical Paradise',
  'Discover the enchanting island of Bali with its lush landscapes, ancient temples, and vibrant culture.',
  'Immerse yourself in the tropical paradise of Bali, where lush rice terraces, ancient temples, and pristine beaches create a perfect backdrop for an unforgettable adventure. This comprehensive tour takes you through the island''s most breathtaking landscapes, from the cultural heart of Ubud to the stunning coastal areas. Experience authentic Balinese culture through traditional dance performances, temple visits, and local craft workshops. Indulge in rejuvenating spa treatments, exciting water activities, and the warm hospitality that has made Bali famous worldwide. Whether you seek spiritual enrichment, adventure, or simply relaxation, this Bali journey offers the perfect blend of experiences.',
  1599,
  10,
  'Bali, Indonesia',
  'asia',
  'https://pixabay.com/get/gd1cfd9117336e015c18a93ac3d8f2cce204180d3656936f2bbd91cb0b5877892fdda61ad98d72a2cf346edec698ab4ccd7479750fe7bf37d0104c5adca6c8dcc_1280.jpg',
  4.8,
  156,
  14,
  JSON_ARRAY('Beaches', 'Temples', 'Adventure'),
  JSON_ARRAY('Visit the sacred monkey forest sanctuary', 'Explore the iconic Tegalalang Rice Terraces', 'Witness the magnificent Uluwatu Temple sunset', 'Experience traditional Balinese dance performances', 'Snorkel in crystal clear waters of Nusa Penida'),
  JSON_ARRAY('9 nights accommodation in luxury resorts', 'Daily breakfast and select meals', 'Private airport transfers', 'Guided tours and entrance fees', 'Traditional Balinese massage', 'Snorkeling equipment', 'Local English-speaking guides'),
  JSON_ARRAY('International flights', 'Travel insurance', 'Optional activities not listed in the itinerary', 'Personal expenses and gratuities', 'Visa fees (if applicable)'),
  JSON_ARRAY(
    JSON_OBJECT('title', 'Arrival in Bali', 'description', 'Welcome to Bali! Upon arrival at Ngurah Rai International Airport, transfer to your hotel in Seminyak. Rest of the day at leisure to recover from your flight and enjoy the hotel facilities.'),
    JSON_OBJECT('title', 'Seminyak Beach & Sunset', 'description', 'Morning at leisure to enjoy Seminyak''s beaches. Afternoon shopping tour through stylish boutiques. Evening sunset dinner at a renowned beach club with spectacular ocean views.'),
    JSON_OBJECT('title', 'Journey to Ubud', 'description', 'After breakfast, transfer to Ubud. En route, visit Batuan Temple and a traditional art village. Afternoon check-in at your Ubud resort surrounded by lush jungle.')
  ),
  JSON_ARRAY('https://images.unsplash.com/photo-1604999333679-b86d54738315?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500', 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500')
);

-- Insert sample destinations
INSERT INTO destinations (name, country, image, tourCount, featured) VALUES
('Paris', 'France', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500', 24, true),
('Tokyo', 'Japan', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500', 18, true),
('Venice', 'Italy', 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500', 15, true);

-- Insert sample special offers
INSERT INTO specialOffers (title, description, image, originalPrice, discountedPrice, discountPercent, expiryDate) VALUES
('Luxury Beach Resort Package', 'Enjoy 7 nights at a 5-star beach resort with all-inclusive services and activities.', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500', 2999, 2399, 20, '2025-08-31'),
('European City Break', 'Explore the historical cities of Europe with this 10-day guided tour package.', 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500', 1899, 1519, 20, '2025-09-15');

-- Insert sample testimonials
INSERT INTO testimonials (name, avatar, comment, rating, packageName) VALUES
('Sarah Johnson', 'https://randomuser.me/api/portraits/women/12.jpg', 'The Santorini package exceeded all my expectations! The views were breathtaking, and our guide made the experience truly memorable.', 5, 'Santorini Island Escape'),
('Michael Brown', 'https://randomuser.me/api/portraits/men/32.jpg', 'Our Bali trip was absolutely perfect. The itinerary had a great balance of relaxation and adventure. Highly recommend!', 5, 'Bali Tropical Paradise'),
('Emma Wilson', 'https://randomuser.me/api/portraits/women/44.jpg', 'Great value for money. The accommodations were luxurious and the staff was always helpful and friendly.', 4, 'Santorini Island Escape');

-- Insert sample booking
INSERT INTO bookings (
  userId, 
  packageId, 
  packageName, 
  packageLocation, 
  bookingDate, 
  startDate, 
  travelers, 
  totalPrice, 
  contactName, 
  contactEmail, 
  contactPhone, 
  specialRequests
) VALUES (
  2, 
  1, 
  'Santorini Island Escape', 
  'Santorini, Greece', 
  '2025-05-16T08:30:00.000Z', 
  '2025-07-20T00:00:00.000Z', 
  2, 
  2598, 
  'John Doe', 
  'john@example.com', 
  '+1234567890', 
  'We would prefer a room with an ocean view if possible.'
);