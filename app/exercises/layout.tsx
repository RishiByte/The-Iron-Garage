import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Exercise Library",
  description: "Search and filter gym exercises, view movement details, and save favorite exercises locally.",
};

export default function ExercisesLayout({ children }: { children: ReactNode }) {
  return children;
}
