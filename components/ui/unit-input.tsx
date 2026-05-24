import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type UnitInputProps = InputProps & {
  unit: string;
};

export function UnitInput({ unit, className, ...props }: UnitInputProps) {
  return (
    <div className="relative">
      <Input className={cn("pr-14", className)} {...props} />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
        {unit}
      </span>
    </div>
  );
}
