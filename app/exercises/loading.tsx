import { Skeleton } from "@/components/ui/skeleton";

export default function ExercisesLoading() {
  return (
    <section className="page-shell py-8">
      <Skeleton className="mb-6 h-28" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-96" />
        ))}
      </div>
    </section>
  );
}
