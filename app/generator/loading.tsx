import { Skeleton } from "@/components/ui/skeleton";

export default function GeneratorLoading() {
  return (
    <section className="page-shell grid gap-6 py-8 xl:grid-cols-[400px_1fr]">
      <Skeleton className="h-[680px]" />
      <div className="grid gap-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </section>
  );
}
