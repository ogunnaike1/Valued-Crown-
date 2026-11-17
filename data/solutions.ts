import type { ProductSlug } from "./products";

export interface Capability {
  id: string;
  title: string;
  summary: string;
  points: string[];
  products: ProductSlug[];
}

/** Capability areas, grouped from the feature lists in the supplied product documents. */
export const capabilities: Capability[] = [
  { id: "pos", title: "Point of sale", summary: "Serve customers faster and manage transactions efficiently, at the counter, the table or the bar.", points: ["Fast checkout and order entry", "Multiple payment methods", "Discounts and promotional pricing", "Receipt printing and digital receipts", "Barcode scanning (retail) · split billing and bill merging (restaurant)"], products: ["shop-manager", "restaurant-manager", "hotel-manager"] },
  { id: "inventory", title: "Inventory & stock", summary: "Control costs and stop shortages with live stock monitoring from shelf, kitchen, store room or laundry supplies.", points: ["Real-time stock monitoring and low-stock alerts", "Purchase order and supplier management", "Stock transfers between branches (retail)", "Ingredient-level tracking and waste tracking (restaurant)", "Detergent, chemical and packaging tracking (laundry)"], products: ["shop-manager", "restaurant-manager", "hotel-manager", "laundry-manager"] },
  { id: "billing", title: "Billing & payments", summary: "Simplify billing with automated invoicing, flexible payment methods and clear account balances.", points: ["Automated billing and invoicing", "Multiple payment methods", "Deposit and advance payment tracking", "Outstanding balance management", "Tax and service charge management (hotel)"], products: ["hotel-manager", "laundry-manager", "restaurant-manager", "shop-manager"] },
  { id: "reservations", title: "Reservations & bookings", summary: "Keep availability accurate and bookings organised, for rooms, tables and events.", points: ["Room reservations, group and walk-in bookings", "Reservation calendar and availability tracking", "Table reservations, transfers and merging", "Conference hall bookings and event scheduling"], products: ["hotel-manager", "restaurant-manager"] },
  { id: "customers", title: "Customer & guest relationships", summary: "Build loyalty and repeat business with a database of every customer or guest.", points: ["Customer and guest databases", "Purchase, dining and service history", "Loyalty and rewards programs", "Feedback management", "Promotional and marketing campaigns"], products: ["shop-manager", "restaurant-manager", "hotel-manager", "laundry-manager"] },
  { id: "operations", title: "Operations & workflow", summary: "Keep the work moving between teams — from front desk to housekeeping, waiter to kitchen, intake to delivery.", points: ["Kitchen Order Tickets with real-time updates", "Housekeeping schedules and maintenance requests", "Garment tracking with barcode and QR code support", "Sorting, washing, ironing and quality-control workflow", "Pickup scheduling, route planning and driver assignment"], products: ["restaurant-manager", "hotel-manager", "laundry-manager"] },
  { id: "multi-branch", title: "Multi-branch management", summary: "Run several locations from one centralized platform with consolidated reporting.", points: ["Centralized control and administration", "Branch performance monitoring and comparison", "Consolidated reporting", "Real-time data synchronization (retail)"], products: ["shop-manager", "restaurant-manager", "hotel-manager", "laundry-manager"] },
  { id: "reporting", title: "Reporting & analytics", summary: "Turn everyday transactions into the information needed to make better decisions.", points: ["Sales, revenue and profitability reports", "Inventory and product-performance reports", "Occupancy and room-performance analysis (hotel)", "Food cost and best-selling item reports (restaurant)", "Outstanding payments and service reports (laundry)"], products: ["shop-manager", "restaurant-manager", "hotel-manager", "laundry-manager"] },
  { id: "security", title: "Security & deployment", summary: "Protect business data with access controls and flexible deployment.", points: ["User roles and permissions", "Automated or daily data backups", "Cloud and on-premise deployment options (retail, hotel)", "Secure, reliable platform"], products: ["shop-manager", "hotel-manager", "restaurant-manager", "laundry-manager"] },
];
