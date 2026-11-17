import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Valued Crown Technologies collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      label="Legal"
      title="Privacy"
      accent="Policy"
      intro="Your privacy matters to us. This policy explains what information Valued Crown Technologies collects, why we collect it, and how we protect it."
      updated="17 November 2026"
      sections={[
        { title: "Who we are", body: ["Valued Crown Technologies (“we”, “us”, “our”) develops business management software for retail, restaurant, hotel and laundry operations. This policy applies to this website and to enquiries you make to us."] },
        { title: "Information we collect", body: ["We only collect information you choose to give us or that is generated when you use the website:"], list: ["Contact details such as your name, company, email address and phone number when you use our contact form or request a demo.", "Your email address when you subscribe to our newsletter.", "The content of messages you send us, including the product you are interested in.", "Basic technical data such as browser type, device, pages visited and approximate location, collected through standard server logs and analytics."] },
        { title: "How we use your information", body: ["We use your information to:"], list: ["Respond to your enquiries and provide demos, quotes and support.", "Send newsletters and product updates you have asked for.", "Improve our website, products and services.", "Keep our website secure and prevent abuse.", "Meet our legal and regulatory obligations."] },
        { title: "Legal basis", body: ["We process personal data in line with the Nigeria Data Protection Act 2023 and other applicable law. Our legal bases are your consent (for example newsletters), our legitimate interest in responding to enquiries and running our business, and compliance with legal obligations."] },
        { title: "Sharing your information", body: ["We do not sell your personal data. We may share it with trusted service providers that help us run the website, send email and handle enquiries, and only as needed for those purposes. We may also disclose information if required by law or to protect our rights."] },
        { title: "Cookies and analytics", body: ["The website may use cookies and similar technologies to keep it working properly and to understand how visitors use it. You can control or delete cookies through your browser settings; some features may not work correctly if you block them."] },
        { title: "Data retention and security", body: ["We keep personal data only as long as needed for the purposes above or as the law requires. We use reasonable technical and organisational measures to protect your data, but no method of transmission over the internet is completely secure."] },
        { title: "Your rights", body: ["You have the right to:"], list: ["Access the personal data we hold about you.", "Ask us to correct or delete it.", "Object to or restrict certain processing.", "Withdraw consent at any time, including unsubscribing from our newsletter.", "Lodge a complaint with the Nigeria Data Protection Commission."] },
        { title: "Third-party links", body: ["Our website may link to third-party sites such as social media. We are not responsible for their privacy practices and encourage you to read their policies."] },
        { title: "Changes to this policy", body: ["We may update this policy from time to time. The “last updated” date above shows when it last changed, and significant changes will be highlighted on this page."] },
      ]}
    />
  );
}
