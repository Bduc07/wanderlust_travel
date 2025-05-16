import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
}).extend({
  role: z.enum(["user", "admin"]).default("user"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Package model
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortDescription: text("shortDescription").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(),
  location: text("location").notNull(),
  region: text("region").notNull(),
  image: text("image").notNull(),
  rating: doublePrecision("rating").notNull().default(4.5),
  reviews: integer("reviews").notNull().default(0),
  groupSize: integer("groupSize").notNull().default(10),
  tags: jsonb("tags").notNull().$type<string[]>(),
  highlights: jsonb("highlights").notNull().$type<string[]>(),
  inclusions: jsonb("inclusions").notNull().$type<string[]>(),
  exclusions: jsonb("exclusions").notNull().$type<string[]>(),
  itinerary: jsonb("itinerary").notNull().$type<{ title: string; description: string }[]>(),
  gallery: jsonb("gallery").$type<string[]>(),
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
}).extend({
  tags: z.array(z.string()),
  highlights: z.array(z.string()),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  itinerary: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
  gallery: z.array(z.string()).optional(),
});

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

// Booking model
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("userId"),
  packageId: integer("packageId").notNull(),
  packageName: text("packageName").notNull(),
  packageLocation: text("packageLocation").notNull(),
  bookingDate: text("bookingDate").notNull(),
  startDate: text("startDate").notNull(),
  travelers: integer("travelers").notNull(),
  totalPrice: integer("totalPrice").notNull(),
  contactName: text("contactName").notNull(),
  contactEmail: text("contactEmail").notNull(),
  contactPhone: text("contactPhone").notNull(),
  specialRequests: text("specialRequests"),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  packageName: true,
  packageLocation: true,
  bookingDate: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Destination model
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  image: text("image").notNull(),
  tourCount: integer("tourCount").notNull(),
  featured: boolean("featured").default(false),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

// Special offer model
export const specialOffers = pgTable("specialOffers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  originalPrice: integer("originalPrice").notNull(),
  discountedPrice: integer("discountedPrice").notNull(),
  discountPercent: integer("discountPercent").notNull(),
  expiryDate: text("expiryDate"),
});

export const insertSpecialOfferSchema = createInsertSchema(specialOffers).omit({
  id: true,
});

export type InsertSpecialOffer = z.infer<typeof insertSpecialOfferSchema>;
export type SpecialOffer = typeof specialOffers.$inferSelect;

// Testimonial model
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  comment: text("comment").notNull(),
  rating: integer("rating").notNull(),
  packageName: text("packageName").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Newsletter subscription model
export const newsletterSubscriptions = pgTable("newsletterSubscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscriptionDate: text("subscriptionDate").notNull(),
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  subscriptionDate: true,
});

export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
