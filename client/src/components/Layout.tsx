import { ReactNode } from "react";
import { Header } from "./Header";
import { useStudent } from "./StudentProvider";
import { NewStudentDialog } from "./NewStudentDialog";

export function Layout({ children }: { children: ReactNode }) {
  const { hasAnyStudent, isLoading } = useStudent();
  const showFirstRun = !isLoading && !hasAnyStudent;

  return (
    <div className="min-h-screen text-foreground">
      {/* Re-usable SVG filter for rough/wobbly outlines (used by Trilha arrow) */}
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="rough" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="2.5" />
          </filter>
        </defs>
      </svg>

      <Header />
      <main>{children}</main>
      <footer className="border-t border-card-border mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between gap-2">
          <p className="font-hand text-sm text-muted-foreground">
            Code Lab — programação pra quem pensa diferente.
          </p>
          <p className="font-hand text-sm text-muted-foreground">
            feito com ✏️ + 💚 pelo prof. Matheus.
          </p>
        </div>
      </footer>
      <NewStudentDialog open={showFirstRun} onOpenChange={() => {}} forced />
    </div>
  );
}
