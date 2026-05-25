"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Clock, Dumbbell, Maximize2, Play, Plus, RotateCcw, SkipForward, Timer, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ExerciseVideo } from "@/components/exercise-video";
import { PageHero } from "@/components/sections/page-hero";
import { useToast } from "@/components/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { exercises } from "@/data/exercises";
import { createSessionFromPlan, estimatedOneRepMax, getSetLogs, type ActiveWorkoutSession, type CompletedWorkoutSession, type LoggedSet } from "@/lib/session";
import { useLocalStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { formatLabel, type WeeklyWorkoutPlan } from "@/lib/workout";

export default function SessionPage() {
  const { toast } = useToast();
  const [plans] = useLocalStorage<WeeklyWorkoutPlan[]>("fitforge-ai-plans", []);
  const [activeSession, setActiveSession] = useLocalStorage<ActiveWorkoutSession | null>("iron-garage-active-session", null);
  const [completedSessions, setCompletedSessions] = useLocalStorage<CompletedWorkoutSession[]>("iron-garage-completed-sessions", []);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [mobileExerciseIndex, setMobileExerciseIndex] = useState(0);
  const [videoExerciseId, setVideoExerciseId] = useState<string | null>(null);
  const restShouldAlert = useRef(false);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const totalSets = activeSession?.exercises.reduce((sum, exercise) => sum + exercise.sets, 0) ?? 0;
  const doneSets = activeSession?.exercises.reduce((sum, exercise) => sum + getSetLogs(exercise).filter((set) => set.completed).length, 0) ?? 0;
  const progress = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;
  const workoutVolume = activeSession?.exercises.reduce((sum, exercise) => sum + getSetLogs(exercise).reduce((total, set) => total + (set.completed ? set.weight * set.reps : 0), 0), 0) ?? 0;
  const focusedExercise = activeSession?.exercises[mobileExerciseIndex];

  useEffect(() => {
    if (!selectedPlanId && plans[0]) setSelectedPlanId(plans[0].id);
  }, [plans, selectedPlanId]);

  useEffect(() => {
    if (restSeconds <= 0) return;
    const timer = window.setInterval(() => setRestSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [restSeconds]);

  useEffect(() => {
    if (restSeconds !== 0 || !restShouldAlert.current) return;
    restShouldAlert.current = false;
    navigator.vibrate?.([180, 80, 180]);
    playTimerTone();
    toast({ title: "Rest complete", description: "Time for your next set.", variant: "success" });
  }, [restSeconds, toast]);

  function startSession() {
    if (!selectedPlan) return;
    const session = createSessionFromPlan(selectedPlan, selectedDayIndex);
    setActiveSession(session);
    setRestSeconds(0);
    setMobileExerciseIndex(0);
    toast({ title: "Workout started", description: `${session.day} is ready.`, variant: "success" });
  }

  function updateSet(exerciseId: string, setIndex: number, updates: Partial<LoggedSet>) {
    if (!activeSession) return;
    const exercise = activeSession.exercises.find((item) => item.id === exerciseId);
    if (!exercise) return;
    const previous = getSetLogs(exercise)[setIndex];
    const shouldStartRest = updates.completed === true && !previous.completed;

    setActiveSession({
      ...activeSession,
      exercises: activeSession.exercises.map((item) => {
        if (item.id !== exerciseId) return item;
        const setLogs = getSetLogs(item).map((set, index) => (index === setIndex ? { ...set, ...updates } : set));
        return { ...item, setLogs, completedSets: setLogs.map((set) => set.completed) };
      }),
    });
    if (shouldStartRest) startRest(parseRestSeconds(exercise.rest));
  }

  function startRest(seconds: number) {
    restShouldAlert.current = true;
    setRestSeconds(seconds);
  }

  function stopRest() {
    restShouldAlert.current = false;
    setRestSeconds(0);
  }

  function finishSession() {
    if (!activeSession) return;
    const completed = { ...activeSession, completedAt: new Date().toISOString() };
    setCompletedSessions([completed, ...completedSessions].slice(0, 60));
    setActiveSession(null);
    stopRest();
    toast({ title: "Workout completed", description: "Performance saved to your training history.", variant: "success" });
  }

  function previousPerformance(exerciseId: string) {
    for (const session of completedSessions) {
      const prior = session.exercises.find((exercise) => exercise.id === exerciseId);
      if (!prior) continue;
      const best = getSetLogs(prior).filter((set) => set.completed).sort((a, b) => b.weight * b.reps - a.weight * a.reps)[0];
      if (best) return best;
    }
    return null;
  }

  return (
    <>
      <PageHero eyebrow="Workout Session" title="Train, log, improve.">
        Follow your routine, check exercise form, record every working set, and beat your previous performance.
      </PageHero>

      <section className="page-shell grid gap-6 py-8 lg:grid-cols-[360px_1fr]">
        <Card className="glass-panel h-fit bg-card/80 lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle>Start workout</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {plans.length === 0 ? (
              <EmptyState icon={Dumbbell} title="No saved plans yet" description="Generate or build a workout plan first, then start it here." />
            ) : (
              <>
                <label className="grid gap-2 text-sm font-medium">
                  Saved plan
                  <Select value={selectedPlan?.id ?? ""} onChange={(event) => setSelectedPlanId(event.target.value)}>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.title || `${formatLabel(plan.input.goal)} / ${formatLabel(plan.input.experience)}`}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Training day
                  <Select value={selectedDayIndex} onChange={(event) => setSelectedDayIndex(Number(event.target.value))}>
                    {selectedPlan?.days.map((day, index) => (
                      <option key={day.day} value={index}>{day.day} - {day.focus}</option>
                    ))}
                  </Select>
                </label>
                <Button onClick={startSession}>
                  <Play className="h-4 w-4" /> Start workout
                </Button>
              </>
            )}

            <RestTimer seconds={restSeconds} onPreset={startRest} onAdd={() => startRest(restSeconds + 30)} onStop={stopRest} />
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {activeSession ? (
            <>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-lg border bg-foreground p-5 text-background shadow-glow dark:bg-white dark:text-slate-950">
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Badge className="mb-3 border-background/20 bg-background/10 text-background dark:text-slate-950">
                      <Clock className="mr-1.5 h-3.5 w-3.5" /> Active session
                    </Badge>
                    <h2 className="text-3xl font-black">{activeSession.day}</h2>
                    <p className="mt-2 text-sm opacity-75">{activeSession.planTitle}</p>
                  </div>
                  <div className="flex gap-5 text-left sm:text-right">
                    <div>
                      <p className="text-3xl font-black">{workoutVolume.toLocaleString()}</p>
                      <p className="text-xs opacity-75">kg volume</p>
                    </div>
                    <div>
                      <p className="text-4xl font-black">{progress}%</p>
                      <p className="text-xs opacity-75">{doneSets}/{totalSets} sets</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-4">
                {activeSession.exercises.map((exercise, index) => {
                  const prior = previousPerformance(exercise.id);
                  return (
                    <Card key={exercise.id} className={cn("overflow-hidden", index !== mobileExerciseIndex && "hidden md:block")}>
                      <CardHeader className="border-b bg-muted/35">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <CardTitle>{exercise.name}</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">{exercise.muscle}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge>{exercise.reps} reps / {exercise.rest}</Badge>
                            <Button size="icon" variant="outline" onClick={() => setVideoExerciseId(exercise.id)} aria-label={`Expand ${exercise.name} video`}>
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="grid gap-4 p-4 xl:grid-cols-[300px_1fr]">
                        <ExerciseVideo name={exercise.name} videoId={getSessionVideo(exercise.id, exercise.videoId)} videoCredit={getSessionVideoCredit(exercise.id, exercise.videoCredit)} compact />
                        <div className="grid content-start gap-3">
                          {prior ? (
                            <div className="rounded-md border border-secondary/25 bg-secondary/10 px-3 py-2 text-sm">
                              Last best set: <strong>{prior.weight} kg x {prior.reps}</strong> <span className="text-muted-foreground">({estimatedOneRepMax(prior.weight, prior.reps)} kg est. max)</span>
                            </div>
                          ) : (
                            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">First logged session for this movement.</p>
                          )}
                          <div className="grid gap-2">
                            {getSetLogs(exercise).map((set, setIndex) => (
                              <div key={`${exercise.id}-${setIndex}`} className={cn("grid grid-cols-[54px_1fr_1fr_52px] items-end gap-2 rounded-md border p-2", set.completed && "border-secondary bg-secondary/10")}>
                                <span className="self-center text-sm font-bold">Set {setIndex + 1}</span>
                                <SetInput label="kg" value={set.weight} onChange={(value) => updateSet(exercise.id, setIndex, { weight: value })} />
                                <SetInput label="reps" value={set.reps} onChange={(value) => updateSet(exercise.id, setIndex, { reps: value })} />
                                <Button size="icon" variant={set.completed ? "secondary" : "outline"} onClick={() => updateSet(exercise.id, setIndex, { completed: !set.completed })} aria-label={`${set.completed ? "Undo" : "Complete"} set ${setIndex + 1}`}>
                                  <Check className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Button size="lg" onClick={finishSession} disabled={doneSets === 0}>
                <Trophy className="h-4 w-4" /> Finish and save workout
              </Button>

              <div className="fixed inset-x-3 bottom-[74px] z-40 rounded-lg border bg-card/95 p-2 shadow-xl backdrop-blur md:hidden">
                <div className="flex items-center justify-between gap-2">
                  <Button size="icon" variant="ghost" disabled={mobileExerciseIndex === 0} onClick={() => setMobileExerciseIndex((value) => value - 1)} aria-label="Previous exercise">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="min-w-0 text-center">
                    <p className="truncate text-xs font-bold">{focusedExercise?.name}</p>
                    <p className="text-xs text-muted-foreground">{mobileExerciseIndex + 1}/{activeSession.exercises.length} - Rest {formatTimer(restSeconds)}</p>
                  </div>
                  <Button size="icon" variant="ghost" disabled={mobileExerciseIndex >= activeSession.exercises.length - 1} onClick={() => setMobileExerciseIndex((value) => value + 1)} aria-label="Next exercise">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState icon={Play} title="No active workout" description="Choose a saved plan and start a workout session." />
          )}

          <CompletedSessions sessions={completedSessions} />
        </div>
      </section>

      <VideoOverlay exerciseId={videoExerciseId} onClose={() => setVideoExerciseId(null)} />
    </>
  );
}

function RestTimer({ seconds, onPreset, onAdd, onStop }: { seconds: number; onPreset: (seconds: number) => void; onAdd: () => void; onStop: () => void }) {
  return (
    <div className="rounded-lg border bg-background/70 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold">Rest timer</p>
          <p className="text-xs text-muted-foreground">Alerts when recovery ends.</p>
        </div>
        <Timer className="h-5 w-5 text-primary" />
      </div>
      <p className="mt-4 text-5xl font-black">{formatTimer(seconds)}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[60, 90, 120].map((preset) => (
          <Button key={preset} size="sm" variant="outline" onClick={() => onPreset(preset)}>{preset}s</Button>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={onAdd}><Plus className="h-4 w-4" />30 sec</Button>
        <Button variant="outline" onClick={onStop}><SkipForward className="h-4 w-4" />Skip</Button>
      </div>
      <Button className="mt-2 w-full" variant="ghost" onClick={onStop}>
        <RotateCcw className="h-4 w-4" /> Reset timer
      </Button>
    </div>
  );
}

function SetInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1 text-xs text-muted-foreground">
      {label}
      <Input type="number" min={0} inputMode="decimal" className="h-9 px-2" value={value || ""} placeholder="0" onChange={(event) => onChange(Number(event.target.value) || 0)} />
    </label>
  );
}

function CompletedSessions({ sessions }: { sessions: CompletedWorkoutSession[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Completed sessions</CardTitle>
          <Badge>{sessions.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        {sessions.length === 0 ? (
          <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">Completed workouts will appear here.</p>
        ) : sessions.slice(0, 6).map((session) => (
          <div key={session.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm">
            <div>
              <p className="font-bold">{session.day} - {session.planTitle}</p>
              <p className="mt-1 text-muted-foreground">{new Date(session.completedAt).toLocaleString()}</p>
            </div>
            <Badge>{session.exercises.reduce((sum, exercise) => sum + getSetLogs(exercise).filter((set) => set.completed).length, 0)} sets</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function VideoOverlay({ exerciseId, onClose }: { exerciseId: string | null; onClose: () => void }) {
  const exercise = useMemo(() => exercises.find((item) => item.id === exerciseId), [exerciseId]);
  return (
    <AnimatePresence>
      {exercise ? (
        <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-background/85 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="w-full max-w-4xl overflow-hidden rounded-lg border bg-card" initial={{ scale: 0.97 }} animate={{ scale: 1 }} exit={{ scale: 0.97 }} onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-bold">{exercise.name} form demo</h2>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close video"><X className="h-5 w-5" /></Button>
            </div>
            <div className="aspect-video">
              <ExerciseVideo name={exercise.name} videoId={exercise.videoId} videoCredit={exercise.videoCredit} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function parseRestSeconds(rest: string) {
  const number = Number(rest.match(/\d+/)?.[0] ?? 60);
  return rest.includes("min") ? number * 60 : number;
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function getSessionVideo(exerciseId: string, videoId?: string) {
  return videoId || exercises.find((exercise) => exercise.id === exerciseId)?.videoId || "CayG6UYqL8g";
}

function getSessionVideoCredit(exerciseId: string, videoCredit?: string) {
  return videoCredit || exercises.find((exercise) => exercise.id === exerciseId)?.videoCredit || "Exercise demo";
}

function playTimerTone() {
  try {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.frequency.value = 880;
    oscillator.connect(gain);
    gain.connect(audio.destination);
    gain.gain.setValueAtTime(0.15, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.35);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.35);
  } catch {
    // Browsers may block sound until the first interaction.
  }
}
