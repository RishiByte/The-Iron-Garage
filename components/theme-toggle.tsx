"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";
  const toggleLabel = mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle color theme";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      type="button"
      aria-label={toggleLabel}
      title={toggleLabel}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-10 w-[72px] items-center rounded-full border p-1 shadow-sm transition-all duration-300",
        "bg-muted/70 hover:border-primary/60 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <span className="absolute left-3 text-muted-foreground">
        <Sun className="h-4 w-4" />
      </span>
      <span className="absolute right-3 text-muted-foreground">
        <Moon className="h-4 w-4" />
      </span>
      {mounted ? (
        <motion.span
          layout
          initial={false}
          animate={{ x: isDark ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </motion.span>
      ) : (
        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow" />
      )}
    </button>
  );
}
