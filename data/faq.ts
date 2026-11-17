/** FAQ answers are taken from the supplied product, About Us and retail-system documents. Nothing here is invented. */
export interface Faq { q: string; a: string }

export const faqs: Faq[] = [
  {
    q: "What kinds of business is your software for?",
    a: "We build management software for retail stores and wholesale, restaurants and food service, hotels and hospitality, and laundry and garment-care businesses, from a single shop or guest house to multi-branch chains and groups.",
  },
  {
    q: "Which product do I need?",
    a: "Retail Manager covers supermarkets, pharmacies, fashion, electronics and other shops. Restaurant Manager covers restaurants, cafés, bars and catering. Hotel Manager covers hotels, resorts, guest houses and serviced apartments. Laundry Manager covers laundry shops, dry cleaners and commercial laundries.",
  },
  {
    q: "Can I manage more than one branch?",
    a: "Yes. Every product supports multiple branches or locations from one centralised platform, with consolidated reporting and branch performance comparison.",
  },
  {
    q: "Is the software cloud-based or installed on-site?",
    a: "Retail Manager and Hotel Manager are available with both cloud and on-premise deployment options.",
  },
  {
    q: "How is my business data protected?",
    a: "Access is controlled with authentication, user permissions and role-based access (for example admin with full access, manager for inventory and reports, cashier for sales), and your data is backed up automatically every day.",
  },
  {
    q: "What support do I get?",
    a: "We support clients from consultation and development through deployment, training and ongoing technical support. For critical issues the response time is 1 hour with resolution within 4 hours, and high-priority issues get a response within 2 hours. Weekly checks, monthly audits and updates keep installations healthy.",
  },
  {
    q: "Can the software be tailored to how my business works?",
    a: "Yes. Every business is unique, so our solutions are designed to fit your specific operational requirements and business goals, and we work closely with you to understand your processes.",
  },
  {
    q: "Does the point of sale work with scanners and receipts?",
    a: "Retail Manager supports barcode scanner integration, multiple payment options, receipt printing and email receipts, discounts and promotions, and returns and refunds. Restaurant Manager adds split billing, bill merging and kitchen order tickets.",
  },
  {
    q: "Can restaurant and bar sales be added to a guest's hotel bill?",
    a: "Yes. Hotel Manager integrates restaurant and bar POS, supports room charge posting, and keeps inventory synchronised.",
  },
  {
    q: "How do you keep track of garments in a laundry?",
    a: "Laundry Manager uses garment tagging with barcode and QR code support, so every item can be tracked from intake through sorting, washing, ironing and quality control to delivery.",
  },
];
