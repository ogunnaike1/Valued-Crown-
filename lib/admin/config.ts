import type { ProductSlug } from "@/data/products";
import type { IconName } from "@/components/admin/Icon";

export type WorkspaceSlug = ProductSlug;

export interface NavItem { href: string; label: string; icon: IconName; badge?: "alerts" | "pending" }
export interface NavGroup { label: string; items: NavItem[] }

export interface Branch { id: string; name: string; city: string }
export const BRANCHES: Branch[] = [
  { id: "lekki", name: "Lekki Branch", city: "Lagos" },
  { id: "ikeja", name: "Ikeja Branch", city: "Lagos" },
  { id: "abuja", name: "Abuja Branch", city: "Abuja" },
];

export interface ListSpec {
  path: string; // under /admin
  title: string;
  singular: string;
  detailLabel: string;
  statuses: string[];
}

export interface Workspace {
  slug: WorkspaceSlug;
  name: string;
  icon: IconName;
  /** how the business refers to things */
  words: { sale: string; sales: string; customer: string; customers: string; item: string; items: string };
  revenueLabel: string;
  base: { revenue: number; ticket: number; margin: number; itemsPerTxn: number; weekday: number[] }; // weekday Sun..Sat weights
  primary: ListSpec;
  customers: { path: string; title: string; singular: string };
  nav: NavGroup[];
  opsLabels: [string, string, string, string];
  mixTitle: string;
  mixLabels: string[];
  categoryTitle: string;
  categories: { name: string; share: number }[];
  topTitle: string;
  topItems: { name: string; unit: string; price: number }[];
  attentionTitle: string;
  attentionAction: string;
  staffTitle: string;
  checklist: string[];
}

const adminGroup = (extra: NavItem[] = []): NavGroup => ({
  label: "Administration",
  items: [...extra, { href: "/admin/branches", label: "Branches", icon: "building" }, { href: "/admin/users", label: "Users & roles", icon: "shield" }, { href: "/admin/settings", label: "Settings", icon: "cog" }],
});

