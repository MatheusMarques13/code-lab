export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2" data-testid="logo-codelab">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-label="Code Lab"
        role="img"
      >
        <rect width="32" height="32" rx="8" fill="hsl(var(--mint))" />
        <path
          d="M11 11L7 16L11 21"
          stroke="hsl(var(--foreground))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 11L25 16L21 21"
          stroke="hsl(var(--foreground))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 9L14 23"
          stroke="hsl(var(--lavender))"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display font-semibold text-lg tracking-tight">
        Code Lab
      </span>
    </div>
  );
}
