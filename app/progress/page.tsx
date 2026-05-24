"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CalendarCheck,
  Dumbbell,
  Flame,
  Ruler,
  Scale,
  Target,
  Trash2,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useLocalStorage } from "@/lib/storage";

type ChartRange = "weekly" | "monthly";

type WeightEntry = {
  id: string;
  date: string;
  weight: number;
};

type WorkoutEntry = {
  id: string;
  date: string;
  workout: string;
  completed: boolean;
  minutes: number;
};

type PrEntry = {
  id: string;
  date: string;
  exercise: string;
  weight: number;
  reps: number;
};

type MeasurementEntry = {
  id: string;
  date: string;
  chest: number;
  waist: number;
  arms: number;
  thighs: number;
};

const today = new Date().toISOString().slice(0, 10);

const weightSeed: WeightEntry[] = [
  { id: "w1", date: "2026-05-03", weight: 78.4 },
  { id: "w2", date: "2026-05-10", weight: 77.9 },
  { id: "w3", date: "2026-05-17", weight: 77.3 },
  { id: "w4", date: "2026-05-24", weight: 76.9 },
];

const workoutSeed: WorkoutEntry[] = [
  { id: "c1", date: "2026-05-05", workout: "Push", completed: true, minutes: 52 },
  { id: "c2", date: "2026-05-07", workout: "Pull", completed: true, minutes: 48 },
  { id: "c3", date: "2026-05-12", workout: "Legs", completed: false, minutes: 0 },
  { id: "c4", date: "2026-05-14", workout: "Upper", completed: true, minutes: 56 },
  { id: "c5", date: "2026-05-21", workout: "Full Body", completed: true, minutes: 45 },
];

const prSeed: PrEntry[] = [
  { id: "p1", date: "2026-05-04", exercise: "Bench Press", weight: 90, reps: 5 },
  { id: "p2", date: "2026-05-11", exercise: "Squat", weight: 120, reps: 3 },
  { id: "p3", date: "2026-05-18", exercise: "Deadlift", weight: 145, reps: 2 },
];

const measurementSeed: MeasurementEntry[] = [
  { id: "m1", date: "2026-05-01", chest: 101, waist: 84, arms: 36, thighs: 58 },
  { id: "m2", date: "2026-05-15", chest: 102, waist: 83, arms: 36.5, thighs: 58.5 },
  { id: "m3", date: "2026-05-24", chest: 103, waist: 82, arms: 37, thighs: 59 },
];

