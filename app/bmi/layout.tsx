import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "BMI Calculator",
  description: "Calculate BMI, view your category, estimate healthy weight range, and get fitness suggestions.",
};

export default function BmiLayout({ children }: { children: ReactNode }) {
  return children;
}
