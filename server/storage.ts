import { eq, ilike } from "drizzle-orm";
import { db } from "./db";
import {
  users, User, InsertUser,
  packages, Package, InsertPackage,
  bookings, Booking, InsertBooking,
  destinations, Destination, InsertDestination,
  specialOffers, SpecialOffer, InsertSpecialOffer,
  testimonials, Testimonial, InsertTestimonial,
  newsletterSubscriptions, NewsletterSubscription
} from "@shared/schema";

// Storage interface with all required methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Package methods
  getAllPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: number, pkg: InsertPackage): Promise<Package>;
  deletePackage(id: number): Promise<void>;

  // Booking methods
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking & { packageName: string; packageLocation: string; bookingDate: string }): Promise<Booking>;
  deleteBooking(id: number): Promise<void>;

  // Destination methods
  getAllDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;

  // Special offer methods
  getAllOffers(): Promise<SpecialOffer[]>;
  getOffer(id: number): Promise<SpecialOffer | undefined>;
  createOffer(offer: InsertSpecialOffer): Promise<SpecialOffer>;

  // Testimonial methods
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Newsletter methods
  checkNewsletterSubscription(email: string): Promise<boolean>;
  addNewsletterSubscription(email: string): Promise<NewsletterSubscription>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(ilike(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Package methods
  async getAllPackages(): Promise<Package[]> {
    return db.select().from(packages);
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [newPackage] = await db.insert(packages).values(pkg).returning();
    return newPackage;
  }

  async updatePackage(id: number, pkg: InsertPackage): Promise<Package> {
    const [updatedPackage] = await db.update(packages).set(pkg).where(eq(packages.id, id)).returning();
    return updatedPackage;
  }

  async deletePackage(id: number): Promise<void> {
    await db.delete(packages).where(eq(packages.id, id));
  }

  // Booking methods
  async getAllBookings(): Promise<Booking[]> {
    return db.select().from(bookings);
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async createBooking(booking: InsertBooking & { packageName: string; packageLocation: string; bookingDate: string }): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async deleteBooking(id: number): Promise<void> {
    await db.delete(bookings).where(eq(bookings.id, id));
  }

  // Destination methods
  async getAllDestinations(): Promise<Destination[]> {
    return db.select().from(destinations);
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    return destination;
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const [newDestination] = await db.insert(destinations).values(destination).returning();
    return newDestination;
  }

  // Special offer methods
  async getAllOffers(): Promise<SpecialOffer[]> {
    return db.select().from(specialOffers);
  }

  async getOffer(id: number): Promise<SpecialOffer | undefined> {
    const [offer] = await db.select().from(specialOffers).where(eq(specialOffers.id, id));
    return offer;
  }

  async createOffer(offer: InsertSpecialOffer): Promise<SpecialOffer> {
    const [newOffer] = await db.insert(specialOffers).values(offer).returning();
    return newOffer;
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials);
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  // Newsletter methods
  async checkNewsletterSubscription(email: string): Promise<boolean> {
    const [subscription] = await db.select().from(newsletterSubscriptions).where(ilike(newsletterSubscriptions.email, email));
    return !!subscription;
  }

  async addNewsletterSubscription(email: string): Promise<NewsletterSubscription> {
    const [newSubscription] = await db.insert(newsletterSubscriptions).values({
      email,
      subscriptionDate: new Date().toISOString(),
    }).returning();
    return newSubscription;
  }
}

export const storage = new DatabaseStorage();