export default function ProgressPage() {
  const [range, setRange] = useState<ChartRange>("weekly");
  const [weights, setWeights] = useLocalStorage<WeightEntry[]>("fitforge-weight-tracker", weightSeed);
  const [workouts, setWorkouts] = useLocalStorage<WorkoutEntry[]>("fitforge-workout-completions", workoutSeed);
  const [prs, setPrs] = useLocalStorage<PrEntry[]>("fitforge-pr-tracker", prSeed);
  const [measurements, setMeasurements] = useLocalStorage<MeasurementEntry[]>(
    "fitforge-body-measurements",
    measurementSeed,
  );

  const [weightForm, setWeightForm] = useState({ date: today, weight: 76.8 });
  const [workoutForm, setWorkoutForm] = useState({ date: today, workout: "Push", completed: true, minutes: 50 });
  const [prForm, setPrForm] = useState({ date: today, exercise: "Bench Press", weight: 95, reps: 3 });
  const [measurementForm, setMeasurementForm] = useState({
    date: today,
    chest: 103,
    waist: 82,
    arms: 37,
    thighs: 59,
  });

  const sortedWeights = sortByDate(weights);
  const sortedMeasurements = sortByDate(measurements);
  const latestWeight = sortedWeights.at(-1)?.weight ?? 0;
  const previousWeight = sortedWeights.at(-2)?.weight ?? latestWeight;
  const completedWorkouts = workouts.filter((workout) => workout.completed).length;
  const completionRate = workouts.length ? Math.round((completedWorkouts / workouts.length) * 100) : 0;
  const bestPr = prs.reduce((best, entry) => (entry.weight > best.weight ? entry : best), prs[0] ?? { weight: 0, exercise: "None", reps: 0 });
  const latestMeasurement = sortedMeasurements.at(-1);

  const workoutChartData = useMemo(() => aggregateWorkouts(workouts, range), [range, workouts]);
  const prChartData = useMemo(() => aggregatePrs(prs, range), [prs, range]);

  function addWeight() {
    setWeights([{ id: crypto.randomUUID(), ...weightForm }, ...weights]);
  }

  function addWorkout() {
    setWorkouts([{ id: crypto.randomUUID(), ...workoutForm }, ...workouts]);
  }

  function addPr() {
    setPrs([{ id: crypto.randomUUID(), ...prForm }, ...prs]);
  }

  function addMeasurement() {
    setMeasurements([{ id: crypto.randomUUID(), ...measurementForm }, ...measurements]);
  }

  return (
    <>
      <PageHero eyebrow="Progress Tracker" title="A complete dashboard for your fitness metrics.">
        Log weight, workout completion, personal records, and body measurements. THE IRON GARAGE saves every tracker in
        localStorage and visualizes weekly or monthly trends with Recharts.
      </PageHero>

      <section className="page-shell grid gap-6 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Badge className="border-primary/30 bg-primary/10 text-foreground">
              <Activity className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Local dashboard
            </Badge>
            <Badge>{weights.length + workouts.length + prs.length + measurements.length} total logs</Badge>
          </div>
          <div className="w-full sm:w-48">
            <Select value={range} onChange={(event) => setRange(event.target.value as ChartRange)}>
              <option value="weekly">Weekly charts</option>
              <option value="monthly">Monthly charts</option>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Scale}
            label="Current weight"
            value={`${latestWeight || 0} kg`}
            detail={`${formatDelta(latestWeight - previousWeight)} kg from previous`}
          />
          <StatCard
            icon={CalendarCheck}
            label="Workout completion"
            value={`${completionRate}%`}
            detail={`${completedWorkouts}/${workouts.length} sessions done`}
          />
          <StatCard icon={Trophy} label="Top PR" value={`${bestPr.weight} kg`} detail={`${bestPr.exercise} x ${bestPr.reps}`} />
          <StatCard
            icon={Ruler}
            label="Latest waist"
            value={`${latestMeasurement?.waist ?? 0} cm`}
            detail={`${latestMeasurement?.chest ?? 0} cm chest`}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="grid gap-4">
            <TrackerCard title="Weight tracker" icon={Scale}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Date">
                  <Input type="date" value={weightForm.date} onChange={(e) => setWeightForm({ ...weightForm, date: e.target.value })} />
                </Field>
                <Field label="Weight (kg)">
                  <Input type="number" value={weightForm.weight} onChange={(e) => setWeightForm({ ...weightForm, weight: Number(e.target.value) })} />
                </Field>
              </div>
              <Button onClick={addWeight} className="w-full">Add weight</Button>
            </TrackerCard>

            <TrackerCard title="Workout completion" icon={CalendarCheck}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Date">
                  <Input type="date" value={workoutForm.date} onChange={(e) => setWorkoutForm({ ...workoutForm, date: e.target.value })} />
                </Field>
                <Field label="Workout">
                  <Input value={workoutForm.workout} onChange={(e) => setWorkoutForm({ ...workoutForm, workout: e.target.value })} />
                </Field>
                <Field label="Status">
                  <Select
                    value={workoutForm.completed ? "completed" : "missed"}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, completed: e.target.value === "completed" })}
                  >
                    <option value="completed">Completed</option>
                    <option value="missed">Missed</option>
                  </Select>
                </Field>
                <Field label="Minutes">
                  <Input type="number" value={workoutForm.minutes} onChange={(e) => setWorkoutForm({ ...workoutForm, minutes: Number(e.target.value) })} />
                </Field>
              </div>
              <Button onClick={addWorkout} className="w-full">Add workout</Button>
            </TrackerCard>

            <TrackerCard title="PR tracker" icon={Trophy}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Date">
                  <Input type="date" value={prForm.date} onChange={(e) => setPrForm({ ...prForm, date: e.target.value })} />
                </Field>
                <Field label="Exercise">
                  <Input value={prForm.exercise} onChange={(e) => setPrForm({ ...prForm, exercise: e.target.value })} />
                </Field>
                <Field label="Weight (kg)">
                  <Input type="number" value={prForm.weight} onChange={(e) => setPrForm({ ...prForm, weight: Number(e.target.value) })} />
                </Field>
                <Field label="Reps">
                  <Input type="number" value={prForm.reps} onChange={(e) => setPrForm({ ...prForm, reps: Number(e.target.value) })} />
                </Field>
              </div>
              <Button onClick={addPr} className="w-full">Add PR</Button>
            </TrackerCard>

            <TrackerCard title="Body measurements" icon={Ruler}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Date">
                  <Input type="date" value={measurementForm.date} onChange={(e) => setMeasurementForm({ ...measurementForm, date: e.target.value })} />
                </Field>
                <Field label="Chest cm">
                  <Input type="number" value={measurementForm.chest} onChange={(e) => setMeasurementForm({ ...measurementForm, chest: Number(e.target.value) })} />
                </Field>
                <Field label="Waist cm">
                  <Input type="number" value={measurementForm.waist} onChange={(e) => setMeasurementForm({ ...measurementForm, waist: Number(e.target.value) })} />
                </Field>
                <Field label="Arms cm">
                  <Input type="number" value={measurementForm.arms} onChange={(e) => setMeasurementForm({ ...measurementForm, arms: Number(e.target.value) })} />
                </Field>
                <Field label="Thighs cm">
                  <Input type="number" value={measurementForm.thighs} onChange={(e) => setMeasurementForm({ ...measurementForm, thighs: Number(e.target.value) })} />
                </Field>
              </div>
              <Button onClick={addMeasurement} className="w-full">Add measurements</Button>
            </TrackerCard>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <ChartCard title="Weight trend">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedWeights}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={["dataMin - 1", "dataMax + 1"]} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="weight" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title={`${capitalize(range)} workout completion`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workoutChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="completed" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="missed" fill="hsl(var(--chart-3))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title={`${capitalize(range)} PR load`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={prChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="topWeight" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.22} strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Body measurements">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedMeasurements}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="chest" stroke="hsl(var(--chart-1))" strokeWidth={3} />
                    <Line type="monotone" dataKey="waist" stroke="hsl(var(--chart-3))" strokeWidth={3} />
                    <Line type="monotone" dataKey="arms" stroke="hsl(var(--chart-2))" strokeWidth={3} />
                    <Line type="monotone" dataKey="thighs" stroke="hsl(var(--chart-5))" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <LogList
                title="Recent PRs"
                icon={Trophy}
                items={prs}
                render={(entry) => `${entry.date} - ${entry.exercise} - ${entry.weight} kg x ${entry.reps}`}
                onDelete={(id) => setPrs(prs.filter((entry) => entry.id !== id))}
              />
              <LogList
                title="Workout log"
                icon={Dumbbell}
                items={workouts}
                render={(entry) => `${entry.date} - ${entry.workout} - ${entry.completed ? "completed" : "missed"} - ${entry.minutes} min`}
                onDelete={(id) => setWorkouts(workouts.filter((entry) => entry.id !== id))}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Scale;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="glass-panel bg-card/80">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs text-muted-foreground">{detail}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TrackerCard({ title, icon: Icon, children }: { title: string; icon: typeof Scale; children: React.ReactNode }) {
  return (
    <Card className="glass-panel bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary/15 text-secondary">
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">{children}</CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-72">{children}</CardContent>
    </Card>
  );
}

