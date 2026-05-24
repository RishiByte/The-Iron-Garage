import { exercises, type Exercise } from "@/data/exercises";

export type WorkoutGoal = "strength" | "hypertrophy" | "fat-loss";
export type WorkoutSplit = "push" | "pull" | "legs" | "upper" | "full";
export type AiWorkoutGoal = "muscle-gain" | "fat-loss" | "endurance";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type Equipment = Exercise["equipment"];
export type MuscleGroup = Exercise["muscle"];

export type AiWorkoutInput = {
  goal: AiWorkoutGoal;
  experience: ExperienceLevel;
  daysPerWeek: number;
  equipment: Equipment[];
  duration: number;
  muscles: MuscleGroup[];
  seed?: number;
};

export type WeeklyWorkoutPlan = {
  id: string;
  createdAt: string;
  summary: string;
  input: AiWorkoutInput;
  days: Array<{
    day: string;
    focus: string;
    duration: number;
    exercises: Array<Exercise & { sets: number; reps: string; rest: string }>;
  }>;
};

export type GeneratedWorkout = {
  id: string;
  date: string;
  goal: WorkoutGoal;
  split: WorkoutSplit;
  duration: number;
  exercises: Array<Exercise & { sets: number; reps: string; rest: string }>;
};

const splitMap: Record<WorkoutSplit, Exercise["muscle"][]> = {
  push: ["Chest", "Shoulders", "Arms"],
  pull: ["Back", "Arms", "Core"],
  legs: ["Legs", "Core"],
  upper: ["Chest", "Back", "Shoulders", "Arms"],
  full: ["Chest", "Back", "Legs", "Shoulders", "Core"],
};

const goalConfig: Record<WorkoutGoal, { sets: number; reps: string; rest: string }> = {
  strength: { sets: 5, reps: "3-6", rest: "2-3 min" },
  hypertrophy: { sets: 4, reps: "8-12", rest: "75-90 sec" },
  "fat-loss": { sets: 3, reps: "12-15", rest: "45-60 sec" },
};

export function generateWorkout(goal: WorkoutGoal, split: WorkoutSplit, duration: number): GeneratedWorkout {
  const targetMuscles = splitMap[split];
  const pool = exercises.filter((exercise) => targetMuscles.includes(exercise.muscle));
  const exerciseCount = Math.min(pool.length, duration <= 35 ? 4 : duration <= 55 ? 5 : 6);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const config = goalConfig[goal];

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    goal,
    split,
    duration,
    exercises: shuffled.slice(0, exerciseCount).map((exercise) => ({ ...exercise, ...config })),
  };
}

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const aiGoalConfig: Record<AiWorkoutGoal, { sets: number; reps: string; rest: string; summary: string }> = {
  "muscle-gain": {
    sets: 4,
    reps: "8-12",
    rest: "75-90 sec",
    summary: "Progressive hypertrophy split with controlled volume and repeatable gym staples.",
  },
  "fat-loss": {
    sets: 3,
    reps: "12-15",
    rest: "45-60 sec",
    summary: "Higher-density weekly plan with short rest windows and full-body calorie burn.",
  },
  endurance: {
    sets: 3,
    reps: "15-20",
    rest: "30-45 sec",
    summary: "Muscular-endurance plan built around lighter loads, crisp pacing, and repeatable effort.",
  },
};

const experienceModifier: Record<ExperienceLevel, { setDelta: number; exerciseDelta: number }> = {
  beginner: { setDelta: -1, exerciseDelta: -1 },
  intermediate: { setDelta: 0, exerciseDelta: 0 },
  advanced: { setDelta: 1, exerciseDelta: 1 },
};

export function generateWeeklyWorkoutPlan(input: AiWorkoutInput): WeeklyWorkoutPlan {
  const config = aiGoalConfig[input.goal];
  const modifier = experienceModifier[input.experience];
  const availableEquipment = input.equipment.length ? input.equipment : (["Bodyweight"] as Equipment[]);
  const targetMuscles = input.muscles.length ? input.muscles : (["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"] as MuscleGroup[]);
  const filtered = exercises.filter(
    (exercise) => availableEquipment.includes(exercise.equipment) && targetMuscles.includes(exercise.muscle),
  );
  const fallback = exercises.filter((exercise) => targetMuscles.includes(exercise.muscle));
  const pool = filtered.length >= 3 ? filtered : fallback;
  const exercisesPerDay = Math.max(3, Math.min(7, Math.round(input.duration / 12) + modifier.exerciseDelta));

  const seed = input.seed ?? 0;
  const days = Array.from({ length: input.daysPerWeek }).map((_, dayIndex) => {
    const focusMuscles = rotate(targetMuscles, dayIndex + seed).slice(0, Math.min(3, targetMuscles.length));
    const dayPool = pool.filter((exercise) => focusMuscles.includes(exercise.muscle));
    const source = dayPool.length >= 2 ? dayPool : pool;
    const selected = rotate(source, dayIndex * 2 + seed).slice(0, Math.min(exercisesPerDay, source.length));

    return {
      day: dayNames[dayIndex] ?? `Day ${dayIndex + 1}`,
      focus: focusMuscles.join(" + "),
      duration: input.duration,
      exercises: selected.map((exercise, exerciseIndex) => ({
        ...exercise,
        sets: Math.max(2, config.sets + modifier.setDelta + (exerciseIndex === 0 && input.experience === "advanced" ? 1 : 0)),
        reps: config.reps,
        rest: config.rest,
      })),
    };
  });

  return {
    id: `draft-${seed}-${input.goal}-${input.experience}-${input.daysPerWeek}-${input.duration}-${availableEquipment.join(".")}-${targetMuscles.join(".")}`,
    createdAt: "",
    summary: config.summary,
    input,
    days,
  };
}

function rotate<T>(items: T[], offset: number) {
  if (!items.length) return [];
  return items.map((_, index) => items[(index + offset) % items.length]);
}

export function formatLabel(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
