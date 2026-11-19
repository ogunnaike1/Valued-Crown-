/**
 * Product content. Every string below is taken from the supplied "website contents" documents
 * (Hotel Manager, Restaurant Manager, Retail/Shop Manager, Laundry Manager, Retail Shop Documentation).
 */
export type ProductSlug = "hotel-manager" | "restaurant-manager" | "shop-manager" | "laundry-manager";

export interface FeatureGroup { title: string; blurb: string; items: string[] }
export interface ProductImage { src: string; alt: string; position: string }
export interface Product {
  slug: ProductSlug;
  image: ProductImage;
  /** Real screenshot of the software, shown in the product site instead of the drawn preview. */
  screenshot?: { src: string; alt: string; width: number; height: number };
  name: string;
  industry: string; // short category label
  subtitle: string;
  headline: string;
  intro: string[];
  tagline: string;
  groups: FeatureGroup[];
  benefits: { title: string; body: string }[];
  idealFor: string[];
  why: string[];
  modules?: { title: string; body: string }[];
  closing: { title: string; body: string[] };
  colors: { bg: string; fg: string; line: string; edge: string };
  capabilities: string[]; // ids from data/solutions.ts
  meta: string;
}

export const products: Product[] = [
  {
    slug: "hotel-manager",
    image: { src: "/images/products/hotel-manager.jpg", alt: "Hotel reception desk in a lobby", position: "50% 55%" },
    name: "Hotel Manager",
    industry: "Hospitality",
    subtitle: "Complete Hotel Management Software for Modern Hospitality Businesses",
    headline: "Transform your hotel operations with Hotel Manager",
    intro: [
      "Hotel Manager is a comprehensive hotel management solution designed to streamline daily operations, enhance guest experiences, and improve business profitability. Whether you operate a hotel, resort, guest house, serviced apartment, lodge, or hospitality group, it provides the tools needed to manage every aspect of your property from a single platform.",
      "From reservations and front desk operations to housekeeping, billing, and reporting, Hotel Manager empowers hospitality businesses to deliver exceptional guest service while maintaining complete operational control.",
    ],
    tagline: "Manage Rooms. Delight Guests. Grow Revenue.",
    groups: [
      { title: "Property Management System (PMS)", blurb: "Manage all hotel operations seamlessly through an integrated Property Management System.", items: ["Room reservations and bookings", "Guest check-in and check-out", "Room allocation and transfers", "Group bookings management", "Walk-in guest management", "Reservation calendar and availability tracking"] },
      { title: "Front Desk Management", blurb: "Enhance guest service and improve operational efficiency.", items: ["Real-time room status monitoring", "Guest profile management", "Express check-in/check-out", "Guest history and preferences", "Folio management", "Multi-currency support"] },
      { title: "Housekeeping Management", blurb: "Maintain room readiness and operational excellence.", items: ["Room cleaning schedules", "Housekeeping task assignments", "Room status updates", "Maintenance request management", "Lost and found tracking"] },
      { title: "Billing & Payment Management", blurb: "Simplify financial operations and guest billing.", items: ["Automated billing and invoicing", "Multiple payment methods", "Guest account management", "Deposit and advance payment tracking", "Tax and service charge management", "Financial reconciliation"] },
      { title: "Restaurant & POS Integration", blurb: "Integrate restaurant and bar operations directly into guest accounts.", items: ["Restaurant POS integration", "Bar and lounge billing", "Room charge posting", "Food and beverage sales tracking", "Inventory synchronization"] },
      { title: "Inventory & Procurement", blurb: "Control operational costs and manage supplies effectively.", items: ["Inventory tracking", "Purchase order management", "Supplier management", "Stock level monitoring", "Low stock alerts", "Asset management"] },
      { title: "Guest Relationship Management", blurb: "Build loyalty and improve guest satisfaction.", items: ["Guest database management", "Guest feedback collection", "Loyalty programs", "Marketing campaigns", "Personalized guest experiences"] },
      { title: "Reporting & Analytics", blurb: "Gain valuable insights into business performance.", items: ["Occupancy reports", "Revenue reports", "Daily management reports", "Room performance analysis", "Guest statistics", "Financial reports", "Departmental performance reports"] },
    ],
    benefits: [
      { title: "Enhance guest experience", body: "Deliver seamless guest journeys from reservation to checkout with faster service and personalized attention." },
      { title: "Improve operational efficiency", body: "Automate routine tasks, reduce manual errors, and increase staff productivity across departments." },
      { title: "Maximize revenue", body: "Monitor occupancy, optimize room rates, and identify revenue opportunities through real-time analytics." },
      { title: "Better financial control", body: "Track revenue, expenses, and departmental performance with comprehensive reporting tools." },
      { title: "Centralized property management", body: "Manage multiple properties and branches from a single platform with centralized reporting and administration." },
      { title: "Secure and reliable", body: "Protect guest and business information through advanced security controls, user permissions, and automated backups." },
    ],
    idealFor: ["Hotels", "Resorts", "Guest Houses", "Lodges", "Serviced Apartments", "Boutique Hotels", "Vacation Rentals", "Hospitality Groups", "Conference and Event Centers"],
    why: ["Easy-to-use interface", "Comprehensive property management features", "Real-time room availability and occupancy tracking", "Integrated restaurant and POS management", "Advanced reporting and analytics", "Multi-property support", "Secure cloud and on-premise deployment options", "Dedicated technical support"],
    modules: [
      { title: "Front Office Management", body: "Manage reservations, guest registration, room assignments, and checkout processes efficiently." },
      { title: "Housekeeping Management", body: "Monitor room cleanliness, maintenance requests, and housekeeping staff performance." },
      { title: "Revenue Management", body: "Track room revenue, occupancy trends, and financial performance in real time." },
      { title: "Restaurant & Bar Management", body: "Manage food and beverage operations while seamlessly integrating charges into guest accounts." },
      { title: "Conference & Event Management", body: "Handle conference hall bookings, event scheduling, banquet services, and customer billing from one centralized platform." },
    ],
    closing: {
      title: "Transform hospitality through technology",
      body: ["Hotel Manager is more than a hotel software solution — it is a complete hospitality management platform designed to help property owners improve guest satisfaction, streamline operations, and drive sustainable growth.", "Whether you manage a small guest house or a large hotel chain, Hotel Manager provides the technology and insights needed to stay competitive in today's hospitality industry."],
    },
    colors: { bg: "#041433", fg: "#FAFCFF", line: "rgba(250,252,255,.16)", edge: "rgba(250,252,255,.2)" },
    capabilities: ["reservations", "billing", "inventory", "customers", "multi-branch", "reporting", "operations", "security", "pos"],
    meta: "Hotel Manager — complete hotel management software: reservations, front desk, housekeeping, billing, restaurant POS integration and reporting.",
  },
  {
    slug: "restaurant-manager",
    screenshot: { src: "/images/products/restaurant-manager-dashboard.jpg", alt: "Restaurant Manager back office dashboard showing receipts, payment modes and top-selling products", width: 1080, height: 775 },
    image: { src: "/images/products/restaurant-manager.jpg", alt: "Waiter carrying drinks on a tray in a restaurant", position: "50% 40%" },
    name: "Restaurant Manager",
    industry: "Food service",
    subtitle: "Complete Restaurant Management Software for Modern Food Businesses",
    headline: "Run your restaurant smarter with Restaurant Manager",
    intro: [
      "Restaurant Manager is a comprehensive restaurant management software solution designed to simplify operations, improve service delivery, and maximize profitability. Whether you own a restaurant, café, fast-food outlet, lounge, bar, or a multi-branch food business, it provides the tools needed to efficiently manage your front-of-house and back-of-house operations.",
      "From order processing and kitchen management to inventory control and business reporting, Restaurant Manager helps you deliver exceptional dining experiences while maintaining complete operational control.",
    ],
    tagline: "Manage Orders. Control Costs. Delight Customers.",
    groups: [
      { title: "Point of Sale (POS) System", blurb: "Serve customers faster and manage transactions efficiently.", items: ["Fast order entry and processing", "Touchscreen-enabled POS interface", "Multiple payment methods", "Split billing and bill merging", "Discounts and promotional offers", "Receipt printing and digital receipts"] },
      { title: "Table Management", blurb: "Optimize seating and improve customer service.", items: ["Real-time table status monitoring", "Table reservations and bookings", "Table transfers and merging", "Dine-in, takeaway, and delivery support"] },
      { title: "Kitchen Order Management (KOT)", blurb: "Improve communication between service staff and kitchen teams.", items: ["Automatic Kitchen Order Ticket (KOT) generation", "Real-time order updates", "Order preparation tracking", "Kitchen Display", "Reduced order errors and delays"] },
      { title: "Inventory & Stock Management", blurb: "Keep food costs under control and prevent stock shortages.", items: ["Ingredient-level inventory tracking", "Stock consumption monitoring", "Low-stock alerts", "Purchase order management", "Supplier management", "Waste and spoilage tracking"] },
      { title: "Menu Management", blurb: "Easily manage your menu offerings and pricing.", items: ["Menu customization", "Category management", "Combo meal creation", "Happy hour and promotional pricing", "Seasonal menu updates"] },
      { title: "Customer Management", blurb: "Build customer loyalty and improve guest experiences.", items: ["Customer database", "Dining history tracking", "Loyalty and rewards programs", "Customer feedback management", "Personalized promotions"] },
      { title: "Staff Management", blurb: "Monitor employee performance and productivity.", items: ["Staff attendance tracking", "User role management", "Cashier and waiter performance reports", "Shift management"] },
      { title: "Reporting & Analytics", blurb: "Make informed business decisions with real-time insights.", items: ["Sales reports", "Revenue analysis", "Best-selling menu items", "Food cost reports", "Inventory reports", "Profitability analysis", "Branch performance reports"] },
    ],
    benefits: [
      { title: "Faster service delivery", body: "Reduce wait times and improve order accuracy through seamless order processing and kitchen communication." },
      { title: "Better inventory control", body: "Monitor stock usage in real time and reduce waste, theft, and unnecessary expenses." },
      { title: "Increased profitability", body: "Identify top-performing menu items, optimize pricing, and control operating costs." },
      { title: "Improved customer experience", body: "Deliver faster service, accurate billing, and personalized customer engagement." },
      { title: "Real-time business insights", body: "Access critical business information anytime to support better decision-making." },
      { title: "Scalable solution", body: "Whether you operate a single restaurant or multiple branches, Restaurant Manager grows with your business." },
    ],
    idealFor: ["Restaurants", "Fast Food Outlets", "Cafés and Coffee Shops", "Bars and Lounges", "Hotels and Resorts", "Food Courts", "Bakeries", "Catering Businesses", "Multi-Branch Restaurant Chains"],
    why: ["Easy-to-use interface", "Real-time order and inventory tracking", "Complete restaurant operations management", "Multi-branch support", "Comprehensive reporting and analytics", "Secure and reliable platform", "Dedicated technical support"],
    closing: {
      title: "Transform your restaurant operations",
      body: ["Restaurant Manager is more than a restaurant POS system — it is a complete business management platform designed to help restaurant owners improve efficiency, enhance customer satisfaction, and drive sustainable growth.", "Whether you are managing a busy restaurant, a growing café, or a large food service operation, Restaurant Manager gives you the tools to stay organized, profitable, and competitive."],
    },
    colors: { bg: "#0A1E45", fg: "#FAFCFF", line: "rgba(250,252,255,.16)", edge: "rgba(250,252,255,.2)" },
    capabilities: ["pos", "reservations", "inventory", "customers", "multi-branch", "reporting", "operations", "billing", "security"],
    meta: "Restaurant Manager — restaurant POS, table management, kitchen order tickets, inventory, menu management and reporting for restaurants, cafés and bars.",
  },
  {
    slug: "shop-manager",
    image: { src: "/images/products/shop-manager.jpg", alt: "Shop assistant using a point-of-sale tablet at a store counter", position: "62% 50%" },
    name: "Shop Manager",
    industry: "Retail",
    subtitle: "The Complete Retail Management Solution for Growing Businesses",
    headline: "Take control of your retail business",
    intro: [
      "Running a successful retail business requires more than just selling products — it requires complete control over inventory, sales, customers, pricing, and business performance.",
      "Shop Manager is a powerful, all-in-one retail management software designed to help businesses automate operations, improve efficiency, increase profitability, and deliver exceptional customer experiences. Whether you operate a supermarket, pharmacy, fashion store, electronics shop, wholesale outlet, or a multi-branch retail chain, it provides everything you need to manage your business with confidence.",
    ],
    tagline: "Manage Smarter. Sell Faster. Grow Bigger.",
    groups: [
      { title: "Point of Sale (POS)", blurb: "Speed up customer transactions with an intuitive and user-friendly POS system.", items: ["Quick sales processing", "Barcode scanner integration", "Multiple payment options", "Receipt printing and email receipts", "Discounts and promotional pricing", "Returns and refund management"] },
      { title: "Inventory Control", blurb: "Never lose track of your stock again.", items: ["Real-time inventory monitoring", "Low-stock alerts", "Stock transfers between branches", "Product categorization", "Supplier management", "Purchase order tracking"] },
      { title: "Sales Management", blurb: "Gain complete visibility into your sales performance.", items: ["Daily sales reports", "Revenue tracking", "Product performance analysis", "Cashier performance monitoring", "Sales trend reporting", "Profitability analysis"] },
      { title: "Customer Management", blurb: "Build stronger customer relationships and increase repeat business.", items: ["Customer database management", "Purchase history tracking", "Loyalty and rewards programs", "Customer-specific pricing", "Promotional campaigns"] },
      { title: "Multi-Branch Management", blurb: "Manage multiple retail locations from one centralized platform.", items: ["Centralized inventory control", "Branch performance monitoring", "Consolidated business reporting", "Real-time data synchronization"] },
      { title: "Financial Reporting", blurb: "Transform data into decisions with accurate and timely information.", items: ["Profit and loss reports", "Sales and inventory reports", "Product movement analysis", "Customer purchase trends", "Inventory valuation", "Tax and financial reports", "Expense tracking"] },
    ],
    benefits: [
      { title: "Improve efficiency", body: "Automate routine tasks and reduce manual errors, allowing your team to focus on serving customers." },
      { title: "Increase profitability", body: "Gain insights into product performance, inventory movement, and sales trends to maximize revenue opportunities." },
      { title: "Enhance customer experience", body: "Deliver faster checkout experiences and personalized customer service." },
      { title: "Real-time business visibility", body: "Access up-to-date information on sales, stock levels, and financial performance anytime." },
      { title: "Secure and reliable", body: "Protect your business data with secure access controls, user permissions, and automated backups." },
      { title: "Reduce inventory losses", body: "Real-time stock monitoring and low-stock alerts keep every product accounted for." },
    ],
    idealFor: ["Supermarkets", "Grocery & Convenience Stores", "Pharmacies", "Fashion and Clothing Stores", "Electronics Retailers", "Cosmetic Shops", "Furniture Stores", "Hardware Stores", "Wholesale Businesses", "Multi-Location Retail Chains"],
    why: ["Easy to use", "Fast and reliable performance", "Scalable for growing businesses", "Real-time reporting and analytics", "Multi-branch support", "Dedicated technical support", "Affordable licensing options"],
    closing: {
      title: "Empower your business with Shop Manager",
      body: ["Shop Manager is more than a software solution — it's a complete retail management platform designed to help retailers simplify operations, improve decision-making, and drive sustainable business growth.", "Whether you're starting a new retail business or expanding an existing one, Shop Manager gives you the technology and tools needed to stay ahead in a competitive marketplace."],
    },
    colors: { bg: "#FFFFFF", fg: "#041433", line: "#E3E4E8", edge: "transparent" },
    capabilities: ["pos", "inventory", "customers", "multi-branch", "reporting", "billing", "security"],
    meta: "Shop Manager — all-in-one retail management software: POS, inventory control, sales management, customers, multi-branch and reporting.",
  },
  {
    slug: "laundry-manager",
    image: { src: "/images/products/laundry-manager.jpg", alt: "Commercial washing machines with a laundry basket", position: "50% 60%" },
    name: "Laundry Manager",
    industry: "Laundry & garment care",
    subtitle: "Complete Laundry Management Software for Modern Laundry Businesses",
    headline: "Simplify your laundry operations with Laundry Manager",
    intro: [
      "Laundry Manager is a comprehensive laundry management software designed to help laundry businesses streamline operations, improve customer service, and maximize profitability. Whether you operate a laundry shop, dry-cleaning business, commercial laundry facility, hotel laundry service, or multiple laundry branches, it provides the tools needed to manage your entire operation efficiently from a single platform.",
      "From customer order tracking and garment processing to billing, delivery management, and reporting, Laundry Manager helps you deliver exceptional service while maintaining complete operational control.",
    ],
    tagline: "Track Orders. Improve Service. Grow Your Business.",
    groups: [
      { title: "Customer Order Management", blurb: "Effortlessly manage customer orders from drop-off to delivery.", items: ["Quick order creation", "Customer information management", "Garment tagging and tracking", "Service selection (washing, dry cleaning, ironing, stain removal, etc.)", "Special instructions management", "Order status updates"] },
      { title: "Garment Tracking System", blurb: "Track every item throughout the laundry process.", items: ["Barcode and QR code support", "Real-time garment tracking", "Missing item prevention", "Order progress monitoring", "Pickup and delivery tracking"] },
      { title: "Billing & Invoicing", blurb: "Automate billing and improve payment management.", items: ["Automated invoice generation", "Multiple payment methods", "Advance payment tracking", "Outstanding balance management", "Discount and promotional pricing", "Receipt printing and digital receipts"] },
      { title: "Laundry Workflow Management", blurb: "Manage every stage of the laundry process efficiently.", items: ["Sorting and categorization", "Washing status monitoring", "Dry cleaning management", "Ironing and finishing tracking", "Quality control checks", "Packaging and dispatch management"] },
      { title: "Pickup & Delivery Management", blurb: "Provide convenient services for your customers.", items: ["Pickup scheduling", "Delivery tracking", "Route planning", "Driver assignment", "Delivery confirmation notifications"] },
      { title: "Inventory Management", blurb: "Monitor and control operational supplies.", items: ["Detergent and chemical tracking", "Packaging material management", "Low-stock alerts", "Supplier management", "Purchase order management"] },
      { title: "Customer Relationship Management", blurb: "Build stronger customer relationships and encourage repeat business.", items: ["Customer database", "Service history tracking", "Loyalty programs", "SMS and email notifications", "Promotional campaigns", "Customer feedback management"] },
      { title: "Reporting & Analytics", blurb: "Gain valuable insights into your business performance.", items: ["Daily sales reports", "Revenue analysis", "Service performance reports", "Customer activity reports", "Outstanding payments report", "Operational efficiency tracking"] },
    ],
    benefits: [
      { title: "Faster service delivery", body: "Reduce processing delays and improve turnaround times with automated workflow management." },
      { title: "Improved order accuracy", body: "Track every garment from intake to delivery, minimizing errors and lost items." },
      { title: "Better customer experience", body: "Keep customers informed with real-time order updates and efficient service delivery." },
      { title: "Increased revenue", body: "Monitor business performance, identify profitable services, and optimize operations." },
      { title: "Enhanced operational control", body: "Manage staff, inventory, customer orders, and financial records from a single platform." },
      { title: "Multi-branch management", body: "Control multiple laundry outlets and service locations through one centralized system." },
    ],
    idealFor: ["Laundry Shops", "Dry Cleaning Businesses", "Commercial Laundry Services", "Hotel Laundry Operations", "Industrial Laundry Facilities", "Self-Service Laundromats", "Multi-Branch Laundry Chains", "Garment Care Businesses"],
    why: ["Easy-to-use interface", "Real-time garment tracking", "Automated billing and invoicing", "Pickup and delivery management", "Multi-branch support", "Comprehensive reporting and analytics", "Secure data management", "Dedicated technical support"],
    modules: [
      { title: "Front Desk Management", body: "Handle customer registrations, order intake, billing, and payment processing efficiently." },
      { title: "Laundry Processing Management", body: "Monitor garment movement through sorting, washing, drying, ironing, quality checks, and packaging." },
      { title: "Delivery Management", body: "Manage pickups, deliveries, driver assignments, and customer notifications." },
      { title: "Inventory Management", body: "Track laundry supplies, chemicals, packaging materials, and stock usage." },
      { title: "Business Intelligence & Reporting", body: "Access real-time reports and analytics to make informed business decisions." },
    ],
    closing: {
      title: "Transform your laundry business",
      body: ["Laundry Manager is more than a laundry software solution — it is a complete business management platform designed to help laundry operators improve service quality, reduce operational costs, and increase profitability.", "Whether you manage a neighborhood laundry shop or a large commercial laundry facility, Laundry Manager provides the tools needed to streamline operations, improve customer satisfaction, and grow your business."],
    },
    colors: { bg: "#FAFCFF", fg: "#041433", line: "rgba(4,20,51,.16)", edge: "rgba(4,20,51,.12)" },
    capabilities: ["operations", "billing", "inventory", "customers", "multi-branch", "reporting", "security"],
    meta: "Laundry Manager — laundry and dry-cleaning management software: order and garment tracking, billing, workflow, pickup and delivery, and reporting.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Retail Shop Management documentation: workflows, roles, architecture, SLA, security, maintenance. */
export const retailOperations = {
  workflows: [
    { title: "Sales workflow", steps: ["Login", "Scan items", "Payment", "Receipt", "Inventory update"] },
    { title: "Inventory workflow", steps: ["Order", "Receive", "Verify", "Update stock"] },
    { title: "Issue resolution", steps: ["Log issue", "Diagnose", "Resolve / escalate", "Close"] },
  ],
  architecture: ["POS Terminal", "Application Server", "Database Server"],
  architectureNote: "Connected via LAN / Wi-Fi",
  roles: [
    { role: "Admin", access: "Full access" },
    { role: "Manager", access: "Inventory & reports" },
    { role: "Cashier", access: "Sales" },
  ],
  sla: [
    { level: "Critical", response: "1 hour", resolution: "4 hours" },
    { level: "High", response: "2 hours", resolution: null },
    { level: "Medium", response: "8 hours", resolution: null },
    { level: "Low", response: "48 hours", resolution: null },
  ],
  security: ["Authentication", "Role-based access", "Daily backups"],
  maintenance: ["Weekly checks", "Monthly audits", "Updates"],
};

/**
 * Each product has its own website. For now it is served from this project at /sites/<slug>; once a sub-domain is live,
 * set the matching env var (e.g. NEXT_PUBLIC_HOTEL_MANAGER_URL=https://hotel.example.com) and every button points there instead.
 * `domain` is the name shown on the button ("Visit hotelmanager.com").
 */
export const siteDomains: Record<ProductSlug, string> = {
  "hotel-manager": "hotelmanager.com",
  "restaurant-manager": "restaurantmanager.com",
  "shop-manager": "shopmanager.com",
  "laundry-manager": "laundrymanager.com",
};
const siteUrls: Record<ProductSlug, string> = {
  "hotel-manager": process.env.NEXT_PUBLIC_HOTEL_MANAGER_URL || "",
  "restaurant-manager": process.env.NEXT_PUBLIC_RESTAURANT_MANAGER_URL || "",
  "shop-manager": process.env.NEXT_PUBLIC_SHOP_MANAGER_URL || "",
  "laundry-manager": process.env.NEXT_PUBLIC_LAUNDRY_MANAGER_URL || "",
};

/** Link + label for a product's main call-to-action: "Visit <product>.com", always opening in a new tab. */
export function productCta(p: Product): { href: string; label: string; newTab: true } {
  const url = siteUrls[p.slug].trim();
  if (/^https?:\/\//i.test(url)) return { href: url, label: `Visit ${siteDomains[p.slug]}`, newTab: true };
  return { href: `/sites/${p.slug}`, label: `Visit ${siteDomains[p.slug]}`, newTab: true };
}
