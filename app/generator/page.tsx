"use client";

import { motion } from "framer-motion";
import { CalendarDays, Check, Clock, Dumbbell, Save, Sparkles, Target, Trash2, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { exercises } from "@/data/exercises";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/lib/storage";
import {
  formatLabel,
  generateWeeklyWorkoutPlan,
  type AiWorkoutGoal,
  type Equipment,
  type ExperienceLevel,
  type MuscleGroup,
  type WeeklyWorkoutPlan,
} from "@/lib/workout";

const equipmentOptions: Equipment[] = ["Barbell", "Dumbbell", "Cable", "Machine", "Bodyweight"];
const muscleOptions: MuscleGroup[] = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

const goalDescriptions: Record<AiWorkoutGoal, string> = {
  "muscle-gain": "Hypertrophy volume, clean progression, gym staples.",
  "fat-loss": "Higher-density training with short rests.",
  endurance: "Higher reps, crisp pace, repeatable effort.",
};

export default function GeneratorPage() {
  const [goal, setGoal] = useState<AiWorkoutGoal>("muscle-gain");
  const [experience, setExperience] = useState<ExperienceLevel>("intermediate");
  const [daysPerWeekInput, setDaysPerWeekInput] = useState("4");
  const [equipment, setEquipment] = useState<Equipment[]>(["Barbell", "Dumbbell", "Cable"]);
  const [durationInput, setDurationInput] = useState("55");
  const [muscles, setMuscles] = useState<MuscleGroup[]>(["Chest", "Back", "Legs", "Shoulders", "Arms"]);
  const [savedPlans, setSavedPlans] = useLocalStorage<WeeklyWorkoutPlan[]>("fitforge-ai-plans", []);
  const [generationKey, setGenerationKey] = useState(0);
  const daysPerWeek = clampNumber(daysPerWeekInput, 4, 1, 6);
  const duration = clampNumber(durationInput, 55, 25, 90);

  const input = useMemo(
    () => ({ goal, experience, daysPerWeek, equipment, duration, muscles, seed: generationKey }),
    [daysPerWeek, duration, equipment, experience, generationKey, goal, muscles],
  );
  const plan = useMemo(() => generateWeeklyWorkoutPlan(input), [input]);
  const availableCount = exercises.filter(
    (exercise) => equipment.includes(exercise.equipment) && muscles.includes(exercise.muscle),
  ).length;

  function toggleEquipment(item: Equipment) {
    setEquipment((current) => toggle(current, item));
  }

  function toggleMuscle(item: MuscleGroup) {
    setMuscles((current) => toggle(current, item));
  }

  function savePlan() {
    setSavedPlans([{ ...plan, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...savedPlans].slice(0, 12));
  }

  return (
    <>
      <PageHero eyebrow="AI Workout Generator" title="Generate a personalized weekly gym plan.">
        Choose your goal, training age, schedule, equipment, duration, and target muscles. THE IRON GARAGE uses mock AI
        logic first, then saves your best plans locally.
      </PageHero>

      <section className="page-shell grid gap-6 py-8 xl:grid-cols-[400px_1fr]">
        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Card className="glass-panel sticky top-20 bg-card/80">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Plan inputs</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">Tune the model before generating.</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Wand2 className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5">
              <label className="grid gap-2 text-sm font-medium">
                Goal
                <Select value={goal} onChange={(event) => setGoal(event.target.value as AiWorkoutGoal)}>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="fat-loss">Fat Loss</option>
                  <option value="endurance">Endurance</option>
                </Select>
                <span className="text-xs font-normal text-muted-foreground">{goalDescriptions[goal]}</span>
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Experience level
                <Select value={experience} onChange={(event) => setExperience(event.target.value as ExperienceLevel)}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2 text-sm font-medium">
                  Days per week
                  <Input
                    type="number"
                    min={1}
                    max={6}
                    value={daysPerWeekInput}
                    onChange={(event) => setDaysPerWeekInput(event.target.value)}
                    onBlur={() => setDaysPerWeekInput(daysPerWeek.toString())}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Duration (minutes)
                  <Input
                    type="number"
                    min={25}
                    max={90}
                    value={durationInput}
                    onChange={(event) => setDurationInput(event.target.value)}
                    onBlur={() => setDurationInput(duration.toString())}
                  />
                </label>
              </div>

              <OptionGroup title="Available equipment" options={equipmentOptions} selected={equipment} onToggle={toggleEquipment} />
              <OptionGroup title="Target muscle groups" options={muscleOptions} selected={muscles} onToggle={toggleMuscle} />

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <MiniStat icon={CalendarDays} value={daysPerWeek.toString()} label="days" />
                <MiniStat icon={Clock} value={`${duration}m`} label="each" />
                <MiniStat icon={Dumbbell} value={availableCount.toString()} label="matches" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <Button onClick={() => setGenerationKey((value) => value + 1)}>
                  <Sparkles className="h-4 w-4" /> Generate plan
                </Button>
                <Button variant="outline" onClick={savePlan}>
                  <Save className="h-4 w-4" /> Save plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.aside>

        <div className="grid gap-6">
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-lg border bg-foreground p-5 text-background shadow-glow dark:bg-white dark:text-slate-950"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(245,158,11,.35),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(20,184,166,.22),transparent_28%)]" />
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Badge className="mb-3 border-background/20 bg-background/10 text-background dark:text-slate-950">
                  <Target className="mr-1.5 h-3.5 w-3.5" /> Generated plan #{generationKey + 1}
                </Badge>
                <h2 className="text-3xl font-black tracking-normal sm:text-4xl">
                  {formatLabel(goal)} / {formatLabel(experience)}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 opacity-75">{plan.summary}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <PlanPill label="Weekly days" value={plan.days.length.toString()} />
                <PlanPill label="Duration" value={`${duration}m`} />
                <PlanPill label="Exercises" value={plan.days.reduce((sum, day) => sum + day.exercises.length, 0).toString()} />
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {plan.days.map((day, dayIndex) => (
              <motion.div
                key={`${plan.id}-${day.day}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: dayIndex * 0.05 }}
              >
                <Card className="overflow-hidden border-primary/10 bg-card/90 shadow-sm">
                  <CardHeader className="border-b bg-muted/35">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-bold text-primary">{day.day}</p>
                        <CardTitle>{day.focus}</CardTitle>
                      </div>
                      <Badge className="w-fit">{day.duration} minutes</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid divide-y">
                      {day.exercises.map((exercise) => (
                        <div key={`${day.day}-${exercise.id}`} className="grid gap-4 p-4 lg:grid-cols-[1fr_320px] lg:items-center">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold">{exercise.name}</h3>
                              <Badge>{exercise.muscle}</Badge>
                              <Badge>{exercise.equipment}</Badge>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">{exercise.cues[0]}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <TrainingMetric value={exercise.sets.toString()} label="sets" />
                            <TrainingMetric value={exercise.reps} label="reps" />
                            <TrainingMetric value={exercise.rest} label="rest" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <SavedPlans plans={savedPlans} onDelete={(id) => setSavedPlans(savedPlans.filter((planItem) => planItem.id !== id))} />
        </div>
      </section>
    </>
  );
}

function OptionGroup<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: T[];
  selected: T[];
  onToggle: (option: T) => void;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={cn(
                "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition",
                active ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted",
              )}
            >
              {active ? <Check className="h-3.5 w-3.5" /> : null}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, value, label }: { icon: typeof CalendarDays; value: string; label: string }) {
  return (
    <div className="rounded-md border bg-background/70 p-3">
      <Icon className="mx-auto mb-2 h-4 w-4 text-primary" />
      <p className="font-black">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}

function PlanPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-background/20 bg-background/10 px-4 py-3">
      <p className="text-xl font-black">{value}</p>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
}

function TrainingMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md bg-muted p-3">
      <p className="font-black">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function SavedPlans({ plans, onDelete }: { plans: WeeklyWorkoutPlan[]; onDelete: (id: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Saved plans</CardTitle>
          <Badge>{plans.length} saved</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {plans.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            Saved weekly plans will appear here after you click Save plan.
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="font-bold">
                  {formatLabel(plan.input.goal)} / {formatLabel(plan.input.experience)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.input.daysPerWeek} days per week - {plan.input.duration} minutes - {new Date(plan.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onDelete(plan.id)} aria-label={`Delete saved ${formatLabel(plan.input.goal)} plan`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function toggle<T>(items: T[], item: T) {
  return items.includes(item) ? items.filter((current) => current !== item) : [...items, item];
}

function clampNumber(value: string, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || value.trim() === "") return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}
