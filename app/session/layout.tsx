import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Workout Session",
  description: "Start a workout, track sets, use rest timers, and save completed training sessions.",
};

export default function SessionLayout({ children }: { children: ReactNode }) {
  return children;
}
