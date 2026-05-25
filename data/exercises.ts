export type Exercise = {
  id: string;
  name: string;
  muscle: "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core";
  equipment: "Barbell" | "Dumbbell" | "Cable" | "Machine" | "Bodyweight";
  level: "Beginner" | "Intermediate" | "Advanced";
  cues: string[];
  videoId: string;
  videoCredit: string;
};

export const exercises: Exercise[] = [
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    muscle: "Chest",
    equipment: "Barbell",
    level: "Intermediate",
    cues: ["Set shoulder blades back", "Lower under control", "Drive feet into floor"],
    videoId: "CayG6UYqL8g",
    videoCredit: "NASM",
  },
  {
    id: "incline-db-press",
    name: "Incline Dumbbell Press",
    muscle: "Chest",
    equipment: "Dumbbell",
    level: "Beginner",
    cues: ["Use a 30 degree incline", "Keep wrists stacked", "Squeeze at the top"],
    videoId: "JKnpHchOWPU",
    videoCredit: "NASM",
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscle: "Back",
    equipment: "Cable",
    level: "Beginner",
    cues: ["Pull elbows to ribs", "Pause at chest", "Avoid leaning back too far"],
    videoId: "D8b3OVbRfwE",
    videoCredit: "QMSU",
  },
  {
    id: "barbell-row",
    name: "Barbell Row",
    muscle: "Back",
    equipment: "Barbell",
    level: "Intermediate",
    cues: ["Hinge with flat back", "Row to lower ribs", "Control the negative"],
    videoId: "FWJR5Ve8bnQ",
    videoCredit: "ScottHermanFitness",
  },
  {
    id: "squat",
    name: "Back Squat",
    muscle: "Legs",
    equipment: "Barbell",
    level: "Intermediate",
    cues: ["Brace before descent", "Knees track toes", "Stand tall through hips"],
    videoId: "3tn-xqyUUkQ",
    videoCredit: "BarBend",
  },
  {
    id: "leg-press",
    name: "Leg Press",
    muscle: "Legs",
    equipment: "Machine",
    level: "Beginner",
    cues: ["Full foot on platform", "Do not lock knees", "Control depth"],
    videoId: "IZxyjW7MPJQ",
    videoCredit: "ScottHermanFitness",
  },
  {
    id: "shoulder-press",
    name: "Seated Shoulder Press",
    muscle: "Shoulders",
    equipment: "Dumbbell",
    level: "Beginner",
    cues: ["Ribs down", "Press slightly inward", "Lower to ear level"],
    videoId: "qEwKCR5JCog",
    videoCredit: "ScottHermanFitness",
  },
  {
    id: "lateral-raise",
    name: "Cable Lateral Raise",
    muscle: "Shoulders",
    equipment: "Cable",
    level: "Beginner",
    cues: ["Lead with elbows", "Stop at shoulder height", "Keep tension constant"],
    videoId: "Sp8be0IFNvk",
    videoCredit: "BarBend",
  },
  {
    id: "curl",
    name: "Incline Dumbbell Curl",
    muscle: "Arms",
    equipment: "Dumbbell",
    level: "Beginner",
    cues: ["Keep elbows back", "No swinging", "Supinate hard at top"],
    videoId: "soxrZlIl35U",
    videoCredit: "ScottHermanFitness",
  },
  {
    id: "triceps-pushdown",
    name: "Rope Triceps Pushdown",
    muscle: "Arms",
    equipment: "Cable",
    level: "Beginner",
    cues: ["Pin elbows to sides", "Split rope at bottom", "Slow return"],
    videoId: "vB5OHsJ3EME",
    videoCredit: "ScottHermanFitness",
  },
  {
    id: "plank",
    name: "Weighted Plank",
    muscle: "Core",
    equipment: "Bodyweight",
    level: "Intermediate",
    cues: ["Squeeze glutes", "Brace abs", "Keep neck neutral"],
    videoId: "pSHjTRCQxIw",
    videoCredit: "Bowflex",
  },
  {
    id: "hanging-raise",
    name: "Hanging Knee Raise",
    muscle: "Core",
    equipment: "Bodyweight",
    level: "Intermediate",
    cues: ["Tuck pelvis", "Avoid swinging", "Control each rep"],
    videoId: "fLbZrF6MZuE",
    videoCredit: "BarBend",
  },
];

export const muscleGroups = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"] as const;
