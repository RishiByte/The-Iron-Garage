import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b">
      <div className="page-shell py-10 sm:py-14">
        <Badge className="mb-4 border-primary/30 bg-primary/10 text-foreground">{eyebrow}</Badge>
        <h1 className="max-w-3xl text-4xl font-black tracking-normal sm:text-5xl">{title}</h1>
        <div className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{children}</div>
      </div>
    </section>
  );
}
