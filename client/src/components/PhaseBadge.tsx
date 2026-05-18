import type { PhaseColor } from "@/data/lessons";

export function phaseClasses(color: PhaseColor) {
  switch (color) {
    case "mint":
      return {
        bg: "bg-mint",
        bgSoft: "bg-mint-soft",
        text: "text-foreground",
        ring: "ring-mint",
        border: "border-mint",
        rail: "bg-mint",
      };
    case "lavender":
      return {
        bg: "bg-lavender",
        bgSoft: "bg-lavender-soft",
        text: "text-foreground",
        ring: "ring-lavender",
        border: "border-lavender",
        rail: "bg-lavender",
      };
    case "peach":
      return {
        bg: "bg-peach",
        bgSoft: "bg-peach-soft",
        text: "text-foreground",
        ring: "ring-peach",
        border: "border-peach",
        rail: "bg-peach",
      };
  }
}

export function PhaseChip({
  color,
  emoji,
  label,
  size = "md",
}: {
  color: PhaseColor;
  emoji?: string;
  label: string;
  size?: "sm" | "md";
}) {
  const c = phaseClasses(color);
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        c.bgSoft,
        c.text,
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
      ].join(" ")}
    >
      {emoji && <span aria-hidden>{emoji}</span>}
      {label}
    </span>
  );
}
