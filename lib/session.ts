import type { WeeklyWorkoutPlan } from "@/lib/workout";

export type ActiveWorkoutSession = {
  id: string;
  planId: string;
  planTitle: string;
  day: string;
  startedAt: string;
  completedAt?: string;
  exercises: Array<{
    id: string;
    name: string;
    sets: number;
    reps: string;
    rest: string;
    muscle: string;
    videoId?: string;
    videoCredit?: string;
    completedSets: boolean[];
  }>;
};

export type CompletedWorkoutSession = ActiveWorkoutSession & {
  completedAt: string;
};

export function createSessionFromPlan(plan: WeeklyWorkoutPlan, dayIndex = 0): ActiveWorkoutSession {
  const day = plan.days[dayIndex] ?? plan.days[0];

  return {
    id: crypto.randomUUID(),
    planId: plan.id,
    planTitle: `${formatSessionLabel(plan.input.goal)} / ${formatSessionLabel(plan.input.experience)}`,
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
      })) ?? [],
  };
}

function formatSessionLabel(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
