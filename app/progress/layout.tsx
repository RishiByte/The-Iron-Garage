import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Progress Tracker",
  description: "Track weight, workout completion, PRs, and body measurements with responsive fitness charts.",
};

export default function ProgressLayout({ children }: { children: ReactNode }) {
  return children;
}
