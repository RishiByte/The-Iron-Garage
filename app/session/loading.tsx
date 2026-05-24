import { Skeleton } from "@/components/ui/skeleton";

export default function SessionLoading() {
  return (
    <section className="page-shell grid gap-6 py-8">
      <Skeleton className="h-44" />
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </section>
  );
}
