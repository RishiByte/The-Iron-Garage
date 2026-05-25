"use client";

import { ArrowDown, ArrowUp, Dumbbell, Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageHero } from "@/components/sections/page-hero";
import { useToast } from "@/components/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { exercises, type Exercise } from "@/data/exercises";
import { useLocalStorage } from "@/lib/storage";
import type { WeeklyWorkoutPlan } from "@/lib/workout";

type BuilderExercise = Exercise & { sets: number; reps: string; rest: string };

export default function BuilderPage() {
  const { toast } = useToast();
  const [savedPlans, setSavedPlans] = useLocalStorage<WeeklyWorkoutPlan[]>("fitforge-ai-plans", []);
  const [title, setTitle] = useState("My Push Day");
  const [selectedId, setSelectedId] = useState(exercises[0].id);
  const [routine, setRoutine] = useState<BuilderExercise[]>([]);

  const duration = Math.max(20, routine.reduce((minutes, exercise) => minutes + exercise.sets * 3, 0));
  const focus = useMemo(() => [...new Set(routine.map((exercise) => exercise.muscle))].join(" + ") || "Custom focus", [routine]);

  function addExercise() {
    const exercise = exercises.find((item) => item.id === selectedId);
    if (!exercise) return;
    if (routine.some((item) => item.id === exercise.id)) {
      toast({ title: "Exercise already added", description: "Adjust its prescription below.", variant: "info" });
      return;
    }
    setRoutine([...routine, { ...exercise, sets: 3, reps: "8-12", rest: "75 sec" }]);
  }

  function updateExercise(id: string, updates: Partial<BuilderExercise>) {
    setRoutine(routine.map((exercise) => (exercise.id === id ? { ...exercise, ...updates } : exercise)));
  }

  function moveExercise(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= routine.length) return;
    const reordered = [...routine];
    [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
    setRoutine(reordered);
  }

  function saveRoutine() {
    if (!routine.length) {
      toast({ title: "Add an exercise first", description: "Your routine needs at least one movement.", variant: "info" });
      return;
    }
    const plan: WeeklyWorkoutPlan = {
      id: crypto.randomUUID(),
      title: title.trim() || "Custom Workout",
      source: "custom",
      createdAt: new Date().toISOString(),
      summary: "Custom routine created in Workout Builder.",
      input: {
        goal: "muscle-gain",
        experience: "intermediate",
        daysPerWeek: 1,
        equipment: [...new Set(routine.map((exercise) => exercise.equipment))],
        duration,
        muscles: [...new Set(routine.map((exercise) => exercise.muscle))],
      },
      days: [{ day: title.trim() || "Custom Workout", focus, coachingNote: "Warm up before the first loaded movement and log every working set.", duration, exercises: routine }],
    };
    setSavedPlans([plan, ...savedPlans].slice(0, 20));
    toast({ title: "Custom routine saved", description: "Open Workout Session to train it.", variant: "success" });
  }

  return (
    <>
      <PageHero eyebrow="Workout Builder" title="Build the routine you actually train.">
        Pick movements, set your prescription, order your session, and save it locally for your next workout.
      </PageHero>

      <section className="page-shell grid gap-6 py-8 xl:grid-cols-[360px_1fr]">
        <Card className="glass-panel h-fit bg-card/80">
          <CardHeader>
            <CardTitle>Routine setup</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Routine name
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Upper strength" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Add exercise
              <Select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name} - {exercise.muscle}
                  </option>
                ))}
              </Select>
            </label>
            <Button onClick={addExercise} variant="secondary">
              <Plus className="h-4 w-4" /> Add movement
            </Button>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-md border bg-background p-3">
                <p className="text-xl font-black">{routine.length}</p>
                <p className="text-xs text-muted-foreground">exercises</p>
              </div>
              <div className="rounded-md border bg-background p-3">
                <p className="text-xl font-black">{duration}m</p>
                <p className="text-xs text-muted-foreground">estimate</p>
              </div>
            </div>
            <Button onClick={saveRoutine} size="lg">
              <Save className="h-4 w-4" /> Save routine
            </Button>
            <Badge className="w-fit">{savedPlans.length} routines saved</Badge>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black">{title || "Custom Workout"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{focus}</p>
            </div>
            <Badge>{duration} minutes</Badge>
          </div>
          {routine.length === 0 ? (
            <EmptyState icon={Dumbbell} title="No movements selected" description="Choose an exercise and add it to start building your session." />
          ) : (
            routine.map((exercise, index) => (
              <Card key={exercise.id}>
                <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-sm font-bold text-primary">{index + 1}</span>
                      <h3 className="font-bold">{exercise.name}</h3>
                      <Badge>{exercise.muscle}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{exercise.cues[0]}</p>
                  </div>
                  <div className="grid grid-cols-[72px_90px_100px_auto] gap-2">
                    <BuilderField label="Sets" value={exercise.sets.toString()} onChange={(value) => updateExercise(exercise.id, { sets: clamp(Number(value), 1, 8) })} type="number" />
                    <BuilderField label="Reps" value={exercise.reps} onChange={(value) => updateExercise(exercise.id, { reps: value })} />
                    <BuilderField label="Rest" value={exercise.rest} onChange={(value) => updateExercise(exercise.id, { rest: value })} />
                    <div className="flex items-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => moveExercise(index, -1)} disabled={index === 0} aria-label={`Move ${exercise.name} up`}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => moveExercise(index, 1)} disabled={index === routine.length - 1} aria-label={`Move ${exercise.name} down`}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setRoutine(routine.filter((item) => item.id !== exercise.id))} aria-label={`Remove ${exercise.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </>
  );
}

function BuilderField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-muted-foreground">
      {label}
      <Input className="px-2" type={type} min={type === "number" ? 1 : undefined} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}
