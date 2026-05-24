import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ToastProvider } from "@/components/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://the-iron-garage.local"),
  title: {
    default: "THE IRON GARAGE",
    template: "%s | THE IRON GARAGE",
  },
  description: "Modern workout generation, exercise discovery, and fitness calculators by Rishi Bhardwaj.",
  applicationName: "THE IRON GARAGE",
  keywords: ["THE IRON GARAGE", "workout generator", "fitness tracker", "BMI calculator", "calorie calculator"],
  authors: [{ name: "Rishi Bhardwaj" }],
  openGraph: {
    title: "THE IRON GARAGE",
    description: "Generate workouts, track progress, and calculate fitness targets without login.",
    type: "website",
    siteName: "THE IRON GARAGE",
  },
  twitter: {
    card: "summary_large_image",
    title: "THE IRON GARAGE",
    description: "Premium local-first workout tools for focused training.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="fitforge-theme">
          <ToastProvider>
            <div className="flex min-h-screen flex-col pb-20 lg:pb-0">
              <a href="#main-content" className="skip-link">
                Skip to content
              </a>
              <SiteHeader />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                {children}
              </main>
              <SiteFooter />
              <MobileBottomNav />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
