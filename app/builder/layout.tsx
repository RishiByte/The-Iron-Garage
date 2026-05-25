import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Workout Builder",
  description: "Build and save custom workout routines with exercises, sets, reps, and rest times.",
};

export default function BuilderLayout({ children }: { children: ReactNode }) {
  return children;
}
