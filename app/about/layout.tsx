import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about THE IRON GARAGE, a no-login local-first workout planning and tracking app by Rishi Bhardwaj.",
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