function LogList<T extends { id: string }>({
  title,
  icon: Icon,
  items,
  render,
  onDelete,
}: {
  title: string;
  icon: typeof Trophy;
  items: T[];
  render: (item: T) => string;
  onDelete: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Badge>{items.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        {items.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No logs yet.</div>
        ) : (
          items.slice(0, 6).map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border p-3 text-sm">
              <span>{render(item)}</span>
              <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} aria-label={`Delete ${title} entry`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function sortByDate<T extends { date: string }>(items: T[]) {
  return [...items].sort((a, b) => a.date.localeCompare(b.date));
}

function aggregateWorkouts(items: WorkoutEntry[], range: ChartRange) {
  const groups = new Map<string, { label: string; completed: number; missed: number; minutes: number }>();
  items.forEach((entry) => {
    const label = getBucketLabel(entry.date, range);
    const current = groups.get(label) ?? { label, completed: 0, missed: 0, minutes: 0 };
    if (entry.completed) current.completed += 1;
    else current.missed += 1;
    current.minutes += entry.minutes;
    groups.set(label, current);
  });
  return [...groups.values()];
}

function aggregatePrs(items: PrEntry[], range: ChartRange) {
  const groups = new Map<string, { label: string; topWeight: number }>();
  items.forEach((entry) => {
    const label = getBucketLabel(entry.date, range);
    const current = groups.get(label) ?? { label, topWeight: 0 };
    current.topWeight = Math.max(current.topWeight, entry.weight);
    groups.set(label, current);
  });
  return [...groups.values()];
}

function getBucketLabel(date: string, range: ChartRange) {
  const parsed = new Date(`${date}T00:00:00`);
  if (range === "monthly") {
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
  }
  const week = Math.ceil(parsed.getDate() / 7);
  return `${parsed.getMonth() + 1}/${parsed.getFullYear()} W${week}`;
}

function formatDelta(value: number) {
  if (!Number.isFinite(value)) return "0";
  return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
