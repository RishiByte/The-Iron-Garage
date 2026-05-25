import type { WeeklyWorkoutPlan } from "@/lib/workout";

export type LoggedSet = {
  completed: boolean;
  weight: number;
  reps: number;
};

export type SessionExercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  muscle: string;
  videoId?: string;
  videoCredit?: string;
  completedSets: boolean[];
  setLogs?: LoggedSet[];
};

export type ActiveWorkoutSession = {
  id: string;
  planId: string;
  planTitle: string;
  day: string;
  startedAt: string;
  completedAt?: string;
  exercises: SessionExercise[];
};

export type CompletedWorkoutSession = ActiveWorkoutSession & {
  completedAt: string;
};

export type TrainingProfile = {
  name: string;
  goal: "muscle-gain" | "fat-loss" | "strength" | "endurance";
  experience: "beginner" | "intermediate" | "advanced";
  height: number;
  currentWeight: number;
  targetWeight: number;
  weeklySessions: number;
};

export const defaultProfile: TrainingProfile = {
  name: "",
  goal: "muscle-gain",
  experience: "intermediate",
  height: 175,
  currentWeight: 76,
  targetWeight: 80,
  weeklySessions: 4,
};

export function createSessionFromPlan(plan: WeeklyWorkoutPlan, dayIndex = 0): ActiveWorkoutSession {
  const day = plan.days[dayIndex] ?? plan.days[0];

  return {
    id: crypto.randomUUID(),
    planId: plan.id,
    planTitle: plan.title || `${formatSessionLabel(plan.input.goal)} / ${formatSessionLabel(plan.input.experience)}`,
    day: day?.day ?? "Workout",
    startedAt: new Date().toISOString(),
    exercises:
      day?.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        rest: exercise.rest,
        muscle: exercise.muscle,
        videoId: exercise.videoId,
        videoCredit: exercise.videoCredit,
        completedSets: Array.from({ length: exercise.sets }, () => false),
        setLogs: Array.from({ length: exercise.sets }, () => ({ completed: false, weight: 0, reps: suggestedReps(exercise.reps) })),
      })) ?? [],
  };
}

export function getSetLogs(exercise: SessionExercise) {
  return Array.from({ length: exercise.sets }, (_, index) => {
    return (
      exercise.setLogs?.[index] ?? {
        completed: exercise.completedSets[index] ?? false,
        weight: 0,
        reps: suggestedReps(exercise.reps),
      }
    );
  });
}

export function completedVolume(sessions: CompletedWorkoutSession[]) {
  return sessions.reduce(
    (sum, session) =>
      sum +
      session.exercises.reduce(
        (exerciseTotal, exercise) =>
          exerciseTotal +
          getSetLogs(exercise).reduce((setTotal, set) => setTotal + (set.completed ? set.weight * set.reps : 0), 0),
        0,
      ),
    0,
  );
}

export function estimatedOneRepMax(weight: number, reps: number) {
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30));
}

function suggestedReps(reps: string) {
  const values = reps.match(/\d+/g);
  return Number(values?.[0] ?? 8);
}

function formatSessionLabel(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
