/**
 * Demo content for every back-office list page that doesn't have its own bespoke screen.
 * Each page is a small spec (columns + value pools); `pageRows` turns it into deterministic rows.
 * Swap `pageRows` for an API call when the backend exists; the UI only consumes `PageRow`.
 */
import { BRANCHES, type WorkspaceSlug } from "./config";
import { rng } from "./seed";

export type Kind = "id" | "name" | "person" | "date" | "future" | "money" | "int" | "status" | "choice" | "branch" | "email" | "seq";
export interface Col { k: string; h: string; kind: Kind; opts?: string[]; prefix?: string; min?: number; max?: number; unit?: string }
export interface PageSpec { title: string; singular: string; cols: Col[]; count?: number; derive?: (r: PageRow, rnd: () => number) => void }
export type PageRow = { _id: string; branchId?: string } & Record<string, string | number>;

const PEOPLE = ["Adaeze Okonkwo", "Tunde Bakare", "Chidi Nwosu", "Fatima Sani", "Emeka Anyanwu", "Ngozi Eze", "Ibrahim Musa", "Funke Adebayo", "Kelechi Obi", "Zainab Yusuf", "Segun Ajayi", "Amaka Uche", "Bola Ogunleye", "Yetunde Alade", "Obinna Okeke", "Halima Abubakar"];
const SUPPLIERS = ["Lagos Wholesale Ltd", "Zenith Supplies", "Alaba Distributors", "Prime Traders", "Ikeja Cash & Carry", "Dangote Distribution", "Mama Put Farms"];
const BR = BRANCHES.map((b) => b.name.replace(" Branch", ""));
const ROOMS = ["101", "102", "104", "108", "112", "204", "207", "210", "305", "307", "401", "410"];

const c = (k: string, h: string, kind: Kind, extra: Partial<Col> = {}): Col => ({ k, h, kind, ...extra });
const status = (opts: string[], h = "Status") => c("status", h, "status", { opts });

const SHOP_PRODUCTS = ["Peak Milk 400g", "Golden Penny Rice 5kg", "Indomie carton", "Dangote Sugar 1kg", "Titus Sardine", "Kings Oil 2L", "Dettol 500ml", "Omo detergent 1kg", "Coca-Cola 50cl", "Eva water 75cl", "Milo 400g", "Pears soap", "Vaseline 250ml", "Closeup toothpaste"];
const MENU = ["Jollof Rice & Chicken", "Egusi & Pounded Yam", "Pepper Soup (Goat)", "Grilled Tilapia", "Suya Platter", "Fried Rice & Turkey", "Moi Moi", "Ofada Rice & Ayamase", "Chapman", "Zobo", "Chicken Shawarma", "Peppered Snail", "Puff Puff"];
const GARMENTS = ["Agbada (3 pc)", "Two-piece suit", "Duvet (king)", "Wedding gown", "Shirt", "Trousers", "Ankara dress", "Curtains (pair)", "Bedsheet set", "Kaftan"];
const INV: Record<WorkspaceSlug, string[]> = {
  "hotel-manager": ["Bath towels", "Bed sheets (king)", "Pillow cases", "Shampoo sachets", "Bath soap bars", "Floor cleaner", "Slippers", "Bottled water 50cl", "Toothbrush kits", "Tea & coffee sachets"],
  "restaurant-manager": ["Palm oil", "Fresh tilapia", "Basmati rice", "Tomatoes", "Scotch bonnet pepper", "Chicken (whole)", "Plantain", "Vegetable oil", "Flour", "Chapman mix"],
  "shop-manager": SHOP_PRODUCTS,
  "laundry-manager": ["Detergent", "Fabric softener", "Stain remover", "Garment covers", "Hangers", "Laundry bags", "Tags & labels", "Spray starch", "Bleach"],
};
const INV_CATS: Record<WorkspaceSlug, string[]> = {
  "hotel-manager": ["Housekeeping", "Amenities", "Cleaning", "Minibar"], "restaurant-manager": ["Produce", "Dry goods", "Oils & sauces", "Beverages"],
  "shop-manager": ["Groceries", "Household", "Beverages", "Personal care"], "laundry-manager": ["Chemicals", "Packaging", "Consumables"],
};

const stockStatus = (r: PageRow) => { r.status = r.onHand === 0 ? "Out of stock" : (r.onHand as number) <= (r.reorder as number) ? "Low stock" : "In stock"; };

