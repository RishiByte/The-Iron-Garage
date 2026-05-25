import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ExerciseVideoProps = {
  name: string;
  videoId: string;
  videoCredit: string;
  compact?: boolean;
  interactive?: boolean;
};

export function ExerciseVideo({ name, videoId, videoCredit, compact = false, interactive = true }: ExerciseVideoProps) {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-foreground text-background dark:bg-white dark:text-slate-950",
        compact ? "h-44" : "min-h-72 lg:min-h-full",
      )}
    >
      {interactive ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={`${name} exercise demo video`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          <img src={thumbnailUrl} alt={`${name} exercise demo`} className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/20" />
          <a
            href={watchUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-0 grid place-items-center transition hover:bg-black/15"
            aria-label={`Play ${name} video on YouTube`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition hover:scale-105">
              <Play className="h-6 w-6 fill-current" />
            </span>
          </a>
        </>
      )}

      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between gap-3">
        <Badge className="border-background/20 bg-background/80 text-foreground">Video demo</Badge>
        <Badge className="border-background/20 bg-background/80 text-foreground">{videoCredit}</Badge>
      </div>

    </div>
  );
}
