"use client";

import { motion } from "framer-motion";
import { Activity, HeartPulse, Info, Ruler, Scale, Sparkles, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UnitInput } from "@/components/ui/unit-input";
import { cn } from "@/lib/utils";

type BmiCategory = {
  label: string;
  range: string;
  tone: string;
  marker: number;
  suggestions: string[];
};

const categories: BmiCategory[] = [
  {
    label: "Underweight",
    range: "Below 18.5",
    tone: "bg-chart-4 text-white",
    marker: 18.5,
    suggestions: [
      "Prioritize nutrient-dense meals with enough protein and carbohydrates.",
      "Use progressive strength training to build lean mass steadily.",
      "Track energy, sleep, and appetite alongside body weight.",
    ],
  },
  {
    label: "Healthy range",
    range: "18.5 - 24.9",
    tone: "bg-secondary text-secondary-foreground",
    marker: 24.9,
    suggestions: [
      "Maintain consistent training and keep protein intake high.",
      "Use waist measurements and gym performance for better context.",
      "Adjust calories gradually if your goal shifts to gain or cut.",
    ],
  },
  {
    label: "Overweight",
    range: "25 - 29.9",
    tone: "bg-primary text-primary-foreground",
    marker: 29.9,
    suggestions: [
      "Create a modest calorie deficit instead of aggressive dieting.",
      "Combine lifting with daily steps or low-impact conditioning.",
      "Monitor waist trend and workout recovery, not BMI alone.",
    ],
  },
  {
    label: "Obesity range",
    range: "30 and above",
    tone: "bg-accent text-accent-foreground",
    marker: 40,
    suggestions: [
      "Start with repeatable movement habits and sustainable food structure.",
      "Use low-impact cardio and progressive resistance training.",
      "Consider speaking with a qualified health professional for guidance.",
    ],
  },
];

export default function BmiPage() {
  const [heightInput, setHeightInput] = useState("178");
  const [weightInput, setWeightInput] = useState("78");
  const height = parseMetric(heightInput, 178);
  const weight = parseMetric(weightInput, 78);

  const bmi = useMemo(() => {
    if (height <= 0 || weight <= 0) return 0;
    return weight / Math.pow(height / 100, 2);
  }, [height, weight]);

  const category = getBmiCategory(bmi);
  const healthyWeightMin = 18.5 * Math.pow(height / 100, 2);
  const healthyWeightMax = 24.9 * Math.pow(height / 100, 2);
  const progress = Math.min(100, Math.max(0, (bmi / 40) * 100));

  return (
    <>
      <PageHero eyebrow="BMI Calculator" title="Calculate BMI and understand the range.">
        Enter height and weight to estimate body mass index, view your category, and get useful fitness-focused
        suggestions.
      </PageHero>

      <section className="page-shell grid gap-6 py-8 lg:grid-cols-[390px_1fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Card className="glass-panel bg-card/80">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Your stats</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">Use centimeters and kilograms.</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5">
              <label className="grid gap-2 text-sm font-medium">
                Height (cm)
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <UnitInput
                    className="pl-9"
                    type="number"
                    unit="cm"
                    min={80}
                    max={240}
                    value={heightInput}
                    onChange={(event) => setHeightInput(event.target.value)}
                  />
                </div>
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Weight (kg)
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <UnitInput
                    className="pl-9"
                    type="number"
                    unit="kg"
                    min={20}
                    max={250}
                    value={weightInput}
                    onChange={(event) => setWeightInput(event.target.value)}
                  />
                </div>
              </label>

              <div className="rounded-lg border bg-background/70 p-4">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Target className="h-4 w-4 text-primary" />
                  Healthy weight estimate
                </div>
                <p className="mt-2 text-2xl font-black">
                  {healthyWeightMin.toFixed(1)} - {healthyWeightMax.toFixed(1)} kg
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Based on BMI 18.5 to 24.9 for your height.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="relative overflow-hidden rounded-lg border bg-foreground p-6 text-background shadow-glow dark:bg-white dark:text-slate-950 sm:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(245,158,11,.45),transparent_30%),radial-gradient(circle_at_85%_35%,rgba(20,184,166,.32),transparent_30%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_260px] lg:items-center">
              <div>
                <Badge className="mb-4 border-background/20 bg-background/10 text-background dark:text-slate-950">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Live BMI result
                </Badge>
                <p className="text-sm font-bold uppercase tracking-[0.18em] opacity-70">Your BMI</p>
                <motion.p
                  key={bmi.toFixed(1)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-7xl font-black tracking-normal"
                >
                  {bmi ? bmi.toFixed(1) : "0.0"}
                </motion.p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className={cn("rounded-md px-3 py-2 text-sm font-black", category.tone)}>{category.label}</span>
                  <span className="text-sm opacity-75">{category.range}</span>
                </div>
              </div>

              <div className="rounded-lg bg-background/10 p-4">
                <div className="relative h-56 rounded-full border border-background/20 p-4">
                  <div className="flex h-full w-full items-center justify-center rounded-full border border-background/20">
                    <HeartPulse className="h-16 w-16 text-primary" />
                  </div>
                  <div
                    className="absolute left-1/2 top-1/2 h-1 w-[46%] origin-left rounded-full bg-primary"
                    style={{ transform: `rotate(${progress * 1.8 - 90}deg)` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-4">
            {categories.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "rounded-lg border p-4",
                  item.label === category.label ? "border-primary bg-primary/10" : "bg-card",
                )}
              >
                <p className="font-black">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.range}</p>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary/15 text-secondary">
                  <Info className="h-5 w-5" />
                </div>
                <CardTitle>Health suggestions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {category.suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-lg border bg-muted/35 p-4 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-black text-primary-foreground">
                    {index + 1}
                  </span>
                  {suggestion}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return categories[0];
  if (bmi < 25) return categories[1];
  if (bmi < 30) return categories[2];
  return categories[3];
}

function parseMetric(value: string, fallback: number) {
  const parsed = Number(value);
  if (value.trim() === "" || Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
}
