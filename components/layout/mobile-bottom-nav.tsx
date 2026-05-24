"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Calculator, Dumbbell, Home, Library, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/generator", label: "Plan", icon: Sparkles },
  { href: "/session", label: "Train", icon: Dumbbell },
  { href: "/exercises", label: "Library", icon: Library },
  { href: "/progress", label: "Progress", icon: Activity },
  { href: "/calories", label: "Calc", icon: Calculator },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/92 px-2 py-2 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-6 gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-[11px] font-semibold text-muted-foreground",
                active && "bg-primary text-primary-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
