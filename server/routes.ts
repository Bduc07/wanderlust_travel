import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticate, authorizeAdmin, generateToken } from "./middleware/auth";
import bcrypt from "bcrypt";
import { insertUserSchema, insertPackageSchema, insertBookingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup API routes
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password, salt);
      
      // Create user with hashed password
      const newUser = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });
      
      // Generate JWT token
      const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      });
      
      // Return user (without password) and token
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      
      // Return user (without password) and token
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  // Users routes
  app.get("/api/users", authenticate, authorizeAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const sanitizedUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  app.get("/api/users/:id", authenticate, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Check if the user is trying to access their own data or is an admin
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Package routes
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  app.get("/api/packages/:id", async (req, res) => {
    try {
      const packageId = parseInt(req.params.id);
      const travelPackage = await storage.getPackage(packageId);
      
      if (!travelPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      res.json(travelPackage);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  app.post("/api/packages", authenticate, authorizeAdmin, async (req, res) => {
    try {
      const validatedData = insertPackageSchema.parse(req.body);
      const newPackage = await storage.createPackage(validatedData);
      res.status(201).json(newPackage);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  app.put("/api/packages/:id", authenticate, authorizeAdmin, async (req, res) => {
    try {
      const packageId = parseInt(req.params.id);
      const validatedData = insertPackageSchema.parse(req.body);
      
      // Check if package exists
      const existingPackage = await storage.getPackage(packageId);
      if (!existingPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      const updatedPackage = await storage.updatePackage(packageId, validatedData);
      res.json(updatedPackage);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  app.delete("/api/packages/:id", authenticate, authorizeAdmin, async (req, res) => {
    try {
      const packageId = parseInt(req.params.id);
      
      // Check if package exists
      const existingPackage = await storage.getPackage(packageId);
      if (!existingPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      await storage.deletePackage(packageId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Booking routes
  app.get("/api/bookings", authenticate, authorizeAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  app.get("/api/bookings/user/:userId", authenticate, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check if the user is trying to access their own bookings or is an admin
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      
      const bookings = await storage.getBookingsByUser(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check if package exists
      const travelPackage = await storage.getPackage(validatedData.packageId);
      if (!travelPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      // Set package-related data
      const bookingData = {
        ...validatedData,
        packageName: travelPackage.name,
        packageLocation: travelPackage.location,
        bookingDate: new Date().toISOString(),
      };
      
      const newBooking = await storage.createBooking(bookingData);
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  app.delete("/api/bookings/:id", authenticate, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      
      // Check if booking exists
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if the user is the booking owner or an admin
      if (req.user?.id !== booking.userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      
      await storage.deleteBooking(bookingId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Destination routes
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getAllDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Special offers routes
  app.get("/api/offers", async (req, res) => {
    try {
      const offers = await storage.getAllOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Check if already subscribed
      const isSubscribed = await storage.checkNewsletterSubscription(email);
      if (isSubscribed) {
        return res.status(400).json({ message: "Email is already subscribed" });
      }
      
      await storage.addNewsletterSubscription(email);
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
