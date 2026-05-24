import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Workout Generator",
  description: "Create personalized weekly workout plans by goal, experience, schedule, equipment, and target muscles.",
};

export default function GeneratorLayout({ children }: { children: ReactNode }) {
  return children;
}
