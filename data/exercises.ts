export type Exercise = {
  id: string;
  name: string;
  muscle: "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core";
  equipment: "Barbell" | "Dumbbell" | "Cable" | "Machine" | "Bodyweight";
  level: "Beginner" | "Intermediate" | "Advanced";
  cues: string[];
};

export const exercises: Exercise[] = [
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    muscle: "Chest",
    equipment: "Barbell",
    level: "Intermediate",
    cues: ["Set shoulder blades back", "Lower under control", "Drive feet into floor"],
  },
  {
    id: "incline-db-press",
    name: "Incline Dumbbell Press",
    muscle: "Chest",
    equipment: "Dumbbell",
    level: "Beginner",
    cues: ["Use a 30 degree incline", "Keep wrists stacked", "Squeeze at the top"],
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscle: "Back",
    equipment: "Cable",
    level: "Beginner",
    cues: ["Pull elbows to ribs", "Pause at chest", "Avoid leaning back too far"],
  },
  {
    id: "barbell-row",
    name: "Barbell Row",
    muscle: "Back",
    equipment: "Barbell",
    level: "Intermediate",
    cues: ["Hinge with flat back", "Row to lower ribs", "Control the negative"],
  },
  {
    id: "squat",
    name: "Back Squat",
    muscle: "Legs",
    equipment: "Barbell",
    level: "Intermediate",
    cues: ["Brace before descent", "Knees track toes", "Stand tall through hips"],
  },
  {
    id: "leg-press",
    name: "Leg Press",
    muscle: "Legs",
    equipment: "Machine",
    level: "Beginner",
    cues: ["Full foot on platform", "Do not lock knees", "Control depth"],
  },
  {
    id: "shoulder-press",
    name: "Seated Shoulder Press",
    muscle: "Shoulders",
    equipment: "Dumbbell",
    level: "Beginner",
    cues: ["Ribs down", "Press slightly inward", "Lower to ear level"],
  },
  {
    id: "lateral-raise",
    name: "Cable Lateral Raise",
    muscle: "Shoulders",
    equipment: "Cable",
    level: "Beginner",
    cues: ["Lead with elbows", "Stop at shoulder height", "Keep tension constant"],
  },
  {
    id: "curl",
    name: "Incline Dumbbell Curl",
    muscle: "Arms",
    equipment: "Dumbbell",
    level: "Beginner",
    cues: ["Keep elbows back", "No swinging", "Supinate hard at top"],
  },
  {
    id: "triceps-pushdown",
    name: "Rope Triceps Pushdown",
    muscle: "Arms",
    equipment: "Cable",
    level: "Beginner",
    cues: ["Pin elbows to sides", "Split rope at bottom", "Slow return"],
  },
  {
    id: "plank",
    name: "Weighted Plank",
    muscle: "Core",
    equipment: "Bodyweight",
    level: "Intermediate",
    cues: ["Squeeze glutes", "Brace abs", "Keep neck neutral"],
  },
  {
    id: "hanging-raise",
    name: "Hanging Knee Raise",
    muscle: "Core",
    equipment: "Bodyweight",
    level: "Intermediate",
    cues: ["Tuck pelvis", "Avoid swinging", "Control each rep"],
  },
];

export const muscleGroups = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"] as const;
