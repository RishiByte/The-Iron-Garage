"use client";

import { motion } from "framer-motion";
import { Activity, Flame, Goal, HeartPulse, Ruler, Scale, Sparkles, TrendingDown, TrendingUp, User } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { UnitInput } from "@/components/ui/unit-input";

type Gender = "male" | "female";
type GoalType = "fat-loss" | "maintain" | "muscle-gain";

const activityLevels = [
  { value: 1.2, label: "Sedentary", detail: "Little daily movement" },
  { value: 1.375, label: "Light", detail: "1-3 workouts/week" },
  { value: 1.55, label: "Moderate", detail: "3-5 workouts/week" },
  { value: 1.725, label: "High", detail: "6-7 workouts/week" },
  { value: 1.9, label: "Athlete", detail: "Hard training + active job" },
];

const goals: Record<GoalType, { label: string; description: string }> = {
  "fat-loss": {
    label: "Fat loss",
    description: "Prioritize a sustainable deficit while keeping protein high.",
  },
  maintain: {
    label: "Maintain",
    description: "Hold body weight steady while improving performance.",
  },
  "muscle-gain": {
    label: "Muscle gain",
    description: "Use a controlled surplus to support hard training.",
  },
};

export default function CaloriesPage() {
  const [gender, setGender] = useState<Gender>("male");
  const [ageInput, setAgeInput] = useState("24");
  const [heightInput, setHeightInput] = useState("178");
  const [weightInput, setWeightInput] = useState("78");
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState<GoalType>("maintain");
  const age = parseNumberInput(ageInput, 24);
  const height = parseNumberInput(heightInput, 178);
  const weight = parseNumberInput(weightInput, 78);

  const result = useMemo(() => {
    const safeAge = Math.max(age, 1);
    const safeHeight = Math.max(height, 1);
    const safeWeight = Math.max(weight, 1);
    const bmr =
      gender === "male"
        ? 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge + 5
        : 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge - 161;
    const maintenance = bmr * activity;
    const fatLoss = maintenance - 450;
    const muscleGain = maintenance + 300;
    const protein = safeWeight * 2;
    return {
      bmr,
      maintenance,
      fatLoss,
      muscleGain,
      protein,
      selected: goal === "fat-loss" ? fatLoss : goal === "muscle-gain" ? muscleGain : maintenance,
    };
  }, [activity, age, gender, goal, height, weight]);

  const selectedActivity = activityLevels.find((item) => item.value === activity) ?? activityLevels[2];

  return (
    <>
      <PageHero eyebrow="Calorie Calculator" title="Dial in your daily nutrition targets.">
        Enter your age, gender, height, weight, activity level, and goal to estimate maintenance, fat loss, and
        muscle gain calories.
      </PageHero>

      <section className="page-shell grid gap-6 py-8 lg:grid-cols-[410px_1fr]">
        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Card className="glass-panel bg-card/80">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Calculator inputs</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">Mifflin-St Jeor estimate using metric units.</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Flame className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Field label="Gender" icon={User}>
                <Select value={gender} onChange={(event) => setGender(event.target.value as Gender)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Age" icon={HeartPulse}>
                  <Input type="number" min={10} max={100} value={ageInput} onChange={(event) => setAgeInput(event.target.value)} />
                </Field>
                <Field label="Weight (kg)" icon={Scale}>
                  <UnitInput unit="kg" type="number" min={25} max={250} value={weightInput} onChange={(event) => setWeightInput(event.target.value)} />
                </Field>
              </div>

              <Field label="Height (cm)" icon={Ruler}>
                <UnitInput unit="cm" type="number" min={100} max={240} value={heightInput} onChange={(event) => setHeightInput(event.target.value)} />
              </Field>

              <Field label="Activity level" icon={Activity}>
                <Select value={activity} onChange={(event) => setActivity(Number(event.target.value))}>
                  {activityLevels.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="rounded-lg border bg-background/70 p-4">
                <p className="text-sm font-bold">{selectedActivity.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{selectedActivity.detail}</p>
              </div>

              <Field label="Goal" icon={Goal}>
                <Select value={goal} onChange={(event) => setGoal(event.target.value as GoalType)}>
                  <option value="fat-loss">Fat loss</option>
                  <option value="maintain">Maintain</option>
                  <option value="muscle-gain">Muscle gain</option>
                </Select>
              </Field>

              <div className="rounded-lg border bg-primary/10 p-4">
                <p className="text-sm font-bold text-primary">{goals[goal].label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{goals[goal].description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.aside>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="relative overflow-hidden rounded-lg border bg-foreground p-6 text-background shadow-glow dark:bg-white dark:text-slate-950 sm:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(245,158,11,.45),transparent_30%),radial-gradient(circle_at_88%_28%,rgba(20,184,166,.3),transparent_32%),linear-gradient(135deg,rgba(244,63,94,.18),transparent_45%)]" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge className="mb-4 border-background/20 bg-background/10 text-background dark:text-slate-950">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Selected target
                </Badge>
                <p className="text-sm font-bold uppercase tracking-[0.18em] opacity-70">{goals[goal].label} calories</p>
                <motion.p
                  key={Math.round(result.selected)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-6xl font-black tracking-normal sm:text-7xl"
                >
                  {Math.round(result.selected)}
                </motion.p>
                <p className="mt-3 text-lg font-bold">kcal / day</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[360px]">
                <MiniResult label="BMR" value={Math.round(result.bmr).toString()} />
                <MiniResult label="Protein" value={`${Math.round(result.protein)}g`} />
                <MiniResult label="Activity" value={`${activity}x`} />
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            <CalorieResult
              icon={Flame}
              label="Maintenance calories"
              value={Math.round(result.maintenance)}
              detail="Estimated daily calories to hold current body weight."
              active={goal === "maintain"}
            />
            <CalorieResult
              icon={TrendingDown}
              label="Fat loss calories"
              value={Math.round(result.fatLoss)}
              detail="Approximate moderate deficit for sustainable cutting."
              active={goal === "fat-loss"}
            />
            <CalorieResult
              icon={TrendingUp}
              label="Muscle gain calories"
              value={Math.round(result.muscleGain)}
              detail="Approximate lean surplus for gaining size."
              active={goal === "muscle-gain"}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How to use these numbers</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {[
                "Track your 7-day average body weight, not single weigh-ins.",
                "Adjust calories by 100-200 kcal if weight trend stalls for two weeks.",
                "Keep protein high and let training performance guide the pace.",
              ].map((tip, index) => (
                <div key={tip} className="rounded-lg border bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
                  <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-primary font-black text-primary-foreground">
                    {index + 1}
                  </span>
                  {tip}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof Flame;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </span>
      {children}
    </label>
  );
}

function MiniResult({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/10 p-4 text-center">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{label}</p>
    </div>
  );
}

function CalorieResult({
  icon: Icon,
  label,
  value,
  detail,
  active,
}: {
  icon: typeof Flame;
  label: string;
  value: number;
  detail: string;
  active: boolean;
}) {
  return (
    <Card className={active ? "border-primary bg-primary text-primary-foreground" : "glass-panel bg-card/80"}>
      <CardContent className="p-6">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-background/15">
          <Icon className="h-6 w-6" />
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] opacity-75">{label}</p>
        <p className="mt-3 text-4xl font-black">{value}</p>
        <p className="mt-1 text-sm font-semibold">kcal / day</p>
        <p className="mt-4 text-sm leading-6 opacity-75">{detail}</p>
      </CardContent>
    </Card>
  );
}

function parseNumberInput(value: string, fallback: number) {
  const parsed = Number(value);
  if (value.trim() === "" || Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
}