export function pageSpec(slug: WorkspaceSlug, path: string): PageSpec {
  switch (path) {
    case "billing":
      return slug === "hotel-manager"
        ? { title: "Billing & folios", singular: "folio", cols: [c("ref", "Folio", "id", { prefix: "FOL" }), c("guest", "Guest", "person"), c("branch", "Branch", "branch"), c("date", "Date", "date"), c("method", "Payment", "choice", { opts: ["Cash", "Card", "Transfer", "POS"] }), c("amount", "Amount", "money", { min: 25000, max: 900000 }), status(["Open", "Paid", "Partially paid", "Overdue"])] }
        : { title: "Billing & invoices", singular: "invoice", cols: [c("ref", "Invoice", "id", { prefix: "INV" }), c("customer", "Customer", "person"), c("branch", "Branch", "branch"), c("date", "Date", "date"), c("method", "Payment", "choice", { opts: ["Cash", "Card", "Transfer", "POS"] }), c("amount", "Amount", "money", { min: 3000, max: 90000 }), status(["Paid", "Unpaid", "Partially paid", "Overdue"])] };
    case "branches":
      return { title: "Branches", singular: "branch", count: 3, cols: [c("name", "Branch", "seq", { opts: BRANCHES.map((b) => b.name) }), c("city", "City", "seq", { opts: BRANCHES.map((b) => b.city) }), c("manager", "Manager", "person"), c("staff", "Staff", "int", { min: 8, max: 42 }), c("opened", "Opened", "date"), status(["Active", "Active", "Setting up"])] };
    case "users":
      return { title: "Users & roles", singular: "user", count: 14, cols: [c("name", "Name", "person"), c("email", "Email", "email"), c("role", "Role", "choice", { opts: ["Administrator", "Manager", "Cashier", "Supervisor", "Accountant"] }), c("branch", "Branch", "branch"), c("last", "Last active", "date"), status(["Active", "Active", "Active", "Invited", "Suspended"])] };
    case "deliveries":
      return { title: "Pickup & delivery", singular: "job", cols: [c("ref", "Job", "id", { prefix: "DLV" }), c("customer", "Customer", "person"), c("type", "Type", "choice", { opts: ["Pickup", "Delivery"] }), c("zone", "Zone", "choice", { opts: ["Lekki", "Ikeja", "Victoria Island", "Yaba", "Surulere", "Ajah"] }), c("driver", "Driver", "person"), c("date", "Scheduled", "future"), c("fee", "Fee", "money", { min: 1000, max: 5000 }), status(["Scheduled", "Out for delivery", "Delivered", "Failed"])] };
    case "events":
      return { title: "Conference & events", singular: "event", cols: [c("ref", "Booking", "id", { prefix: "EVT" }), c("name", "Event", "name", { opts: ["Corporate retreat", "Wedding reception", "Product launch", "Board meeting", "Birthday party", "Training seminar", "Church anniversary"] }), c("client", "Client", "person"), c("date", "Date", "future"), c("guests", "Guests", "int", { min: 20, max: 300 }), c("amount", "Value", "money", { min: 150000, max: 4000000 }), status(["Enquiry", "Confirmed", "Completed", "Cancelled"])] };
    case "expenses":
      return { title: "Expenses", singular: "expense", cols: [c("ref", "Ref", "id", { prefix: "EXP" }), c("name", "Description", "name", { opts: ["Generator diesel", "Staff transport", "Shop rent", "Electricity (NEPA)", "Cleaning supplies", "Packaging", "Internet subscription", "Security"] }), c("category", "Category", "choice", { opts: ["Utilities", "Rent", "Transport", "Supplies", "Salaries"] }), c("branch", "Branch", "branch"), c("date", "Date", "date"), c("amount", "Amount", "money", { min: 5000, max: 400000 }), status(["Approved", "Pending", "Rejected"])] };
    case "front-desk":
      return { title: "Front desk", singular: "request", cols: [c("ref", "Ref", "id", { prefix: "FD" }), c("guest", "Guest", "person"), c("room", "Room", "choice", { opts: ROOMS }), c("type", "Request", "choice", { opts: ["Check-in", "Check-out", "Walk-in", "Room change", "Late checkout"] }), c("date", "Time", "date"), c("by", "Handled by", "person"), status(["Pending", "In progress", "Done"])] };
    case "garments":
      return { title: "Garment tracking", singular: "garment", cols: [c("ref", "Tag", "id", { prefix: "GRM" }), c("name", "Garment", "name", { opts: GARMENTS }), c("customer", "Customer", "person"), c("service", "Service", "choice", { opts: ["Wash & fold", "Dry clean", "Iron only", "Express"] }), c("date", "Received", "date"), c("due", "Due", "future"), status(["Received", "Washing", "Ironing", "Ready", "Delivered"], "Stage")] };
    case "housekeeping":
      return { title: "Housekeeping", singular: "task", cols: [c("room", "Room", "choice", { opts: ROOMS }), c("type", "Task", "choice", { opts: ["Checkout clean", "Stay-over", "Deep clean", "Turn-down"] }), c("attendant", "Attendant", "person"), c("date", "Assigned", "date"), c("mins", "Est. time (min)", "int", { min: 15, max: 60 }), status(["Dirty", "In progress", "Clean", "Inspected", "Out of order"])] };
    case "inventory":
      return { title: slug === "hotel-manager" ? "Inventory & procurement" : slug === "laundry-manager" ? "Supplies inventory" : slug === "shop-manager" ? "Inventory control" : "Inventory", singular: "item", cols: [c("name", "Item", "name", { opts: INV[slug] }), c("sku", "SKU", "id", { prefix: "SKU" }), c("category", "Category", "choice", { opts: INV_CATS[slug] }), c("branch", "Branch", "branch"), c("onHand", "On hand", "int", { min: 0, max: 220 }), c("reorder", "Reorder at", "int", { min: 8, max: 50 }), c("cost", "Unit cost", "money", { min: 300, max: 45000 }), status(["In stock", "Low stock", "Out of stock"])], derive: stockStatus };
    case "kitchen":
      return { title: "Kitchen display", singular: "ticket", cols: [c("ref", "Ticket", "id", { prefix: "KOT" }), c("table", "Table", "choice", { opts: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "Takeaway", "Delivery"] }), c("name", "Main item", "name", { opts: MENU.slice(0, 8) }), c("items", "Items", "int", { min: 1, max: 8 }), c("date", "Placed", "date"), c("prep", "Prep (min)", "int", { min: 5, max: 35 }), status(["New", "Preparing", "Ready", "Served"])] };
    case "loyalty":
      return { title: slug === "hotel-manager" ? "Feedback & loyalty" : slug === "laundry-manager" ? "Loyalty & notifications" : "Loyalty & promotions", singular: "member", cols: [c("name", "Member", "person"), c("tier", "Tier", "choice", { opts: ["Standard", "Silver", "Gold"] }), c("points", "Points", "int", { min: 0, max: 9800 }), c("visits", "Visits", "int", { min: 1, max: 60 }), c("last", "Last visit", "date"), c("rating", "Avg rating", "choice", { opts: ["5.0", "4.8", "4.5", "4.2", "4.0", "3.5"] }), status(["Active", "Active", "Inactive"])] };
    case "menu":
      return { title: "Menu", singular: "dish", count: 13, cols: [c("name", "Item", "seq", { opts: MENU }), c("category", "Category", "choice", { opts: ["Mains", "Soups", "Grill", "Sides", "Drinks", "Small chops"] }), c("price", "Price", "money", { min: 800, max: 12000 }), c("prep", "Prep (min)", "int", { min: 5, max: 40 }), c("sold", "Sold (7d)", "int", { min: 4, max: 260 }), status(["Available", "Available", "Available", "Sold out", "Hidden"])] };
    case "products":
      return { title: "Products", singular: "product", count: 28, cols: [c("name", "Product", "name", { opts: SHOP_PRODUCTS }), c("sku", "SKU", "id", { prefix: "SKU" }), c("category", "Category", "choice", { opts: INV_CATS["shop-manager"] }), c("price", "Price", "money", { min: 300, max: 38000 }), c("stock", "In stock", "int", { min: 0, max: 400 }), status(["Active", "Active", "Active", "Draft", "Archived"])] };
    case "purchasing":
      return { title: "Purchasing & suppliers", singular: "purchase order", cols: [c("ref", "PO", "id", { prefix: "PO" }), c("supplier", "Supplier", "choice", { opts: SUPPLIERS }), c("branch", "Branch", "branch"), c("date", "Ordered", "date"), c("items", "Lines", "int", { min: 1, max: 18 }), c("amount", "Total", "money", { min: 25000, max: 3200000 }), status(["Draft", "Ordered", "Received", "Cancelled"])] };
    case "restaurant-bar":
      return { title: "Restaurant & bar", singular: "order", cols: [c("ref", "Order", "id", { prefix: "RB" }), c("outlet", "Outlet", "choice", { opts: ["Restaurant", "Bar", "Room service", "Poolside"] }), c("guest", "Guest", "person"), c("room", "Room", "choice", { opts: ROOMS.concat(["Walk-in"]) }), c("date", "Time", "date"), c("amount", "Amount", "money", { min: 3500, max: 180000 }), status(["Preparing", "Served", "Paid", "Voided"])] };
    case "returns":
      return { title: "Returns & refunds", singular: "return", cols: [c("ref", "Return", "id", { prefix: "RET" }), c("name", "Item", "name", { opts: SHOP_PRODUCTS }), c("customer", "Customer", "person"), c("reason", "Reason", "choice", { opts: ["Damaged", "Wrong item", "Expired", "Changed mind"] }), c("date", "Date", "date"), c("amount", "Refund", "money", { min: 500, max: 60000 }), status(["Pending", "Refunded", "Rejected"])] };
    case "staff":
      return { title: "Staff & shifts", singular: "staff member", count: 18, cols: [c("name", "Staff", "person"), c("role", "Role", "choice", { opts: ["Manager", "Cashier", "Waiter", "Chef", "Cleaner", "Driver", "Supervisor"] }), c("branch", "Branch", "branch"), c("shift", "Shift", "choice", { opts: ["Morning (7–3)", "Afternoon (3–11)", "Night (11–7)"] }), c("hours", "Hours (week)", "int", { min: 8, max: 56 }), status(["On duty", "On duty", "Off duty", "On leave"])] };
    case "tables":
      return { title: "Tables & reservations", singular: "table", count: 16, cols: [c("name", "Table", "seq", { opts: Array.from({ length: 16 }, (_, i) => `Table ${i + 1}`) }), c("zone", "Zone", "choice", { opts: ["Indoor", "Patio", "VIP", "Bar"] }), c("seats", "Seats", "choice", { opts: ["2", "4", "4", "6", "8"] }), c("guest", "Guest / party", "person"), c("date", "Time", "future"), status(["Available", "Occupied", "Reserved", "Cleaning"])] };
    case "transfers":
      return { title: "Stock transfers", singular: "transfer", cols: [c("ref", "Transfer", "id", { prefix: "TRF" }), c("name", "Item", "name", { opts: SHOP_PRODUCTS }), c("from", "From", "choice", { opts: BR }), c("to", "To", "choice", { opts: BR }), c("qty", "Qty", "int", { min: 6, max: 240 }), c("date", "Date", "date"), status(["Requested", "In transit", "Received", "Cancelled"])], derive: (r) => { if (r.from === r.to) r.to = BR[(BR.indexOf(String(r.from)) + 1) % BR.length]; } };
    case "workflow":
      return { title: "Workflow", singular: "batch", cols: [c("ref", "Batch", "id", { prefix: "BAT" }), c("machine", "Machine", "choice", { opts: ["Washer 1", "Washer 2", "Washer 3", "Dryer 1", "Dryer 2", "Press line"] }), c("pieces", "Pieces", "int", { min: 6, max: 90 }), c("operator", "Operator", "person"), c("date", "Started", "date"), status(["Queued", "Washing", "Drying", "Ironing", "Packed"])] };
    default:
      return { title: path.replace(/-/g, " ").replace(/^./, (x) => x.toUpperCase()), singular: "record", cols: [c("ref", "Ref", "id", { prefix: "REC" }), c("name", "Name", "person"), c("date", "Date", "date"), status(["Active", "Pending", "Closed"])] };
  }
}