export const WORKSPACES: Record<WorkspaceSlug, Workspace> = {
  "hotel-manager": {
    slug: "hotel-manager", name: "Hotel Manager", icon: "bed",
    words: { sale: "folio", sales: "folios", customer: "guest", customers: "guests", item: "room night", items: "room nights" },
    revenueLabel: "Revenue",
    base: { revenue: 1_450_000, ticket: 58_000, margin: 0.62, itemsPerTxn: 1.8, weekday: [0.92, 0.82, 0.8, 0.88, 1.0, 1.22, 1.18] },
    primary: { path: "reservations", title: "Reservations", singular: "reservation", detailLabel: "Room", statuses: ["Reserved", "Checked in", "Checked out", "Cancelled", "No-show"] },
    customers: { path: "guests", title: "Guests", singular: "guest" },
    nav: [
      { label: "Operations", items: [
        { href: "/admin", label: "Dashboard", icon: "home" },
        { href: "/admin/reservations", label: "Reservations", icon: "calendar", badge: "pending" },
        { href: "/admin/front-desk", label: "Front desk", icon: "user" },
        { href: "/admin/housekeeping", label: "Housekeeping", icon: "tool", badge: "alerts" },
        { href: "/admin/restaurant-bar", label: "Restaurant & bar", icon: "utensils" },
        { href: "/admin/events", label: "Conference & events", icon: "building" },
      ] },
      { label: "Guests", items: [
        { href: "/admin/guests", label: "Guests", icon: "users" },
        { href: "/admin/loyalty", label: "Feedback & loyalty", icon: "star" },
      ] },
      { label: "Finance & stock", items: [
        { href: "/admin/billing", label: "Billing & folios", icon: "receipt" },
        { href: "/admin/inventory", label: "Inventory & procurement", icon: "box" },
        { href: "/admin/reports", label: "Reports", icon: "chart" },
      ] },
      adminGroup(),
    ],
    opsLabels: ["Occupancy", "Arrivals today", "Departures today", "Rooms to clean"],
    mixTitle: "Room status", mixLabels: ["Occupied", "Vacant · clean", "Vacant · dirty", "Out of order"],
    categoryTitle: "Revenue mix", categories: [{ name: "Rooms", share: 62 }, { name: "Restaurant & bar", share: 20 }, { name: "Conference & events", share: 11 }, { name: "Other services", share: 7 }],
    topTitle: "Top room types", topItems: [{ name: "Deluxe King", unit: "nights", price: 62_000 }, { name: "Standard Twin", unit: "nights", price: 38_000 }, { name: "Executive Suite", unit: "nights", price: 95_000 }, { name: "Classic Double", unit: "nights", price: 45_000 }, { name: "Presidential Suite", unit: "nights", price: 180_000 }],
    attentionTitle: "Housekeeping & maintenance", attentionAction: "Assign all",
    staffTitle: "Front office on duty",
    checklist: ["Add your rooms and room types", "Set room rates and taxes", "Invite front-desk staff", "Connect restaurant POS", "Configure billing & payment methods", "Import guest records", "Set up housekeeping schedules"],
  },
  "restaurant-manager": {
    slug: "restaurant-manager", name: "Restaurant Manager", icon: "utensils",
    words: { sale: "order", sales: "orders", customer: "customer", customers: "customers", item: "item", items: "items" },
    revenueLabel: "Sales",
    base: { revenue: 720_000, ticket: 6_500, margin: 0.64, itemsPerTxn: 3.1, weekday: [1.15, 0.78, 0.8, 0.86, 0.95, 1.3, 1.36] },
    primary: { path: "orders", title: "Orders", singular: "order", detailLabel: "Table / channel", statuses: ["Preparing", "Ready", "Completed", "Voided", "Refunded"] },
    customers: { path: "customers", title: "Customers", singular: "customer" },
    nav: [
      { label: "Operations", items: [
        { href: "/admin", label: "Dashboard", icon: "home" },
        { href: "/admin/orders", label: "Orders", icon: "receipt", badge: "pending" },
        { href: "/admin/tables", label: "Tables & reservations", icon: "calendar" },
        { href: "/admin/kitchen", label: "Kitchen display", icon: "flame" },
      ] },
      { label: "Menu & stock", items: [
        { href: "/admin/menu", label: "Menu", icon: "utensils" },
        { href: "/admin/inventory", label: "Inventory", icon: "box", badge: "alerts" },
        { href: "/admin/purchasing", label: "Purchasing & suppliers", icon: "truck" },
      ] },
      { label: "People", items: [
        { href: "/admin/customers", label: "Customers", icon: "users" },
        { href: "/admin/loyalty", label: "Loyalty & promotions", icon: "gift" },
        { href: "/admin/staff", label: "Staff & shifts", icon: "clock" },
      ] },
      { label: "Insights", items: [{ href: "/admin/reports", label: "Reports", icon: "chart" }] },
      adminGroup(),
    ],
    opsLabels: ["Open tables", "Orders in kitchen", "Avg prep time", "Low-stock ingredients"],
    mixTitle: "Table status", mixLabels: ["Occupied", "Available", "Reserved", "Needs cleaning"],
    categoryTitle: "Sales by menu category", categories: [{ name: "Mains", share: 44 }, { name: "Drinks", share: 24 }, { name: "Starters", share: 14 }, { name: "Sides", share: 10 }, { name: "Desserts", share: 8 }],
    topTitle: "Best-selling menu items", topItems: [{ name: "Jollof Rice & Chicken", unit: "plates", price: 5_500 }, { name: "Grilled Tilapia", unit: "plates", price: 9_500 }, { name: "Pounded Yam & Egusi", unit: "plates", price: 6_800 }, { name: "Suya Platter", unit: "plates", price: 7_500 }, { name: "Chapman", unit: "glasses", price: 2_500 }],
    attentionTitle: "Low-stock ingredients", attentionAction: "Reorder all",
    staffTitle: "Staff on shift",
    checklist: ["Add your menu categories and items", "Set up your tables", "Invite waiters and cashiers", "Configure kitchen display (KOT)", "Add ingredients and stock levels", "Set up payment methods", "Add suppliers"],
  },
  "shop-manager": {
    slug: "shop-manager", name: "Shop Manager", icon: "store",
    words: { sale: "sale", sales: "sales", customer: "customer", customers: "customers", item: "item", items: "items" },
    revenueLabel: "Sales",
    base: { revenue: 980_000, ticket: 8_200, margin: 0.28, itemsPerTxn: 4.2, weekday: [0.75, 0.9, 0.88, 0.92, 1.0, 1.25, 1.3] },
    primary: { path: "sales", title: "Sales", singular: "sale", detailLabel: "Basket", statuses: ["Completed", "Held", "Voided", "Partially refunded", "Refunded"] },
    customers: { path: "customers", title: "Customers", singular: "customer" },
    nav: [
      { label: "Operations", items: [
        { href: "/admin", label: "Dashboard", icon: "home" },
        { href: "/admin/sales", label: "Sales", icon: "receipt", badge: "pending" },
        { href: "/admin/returns", label: "Returns & refunds", icon: "refresh" },
      ] },
      { label: "Catalog & stock", items: [
        { href: "/admin/products", label: "Products", icon: "tag" },
        { href: "/admin/inventory", label: "Inventory control", icon: "box", badge: "alerts" },
        { href: "/admin/transfers", label: "Stock transfers", icon: "truck" },
        { href: "/admin/purchasing", label: "Purchasing & suppliers", icon: "layers" },
      ] },
      { label: "Customers", items: [
        { href: "/admin/customers", label: "Customers", icon: "users" },
        { href: "/admin/loyalty", label: "Loyalty & promotions", icon: "gift" },
      ] },
      { label: "Insights", items: [{ href: "/admin/reports", label: "Financial reports", icon: "chart" }, { href: "/admin/expenses", label: "Expenses", icon: "wallet" }] },
      adminGroup(),
    ],
    opsLabels: ["Low-stock items", "Open purchase orders", "Active cashiers", "Transfers in transit"],
    mixTitle: "Stock health", mixLabels: ["In stock", "Low stock", "Out of stock"],
    categoryTitle: "Sales by category", categories: [{ name: "Groceries", share: 38 }, { name: "Beverages", share: 22 }, { name: "Household", share: 17 }, { name: "Personal care", share: 14 }, { name: "Electronics", share: 9 }],
    topTitle: "Top products", topItems: [{ name: "Peak Milk 400g", unit: "units", price: 3_400 }, { name: "Indomie Carton (40)", unit: "cartons", price: 9_200 }, { name: "Golden Penny Rice 5kg", unit: "bags", price: 8_900 }, { name: "Coca-Cola 50cl (12)", unit: "packs", price: 4_800 }, { name: "Dettol 500ml", unit: "units", price: 3_900 }],
    attentionTitle: "Low stock", attentionAction: "Reorder all",
    staffTitle: "Cashiers on shift",
    checklist: ["Add your product categories", "Import or add products", "Set stock levels & reorder points", "Invite cashiers", "Add suppliers", "Configure receipts & payments", "Add your branches"],
  },
  "laundry-manager": {
    slug: "laundry-manager", name: "Laundry Manager", icon: "shirt",
    words: { sale: "order", sales: "orders", customer: "customer", customers: "customers", item: "garment", items: "garments" },
    revenueLabel: "Revenue",
    base: { revenue: 310_000, ticket: 4_800, margin: 0.55, itemsPerTxn: 6.5, weekday: [0.5, 1.2, 1.0, 0.95, 0.95, 1.1, 1.3] },
    primary: { path: "orders", title: "Orders", singular: "order", detailLabel: "Service", statuses: ["Received", "Washing", "Ironing", "Ready", "Delivered", "Cancelled"] },
    customers: { path: "customers", title: "Customers", singular: "customer" },
    nav: [
      { label: "Operations", items: [
        { href: "/admin", label: "Dashboard", icon: "home" },
        { href: "/admin/orders", label: "Orders", icon: "receipt", badge: "pending" },
        { href: "/admin/workflow", label: "Workflow", icon: "layers" },
        { href: "/admin/garments", label: "Garment tracking", icon: "tag" },
        { href: "/admin/deliveries", label: "Pickup & delivery", icon: "truck", badge: "alerts" },
      ] },
      { label: "Customers", items: [
        { href: "/admin/customers", label: "Customers", icon: "users" },
        { href: "/admin/loyalty", label: "Loyalty & notifications", icon: "gift" },
      ] },
      { label: "Finance & stock", items: [
        { href: "/admin/billing", label: "Billing & invoices", icon: "wallet" },
        { href: "/admin/inventory", label: "Supplies inventory", icon: "box" },
        { href: "/admin/reports", label: "Reports", icon: "chart" },
      ] },
      adminGroup(),
    ],
    opsLabels: ["Orders in process", "Ready for pickup", "Deliveries today", "Overdue orders"],
    mixTitle: "Orders by stage", mixLabels: ["Received & sorting", "Washing", "Ironing & finishing", "Ready"],
    categoryTitle: "Revenue by service", categories: [{ name: "Washing", share: 34 }, { name: "Dry cleaning", share: 29 }, { name: "Ironing", share: 18 }, { name: "Stain removal", share: 8 }, { name: "Pickup & delivery", share: 11 }],
    topTitle: "Top services", topItems: [{ name: "Wash & fold (per kg)", unit: "kg", price: 1_200 }, { name: "Suit dry cleaning", unit: "pieces", price: 4_500 }, { name: "Shirt ironing", unit: "pieces", price: 600 }, { name: "Duvet cleaning", unit: "pieces", price: 6_000 }, { name: "Agbada dry cleaning", unit: "pieces", price: 5_000 }],
    attentionTitle: "Overdue pickups & deliveries", attentionAction: "Notify all",
    staffTitle: "Front desk & drivers",
    checklist: ["Add your services and prices", "Set up garment tagging", "Invite front-desk staff", "Add drivers and delivery zones", "Add supplies inventory", "Configure SMS/email notifications", "Add your outlets"],
  },
};

export const WORKSPACE_LIST = Object.values(WORKSPACES);
