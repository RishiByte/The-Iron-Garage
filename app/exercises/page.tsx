"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dumbbell, Eye, Heart, Play, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { exercises, muscleGroups, type Exercise } from "@/data/exercises";
import { useLocalStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";

const equipmentOptions = ["All", "Barbell", "Dumbbell", "Cable", "Machine", "Bodyweight"] as const;
const emptyFavorites: string[] = [];

export default function ExerciseLibraryPage() {
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState<(typeof muscleGroups)[number]>("All");
  const [equipment, setEquipment] = useState<(typeof equipmentOptions)[number]>("All");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [favorites, setFavorites] = useLocalStorage<string[]>("fitforge-favorite-exercises", emptyFavorites);

  const filtered = useMemo(() => {
    return exercises.filter((exercise) => {
      const searchable = `${exercise.name} ${exercise.muscle} ${exercise.equipment} ${exercise.level}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesMuscle = muscle === "All" || exercise.muscle === muscle;
      const matchesEquipment = equipment === "All" || exercise.equipment === equipment;
      return matchesQuery && matchesMuscle && matchesEquipment;
    });
  }, [equipment, muscle, query]);

  function toggleFavorite(id: string) {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <>
      <PageHero eyebrow="Exercise Library" title="Search, filter, and save your go-to movements.">
        Explore gym exercises by muscle group and equipment, open detailed cues, and keep favorites stored locally.
      </PageHero>

      <section className="page-shell py-8">
        <div className="glass-panel mb-6 rounded-lg p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
            <label className="relative">
              <span className="sr-only">Search exercises</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by exercise, muscle, equipment, level"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <Select value={muscle} onChange={(event) => setMuscle(event.target.value as (typeof muscleGroups)[number])}>
              {muscleGroups.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <Select value={equipment} onChange={(event) => setEquipment(event.target.value as (typeof equipmentOptions)[number])}>
              {equipmentOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge className="border-primary/30 bg-primary/10 text-foreground">
              <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 text-primary" />
              {filtered.length} results
            </Badge>
            <Badge>{favorites.length} favorites</Badge>
            <Badge>{muscle} muscle</Badge>
            <Badge>{equipment} equipment</Badge>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title="No exercises found"
            description="Try a different search, muscle group, or equipment filter."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.025 }}
              >
                <ExerciseCard
                  exercise={exercise}
                  favorite={favorites.includes(exercise.id)}
                  onFavorite={() => toggleFavorite(exercise.id)}
                  onOpen={() => setSelectedExercise(exercise)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <ExerciseModal
        exercise={selectedExercise}
        favorite={selectedExercise ? favorites.includes(selectedExercise.id) : false}
        onFavorite={() => selectedExercise && toggleFavorite(selectedExercise.id)}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}

function ExerciseCard({
  exercise,
  favorite,
  onFavorite,
  onOpen,
}: {
  exercise: Exercise;
  favorite: boolean;
  onFavorite: () => void;
  onOpen: () => void;
}) {
  return (
    <Card className="glass-panel group h-full overflow-hidden bg-card/80 transition duration-300 hover:-translate-y-1 hover:border-primary/50">
      <DemoPlaceholder exercise={exercise} compact />
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="leading-tight">{exercise.name}</CardTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="border-primary/30 bg-primary/10 text-foreground">{exercise.muscle}</Badge>
              <Badge>{exercise.equipment}</Badge>
              <Badge>{exercise.level}</Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={onFavorite}
            aria-label={favorite ? "Remove favorite" : "Add favorite"}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition",
              favorite ? "border-accent bg-accent text-accent-foreground" : "bg-background hover:bg-muted",
            )}
          >
            <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="min-h-10 text-sm leading-5 text-muted-foreground">{exercise.cues[0]}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onOpen}>
            <Eye className="h-4 w-4" /> Details
          </Button>
          <Button onClick={onFavorite} variant={favorite ? "accent" : "secondary"}>
            <Star className={cn("h-4 w-4", favorite && "fill-current")} /> {favorite ? "Saved" : "Favorite"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExerciseModal({
  exercise,
  favorite,
  onFavorite,
  onClose,
}: {
  exercise: Exercise | null;
  favorite: boolean;
  onFavorite: () => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {exercise ? (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-background/70 p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${exercise.name} details`}
            className="max-h-[90svh] w-full max-w-4xl overflow-auto rounded-lg border bg-card shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid lg:grid-cols-[1.05fr_.95fr]">
              <DemoPlaceholder exercise={exercise} />
              <div className="p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <Badge className="mb-3 border-primary/30 bg-primary/10 text-foreground">{exercise.level}</Badge>
                    <h2 className="text-3xl font-black tracking-normal">{exercise.name}</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge>{exercise.muscle}</Badge>
                      <Badge>{exercise.equipment}</Badge>
                    </div>
                  </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close exercise details">
            <X className="h-5 w-5" />
          </Button>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-lg border bg-muted/35 p-4">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Coaching cues</p>
                    <ul className="mt-3 grid gap-3 text-sm leading-6 text-muted-foreground">
                      {exercise.cues.map((cue) => (
                        <li key={cue} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {cue}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <ModalMetric label="Muscle" value={exercise.muscle} />
                    <ModalMetric label="Gear" value={exercise.equipment} />
                    <ModalMetric label="Level" value={exercise.level} />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="flex-1" onClick={onFavorite} variant={favorite ? "accent" : "default"}>
                      <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
                      {favorite ? "Remove favorite" : "Save favorite"}
                    </Button>
                    <Button className="flex-1" variant="outline" onClick={onClose}>
                      Close details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DemoPlaceholder({ exercise, compact = false }: { exercise: Exercise; compact?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-foreground text-background dark:bg-white dark:text-slate-950",
        compact ? "h-44" : "min-h-72 lg:min-h-full",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,.45),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(20,184,166,.35),transparent_30%),linear-gradient(135deg,rgba(244,63,94,.22),transparent_45%)]" />
      <div className="absolute inset-x-6 top-6 flex items-center justify-between">
        <Badge className="border-background/20 bg-background/10 text-background dark:text-slate-950">Demo placeholder</Badge>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/15">
          <Play className="h-4 w-4 fill-current" />
        </div>
      </div>
      <div className="absolute bottom-6 left-6 right-6">
        <div className="mb-5 grid h-24 grid-cols-3 items-end gap-2 opacity-80">
          <span className="h-12 rounded-md bg-background/20" />
          <span className="h-24 rounded-md bg-primary" />
          <span className="h-16 rounded-md bg-background/20" />
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] opacity-70">{exercise.muscle} movement</p>
        <p className="mt-1 text-2xl font-black tracking-normal">{exercise.name}</p>
      </div>
    </div>
  );
}

function ModalMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="font-black">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
