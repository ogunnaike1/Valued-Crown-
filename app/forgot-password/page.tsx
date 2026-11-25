import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };

export default function Page() {
  return <Suspense fallback={null}><ForgotForm /></Suspense>;
}
