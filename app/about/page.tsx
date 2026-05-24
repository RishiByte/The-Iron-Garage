import { Dumbbell, Lock, Smartphone } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  { icon: Dumbbell, title: "Built for gym flow", text: "Fast session generation, clean exercise cues, and practical metrics." },
  { icon: Lock, title: "Private by default", text: "There is no account system. Local data stays in the browser storage on this device." },
  { icon: Smartphone, title: "Mobile-first", text: "Designed for phones first, then scaled up for tablets and desktops." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About THE IRON GARAGE" title="A lean fitness app that gets out of the way.">
        THE IRON GARAGE is a production-ready starter for workout planning, exercise discovery, progress tracking, and quick fitness calculations. Built by Rishi Bhardwaj.
      </PageHero>
      <section className="page-shell grid gap-4 py-8 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="h-7 w-7 text-primary" />
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">{item.text}</CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
