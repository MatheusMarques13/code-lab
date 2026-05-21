export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5" data-testid="logo-codelab">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-label="Code Lab"
        role="img"
      >
        {/* hand-drawn sticky-note style background */}
        <rect
          x="3"
          y="4"
          width="34"
          height="32"
          rx="4"
          fill="hsl(var(--sticky-yellow))"
          stroke="hsl(28 18% 22%)"
          strokeWidth="1.2"
          strokeLinecap="round"
          transform="rotate(-3 20 20)"
        />
        {/* hand-drawn brackets and slash */}
        <path
          d="M14 14 L10 20 L14 26"
          stroke="hsl(28 18% 22%)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M26 14 L30 20 L26 26"
          stroke="hsl(28 18% 22%)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M22.5 12.5 L17.5 27.5"
          stroke="hsl(var(--coral))"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-display text-2xl font-semibold text-foreground -mb-0.5">
          Code Lab
        </span>
        <span className="label-tiny text-muted-foreground">
          v2 · retromynd
        </span>
      </div>
    </div>
  );
}
