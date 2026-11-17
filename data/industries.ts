import type { ProductSlug } from "./products";

export interface Industry {
  id: string;
  name: string;
  lead: string;
  product: ProductSlug;
  alsoUses?: ProductSlug[];
  types: string[];
  image: { src: string; alt: string; position: string };
}

export const industries: Industry[] = [
  { id: "retail", image: { src: "/images/industries/retail.jpg", alt: "A small convenience store with shelves of snacks and drinks", position: "50% 50%" }, name: "Retail & wholesale", lead: "Complete control over inventory, sales, customers, pricing and business performance — from one shop to a multi-branch chain.", product: "retail-manager", types: ["Supermarkets", "Grocery & Convenience Stores", "Pharmacies", "Fashion and Clothing Stores", "Electronics Retailers", "Cosmetic Shops", "Furniture Stores", "Hardware Stores", "Wholesale Businesses", "Multi-Location Retail Chains"] },
  { id: "restaurants", image: { src: "/images/industries/restaurants.jpg", alt: "A restaurant dining room with set tables and chairs", position: "50% 55%" }, name: "Restaurants & food service", lead: "Front-of-house and back-of-house operations managed together — orders, tables, kitchen, stock and reporting.", product: "restaurant-manager", types: ["Restaurants", "Fast Food Outlets", "Cafés and Coffee Shops", "Bars and Lounges", "Food Courts", "Bakeries", "Catering Businesses", "Multi-Branch Restaurant Chains"] },
  { id: "hospitality", image: { src: "/images/industries/hospitality.jpg", alt: "A modern hotel lobby with lounge seating", position: "50% 50%" }, name: "Hotels & hospitality", lead: "Reservations, front desk, housekeeping, billing and reporting for every kind of property, on a single platform.", product: "hotel-manager", alsoUses: ["restaurant-manager"], types: ["Hotels", "Resorts", "Guest Houses", "Lodges", "Serviced Apartments", "Boutique Hotels", "Vacation Rentals", "Hospitality Groups", "Conference and Event Centers"] },
  { id: "laundry", image: { src: "/images/industries/laundry.jpg", alt: "Stacks of folded clothes at a laundromat", position: "45% 50%" }, name: "Laundry & garment care", lead: "From drop-off to delivery: order tracking, garment processing, billing, pickup and delivery for every kind of laundry operation.", product: "laundry-manager", types: ["Laundry Shops", "Dry Cleaning Businesses", "Commercial Laundry Services", "Hotel Laundry Operations", "Industrial Laundry Facilities", "Self-Service Laundromats", "Multi-Branch Laundry Chains", "Garment Care Businesses"] },
];
