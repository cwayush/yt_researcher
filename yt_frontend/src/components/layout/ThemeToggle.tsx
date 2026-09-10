import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/themeContext";
import { cn } from "@/lib/utils";
import { ThemePreference } from "@/types";

const ICONS: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS: Record<ThemePreference, string> = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, cycleTheme } = useTheme();
  const Icon = ICONS[theme];

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={`${LABELS[theme]}, click to change`}
      aria-label={`${LABELS[theme]}. Click to change theme.`}
      className={cn(
        "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
        "rounded-control inline-flex h-8 w-8 cursor-pointer items-center justify-center",
        "transition-colors duration-150",
        "focus-visible:outline-primary-accent focus-visible:outline-2 focus-visible:outline-offset-2",
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
