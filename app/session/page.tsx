"use client";

import { motion } from "framer-motion";
import { Check, Clock, Dumbbell, Play, RotateCcw, Timer, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ExerciseVideo } from "@/components/exercise-video";
import { PageHero } from "@/components/sections/page-hero";
import { useToast } from "@/components/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { exercises } from "@/data/exercises";
import { useLocalStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { createSessionFromPlan, type ActiveWorkoutSession, type CompletedWorkoutSession } from "@/lib/session";
import { formatLabel, type WeeklyWorkoutPlan } from "@/lib/workout";

export default function SessionPage() {
  const { toast } = useToast();
  const [plans] = useLocalStorage<WeeklyWorkoutPlan[]>("fitforge-ai-plans", []);
  const [activeSession, setActiveSession] = useLocalStorage<ActiveWorkoutSession | null>("iron-garage-active-session", null);
  const [completedSessions, setCompletedSessions] = useLocalStorage<CompletedWorkoutSession[]>("iron-garage-completed-sessions", []);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const totalSets = activeSession?.exercises.reduce((sum, exercise) => sum + exercise.completedSets.length, 0) ?? 0;
  const doneSets = activeSession?.exercises.reduce((sum, exercise) => sum + exercise.completedSets.filter(Boolean).length, 0) ?? 0;
  const progress = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;

  useEffect(() => {
    if (!selectedPlanId && plans[0]) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans, selectedPlanId]);

  useEffect(() => {
    if (restSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setRestSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [restSeconds]);

  function startSession() {
    if (!selectedPlan) return;
    const session = createSessionFromPlan(selectedPlan, selectedDayIndex);
    setActiveSession(session);
    setRestSeconds(0);
    toast({ title: "Workout started", description: `${session.day} is ready.`, variant: "success" });
  }

  function toggleSet(exerciseId: string, setIndex: number, rest: string) {
    if (!activeSession) return;
    setActiveSession({
      ...activeSession,
      exercises: activeSession.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              completedSets: exercise.completedSets.map((done, index) => (index === setIndex ? !done : done)),
            }
          : exercise,
      ),
    });
    setRestSeconds(parseRestSeconds(rest));
  }

  function finishSession() {
    if (!activeSession) return;
    const completed = { ...activeSession, completedAt: new Date().toISOString() };
    setCompletedSessions([completed, ...completedSessions].slice(0, 30));
    setActiveSession(null);
    setRestSeconds(0);
    toast({ title: "Workout completed", description: "Session saved to your local history.", variant: "success" });
  }

  return (
    <>
      <PageHero eyebrow="Workout Session" title="Train set by set inside THE IRON GARAGE.">
        Start a saved plan, tick off sets, use the rest timer, and save completed workouts to your local history.
      </PageHero>

      <section className="page-shell grid gap-6 py-8 lg:grid-cols-[380px_1fr]">
        <Card className="glass-panel bg-card/80">
          <CardHeader>
            <CardTitle>Start workout</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {plans.length === 0 ? (
              <EmptyState icon={Dumbbell} title="No saved plans yet" description="Generate and save a workout plan first, then start it here." />
            ) : (
              <>
                <label className="grid gap-2 text-sm font-medium">
                  Saved plan
                  <Select value={selectedPlan?.id ?? ""} onChange={(event) => setSelectedPlanId(event.target.value)}>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {formatLabel(plan.input.goal)} / {formatLabel(plan.input.experience)}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Training day
                  <Select value={selectedDayIndex} onChange={(event) => setSelectedDayIndex(Number(event.target.value))}>
                    {selectedPlan?.days.map((day, index) => (
                      <option key={day.day} value={index}>
                        {day.day} - {day.focus}
                      </option>
                    ))}
                  </Select>
                </label>
                <Button onClick={startSession}>
                  <Play className="h-4 w-4" /> Start workout
                </Button>
              </>
            )}

            <div className="rounded-lg border bg-background/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Rest timer</p>
                  <p className="text-xs text-muted-foreground">Starts when you complete a set.</p>
                </div>
                <Timer className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-5xl font-black">{formatTimer(restSeconds)}</p>
              <Button className="mt-4 w-full" variant="outline" onClick={() => setRestSeconds(0)}>
                <RotateCcw className="h-4 w-4" /> Reset timer
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {activeSession ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-lg border bg-foreground p-5 text-background shadow-glow dark:bg-white dark:text-slate-950"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(245,158,11,.4),transparent_30%),radial-gradient(circle_at_88%_30%,rgba(20,184,166,.24),transparent_28%)]" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Badge className="mb-3 border-background/20 bg-background/10 text-background dark:text-slate-950">
                      <Clock className="mr-1.5 h-3.5 w-3.5" /> Active session
                    </Badge>
                    <h2 className="text-3xl font-black">{activeSession.day}</h2>
                    <p className="mt-2 text-sm opacity-75">{activeSession.planTitle}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-5xl font-black">{progress}%</p>
                    <p className="text-sm opacity-75">{doneSets}/{totalSets} sets complete</p>
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-4">
                {activeSession.exercises.map((exercise) => (
                  <Card key={exercise.id} className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/35">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <CardTitle>{exercise.name}</CardTitle>
                          <p className="mt-1 text-sm text-muted-foreground">{exercise.muscle}</p>
                        </div>
                        <Badge>{exercise.reps} reps / {exercise.rest} rest</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
                        <ExerciseVideo
                          name={exercise.name}
                          videoId={getSessionVideo(exercise.id, exercise.videoId)}
                          videoCredit={getSessionVideoCredit(exercise.id, exercise.videoCredit)}
                          compact
                        />

                        <div className="grid content-start gap-2 sm:grid-cols-2 lg:grid-cols-4">
                          {exercise.completedSets.map((done, index) => (
                            <button
                              key={`${exercise.id}-${index}`}
                              type="button"
                              onClick={() => toggleSet(exercise.id, index, exercise.rest)}
                              className={cn(
                                "flex min-h-12 items-center justify-between rounded-md border p-3 text-left text-sm font-semibold transition",
                                done ? "border-secondary bg-secondary text-secondary-foreground" : "bg-background hover:bg-muted",
                              )}
                            >
                              Set {index + 1}
                              {done ? <Check className="h-4 w-4" /> : null}
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button size="lg" onClick={finishSession} disabled={doneSets === 0}>
                <Trophy className="h-4 w-4" /> Finish and save workout
              </Button>
            </>
          ) : (
            <EmptyState icon={Play} title="No active workout" description="Choose a saved plan and start a workout session." />
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Completed sessions</CardTitle>
                <Badge>{completedSessions.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2">
              {completedSessions.length === 0 ? (
                <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">Completed workouts will appear here.</p>
              ) : (
                completedSessions.slice(0, 6).map((session) => (
                  <div key={session.id} className="rounded-md border p-3 text-sm">
                    <p className="font-bold">{session.day} - {session.planTitle}</p>
                    <p className="mt-1 text-muted-foreground">{new Date(session.completedAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function parseRestSeconds(rest: string) {
  if (rest.includes("min")) return 120;
  const number = Number(rest.match(/\d+/)?.[0] ?? 60);
  return Number.isFinite(number) ? number : 60;
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function getSessionVideo(exerciseId: string, videoId?: string) {
  return videoId || exercises.find((exercise) => exercise.id === exerciseId)?.videoId || "CayG6UYqL8g";
}

function getSessionVideoCredit(exerciseId: string, videoCredit?: string) {
  return videoCredit || exercises.find((exercise) => exercise.id === exerciseId)?.videoCredit || "Exercise demo";
}
