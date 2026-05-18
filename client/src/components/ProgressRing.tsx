import type { PhaseColor } from "@/data/lessons";

interface Props {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  color?: PhaseColor;
  label?: string;
}

const COLOR_VAR: Record<PhaseColor, string> = {
  mint: "hsl(var(--mint))",
  lavender: "hsl(var(--lavender))",
  peach: "hsl(var(--peach))",
};

export function ProgressRing({
  value,
  size = 72,
  stroke = 8,
  color = "mint",
  label,
}: Props) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, value));
  const offset = circ * (1 - clamped);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={COLOR_VAR[color]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-semibold text-base leading-none">
          {Math.round(clamped * 100)}%
        </span>
        {label && <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</span>}
      </div>
    </div>
  );
}
