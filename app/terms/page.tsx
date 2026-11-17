import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use the Valued Crown Technologies website and services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      label="Legal"
      title="Terms of"
      accent="Service"
      intro="Please read these terms carefully. By using our website or services you agree to be bound by them."
      updated="17 November 2026"
      sections={[
        { title: "Acceptance of terms", body: ["These terms govern your use of the Valued Crown Technologies website and any related enquiries. If you do not agree with them, please do not use the website."] },
        { title: "Our services", body: ["We provide business management software, including Hotel Manager, Restaurant Manager, Shop Manager and Laundry Manager, together with consultation, deployment, training and support. Software supplied to a customer is governed by the written proposal, order or licence agreement for that engagement, which prevails over these terms if they conflict."] },
        { title: "Use of the website", body: ["You agree to use the website lawfully and not to:"], list: ["Attempt to gain unauthorised access to our systems or data.", "Introduce viruses, malware or other harmful code.", "Scrape, copy or resell our content without permission.", "Submit false, misleading or abusive information through our forms."] },
        { title: "Intellectual property", body: ["All content on this website, including text, graphics, logos, product names and software, belongs to Valued Crown Technologies or its licensors and is protected by intellectual property law. You may view and share pages for personal, non-commercial purposes, but you may not modify or exploit our content without written permission."] },
        { title: "Quotes, pricing and demos", body: ["Information on this website is for general guidance. Features, availability and pricing may change and do not constitute a binding offer until confirmed in a written agreement with us."] },
        { title: "Disclaimer", body: ["The website is provided “as is” and “as available”. We work to keep information accurate and the site running, but we do not guarantee that it will be uninterrupted, error-free or fully up to date."] },
        { title: "Limitation of liability", body: ["To the fullest extent permitted by law, Valued Crown Technologies is not liable for any indirect, incidental or consequential loss arising from your use of, or inability to use, the website. Nothing in these terms limits liability that cannot be limited by law."] },
        { title: "Third-party links", body: ["The website may contain links to third-party sites. We do not control or endorse them and are not responsible for their content or practices."] },
        { title: "Privacy", body: ["How we handle your personal data is described in our Privacy Policy, which forms part of these terms."] },
        { title: "Governing law", body: ["These terms are governed by the laws of the Federal Republic of Nigeria, and any dispute will be subject to the jurisdiction of the Nigerian courts."] },
        { title: "Changes to these terms", body: ["We may update these terms from time to time. Continued use of the website after changes are posted means you accept the updated terms."] },
      ]}
    />
  );
}