const pick = <T,>(a: T[], r: () => number) => a[Math.floor(r() * a.length)];

export function pageRows(slug: WorkspaceSlug, path: string): PageRow[] {
  const spec = pageSpec(slug, path);
  const r = rng(`${slug}:page:${path}`);
  const n = spec.count ?? 48;
  const now = Date.now();
  return Array.from({ length: n }, (_, i) => {
    const row: PageRow = { _id: `${path}-${i}` };
    let person = "";
    for (const col of spec.cols) {
      switch (col.kind) {
        case "id": row[col.k] = `${col.prefix ?? "ID"}-${String(1000 + n - i + Math.floor(r() * 3)).padStart(4, "0")}`; break;
        case "person": person = pick(PEOPLE, r); row[col.k] = person; break;
        case "name": case "choice": row[col.k] = pick(col.opts ?? ["—"], r); break;
        case "seq": row[col.k] = col.opts![i % col.opts!.length]; break;
        case "status": row[col.k] = pick(col.opts!, r); break;
        case "branch": { const b = pick(BRANCHES, r); row[col.k] = b.name.replace(" Branch", ""); row.branchId = b.id; break; }
        case "date": row[col.k] = new Date(now - (i * 0.6 + r() * 2) * 86_400_000 * (n > 20 ? 0.6 : 3)).toISOString(); break;
        case "future": row[col.k] = new Date(now + (1 + r() * 20) * 86_400_000).toISOString(); break;
        case "money": row[col.k] = Math.round((col.min! + r() * (col.max! - col.min!)) / 100) * 100; break;
        case "int": row[col.k] = Math.round(col.min! + r() * (col.max! - col.min!)); break;
        case "email": row[col.k] = (person || "user").toLowerCase().replace(/[^a-z]+/g, ".") + "@valuedcrown.ng"; break;
      }
    }
    spec.derive?.(row, r);
    return row;
  });
}
