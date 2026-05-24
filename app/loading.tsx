import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="page-shell grid gap-6 py-8">
      <div className="grid gap-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-80" />
    </section>
  );
}
