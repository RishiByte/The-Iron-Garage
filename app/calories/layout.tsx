import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Calorie Calculator",
  description: "Estimate maintenance, fat loss, and muscle gain calories from activity, body stats, and goals.",
};

export default function CaloriesLayout({ children }: { children: ReactNode }) {
  return children;
}
