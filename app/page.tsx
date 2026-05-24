"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Calculator,
  ChevronRight,
  Dumbbell,
  Flame,
  HeartPulse,
  Library,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from "@/lib/storage";
import type { CompletedWorkoutSession } from "@/lib/session";
import type { WeeklyWorkoutPlan } from "@/lib/workout";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

const features = [
  {
    href: "/generator",
    title: "AI-style workout generation",
    icon: Sparkles,
    text: "Generate practical training sessions by split, goal, and time without needing an account.",
  },
  {
    href: "/exercises",
    title: "Exercise library",
    icon: Library,
    text: "Browse gym movements with clean cues for muscle targeting, setup, and execution.",
  },
  {
    href: "/progress",
    title: "Progress analytics",
    icon: BarChart3,
    text: "Track body weight, lifting numbers, and workout minutes with responsive Recharts visuals.",
  },
  {
    href: "/calories",
    title: "Fitness calculators",
    icon: Calculator,
    text: "Estimate BMI, calories, maintenance intake, and protein targets before your next block.",
  },
];

const categories = [
  { title: "Push Strength", detail: "Chest, shoulders, triceps", icon: Dumbbell, tone: "bg-primary/15 text-primary" },
  { title: "Pull Hypertrophy", detail: "Back, biceps, rear delts", icon: Zap, tone: "bg-secondary/15 text-secondary" },
  { title: "Leg Day", detail: "Squats, presses, hinges", icon: Flame, tone: "bg-accent/15 text-accent" },
  { title: "Full Body", detail: "Efficient total-body sessions", icon: HeartPulse, tone: "bg-chart-4/15 text-chart-4" },
];

const testimonials = [
  {
    name: "Arjun M.",
    role: "Natural lifter",
    quote: "THE IRON GARAGE feels like the gym notebook I always wanted: fast, clean, and focused on the next session.",
  },
  {
    name: "Dev P.",
    role: "Busy professional",
    quote: "I can build a workout in under a minute and still have enough structure to train hard.",
  },
  {
    name: "Kabir S.",
    role: "Strength beginner",
    quote: "The cues and progress charts make it easier to stay consistent without overthinking everything.",
  },
];

const stats = [
  { value: "7", label: "core pages" },
  { value: "0", label: "login walls" },
  { value: "40+", label: "saved sessions" },
  { value: "100%", label: "browser storage" },
];

const faqs = [
  {
    question: "Does THE IRON GARAGE need an account?",
    answer: "No. The app is built without authentication, payments, or a backend database.",
  },
  {
    question: "Where is my progress saved?",
    answer: "Generated workouts and tracker entries are persisted in localStorage on your current browser.",
  },
  {
    question: "Is it mobile friendly?",
    answer: "Yes. The layout is mobile-first and scales up for tablets and desktop screens.",
  },
  {
    question: "Can I use it in dark mode?",
    answer: "Yes. THE IRON GARAGE supports light, dark, and system theme preferences.",
  },
];

export default function LandingPage() {
  const [plans] = useLocalStorage<WeeklyWorkoutPlan[]>("fitforge-ai-plans", []);
  const [favorites] = useLocalStorage<string[]>("fitforge-favorite-exercises", []);
  const [sessions] = useLocalStorage<CompletedWorkoutSession[]>("iron-garage-completed-sessions", []);
  const [weights] = useLocalStorage<Array<{ id: string; date: string; weight: number }>>("fitforge-weight-tracker", []);
  const latestWeight = useMemo(() => [...weights].sort((a, b) => a.date.localeCompare(b.date)).at(-1)?.weight, [weights]);

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <DashboardSnapshot plans={plans.length} favorites={favorites.length} sessions={sessions.length} latestWeight={latestWeight} />
      <FeaturesSection />
      <CategoriesSection />
      <TestimonialsSection />
      <StatsSection />
      <FaqSection />
      <LandingFooter />
    </div>
  );
}

function DashboardSnapshot({
  plans,
  favorites,
  sessions,
  latestWeight,
}: {
  plans: number;
  favorites: number;
  sessions: number;
  latestWeight?: number;
}) {
  return (
    <section className="page-shell -mt-8 relative z-10 grid gap-4 pb-12 sm:grid-cols-2 xl:grid-cols-4">
      <SnapshotCard title="Saved Plans" value={plans.toString()} href="/generator" />
      <SnapshotCard title="Completed Sessions" value={sessions.toString()} href="/session" />
      <SnapshotCard title="Favorite Exercises" value={favorites.toString()} href="/exercises" />
      <SnapshotCard title="Latest Weight" value={latestWeight ? `${latestWeight} kg` : "--"} href="/progress" />
    </section>
  );
}

function SnapshotCard({ title, value, href }: { title: string; value: string; href: string }) {
  return (
    <Link href={href}>
      <Card className="glass-panel bg-card/90 transition hover:-translate-y-1 hover:border-primary/50">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-black">{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[calc(100svh-4rem)] border-b">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(245,158,11,.24),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(20,184,166,.18),transparent_28%),radial-gradient(circle_at_70%_86%,rgba(244,63,94,.16),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="page-shell relative grid min-h-[calc(100svh-4rem)] items-center gap-10 py-12 lg:grid-cols-[1.02fr_.98fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <Badge className="mb-5 border-primary/30 bg-primary/10 px-3 py-1.5 text-foreground">
            <ShieldCheck className="mr-2 h-3.5 w-3.5 text-primary" />
            Premium fitness tools. Zero sign-up.
          </Badge>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
            Forge stronger workouts with THE IRON GARAGE.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A modern no-login workout command center for generating gym sessions, tracking progress, exploring
            exercises, and calculating training targets.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-glow">
              <Link href="/generator">
                Generate workout <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/exercises">
                Browse library <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm">
            {["Local data", "Dark mode", "Mobile first"].map((item) => (
              <div key={item} className="glass-panel rounded-lg px-3 py-3 text-center font-semibold">
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="glass-panel rounded-lg p-3 shadow-glow">
            <div className="rounded-lg border bg-card/95 p-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm font-bold text-primary">Today&apos;s Forge</p>
                  <h2 className="mt-1 text-2xl font-black">Push Hypertrophy</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Dumbbell className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {[
                  ["Incline Dumbbell Press", "4 x 8-12", "Chest"],
                  ["Barbell Bench Press", "4 x 8-12", "Power"],
                  ["Cable Lateral Raise", "3 x 12-15", "Delts"],
                  ["Rope Triceps Pushdown", "3 x 12-15", "Arms"],
                ].map(([name, reps, tag]) => (
                  <div key={name} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border bg-background/70 p-3">
                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="text-sm text-muted-foreground">{reps}</p>
                    </div>
                    <Badge className="h-fit">{tag}</Badge>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Metric icon={Timer} value="50m" label="duration" />
                <Metric icon={Flame} value="5" label="moves" />
                <Metric icon={TrendingUp} value="92%" label="ready" />
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="glass-panel absolute -bottom-5 left-4 hidden rounded-lg p-4 sm:block"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Workout saved</p>
                <p className="text-xs text-muted-foreground">Stored in this browser</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="page-shell py-16 sm:py-20">
      <SectionHeader eyebrow="Features" title="Everything a clean gym app needs." text="Fast planning, useful metrics, and no distractions between you and the next set." />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div key={feature.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: index * 0.06 }}>
            <Link href={feature.href}>
              <Card className="glass-panel h-full bg-card/70 transition duration-300 hover:-translate-y-1 hover:border-primary/50">
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">{feature.text}</CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="border-y bg-muted/35">
      <div className="page-shell py-16 sm:py-20">
        <SectionHeader eyebrow="Workout categories" title="Train by the split you actually use." text="Jump into focused templates for strength, hypertrophy, conditioning, or full-body sessions." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div key={category.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: index * 0.07 }}>
              <Card className="h-full overflow-hidden bg-card/80">
                <CardContent className="p-5">
                  <div className={`mb-8 flex h-12 w-12 items-center justify-center rounded-lg ${category.tone}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black">{category.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{category.detail}</p>
                  <Button asChild variant="ghost" className="mt-5 px-0">
                    <Link href="/generator">
                      Start category <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="page-shell py-16 sm:py-20">
      <SectionHeader eyebrow="Testimonials" title="Built for lifters who want momentum." text="A premium interface for everyday gym consistency." />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div key={testimonial.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: index * 0.07 }}>
            <Card className="glass-panel h-full bg-card/70">
              <CardContent className="p-5">
                <div className="mb-5 flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="leading-7 text-muted-foreground">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-6 border-t pt-4">
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="relative border-y">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,158,11,.16),transparent_38%),linear-gradient(315deg,rgba(20,184,166,.14),transparent_40%)]" />
      <div className="page-shell relative grid gap-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} {...fadeUp} transition={{ ...fadeUp.transition, delay: index * 0.05 }}>
            <div className="glass-panel rounded-lg p-6 text-center">
              <p className="text-4xl font-black text-primary">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="page-shell py-16 sm:py-20">
      <SectionHeader eyebrow="FAQ" title="Simple answers before you train." text="THE IRON GARAGE is intentionally lean: no accounts, no database, no payment flow." />
      <div className="mt-8 grid gap-3">
        {faqs.map((faq) => (
          <details key={faq.question} className="glass-panel group rounded-lg p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
              {faq.question}
              <span className="rounded-md bg-muted p-1 transition group-open:rotate-90">
                <ChevronRight className="h-4 w-4" />
              </span>
            </summary>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <section className="border-t bg-foreground text-background dark:bg-white dark:text-slate-950">
      <div className="page-shell grid gap-8 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-2xl font-black">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-5 w-5" />
            </span>
            THE IRON GARAGE
          </div>
          <p className="mt-4 max-w-xl text-background/70 dark:text-slate-700">
            Launch your next workout from a premium local-first fitness dashboard.
          </p>
          <p className="mt-2 text-sm font-semibold text-background/70 dark:text-slate-700">Built by Rishi Bhardwaj.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/generator">Start training</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/progress">Track progress</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <motion.div {...fadeUp} className="max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{text}</p>
    </motion.div>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof Timer; value: string; label: string }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <Icon className="mb-2 h-4 w-4 text-primary" />
      <p className="font-black">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
