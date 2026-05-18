import { ReactNode } from "react";
import { Header } from "./Header";
import { useStudent } from "./StudentProvider";
import { NewStudentDialog } from "./NewStudentDialog";

export function Layout({ children }: { children: ReactNode }) {
  const { hasAnyStudent, isLoading } = useStudent();
  const showFirstRun = !isLoading && !hasAnyStudent;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>{children}</main>
      <footer className="border-t border-border mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <p>Code Lab — Programação para crianças que pensam diferente.</p>
          <p>Feito com 🧠 + 💚 pelo prof. Matheus.</p>
        </div>
      </footer>
      <NewStudentDialog open={showFirstRun} onOpenChange={() => {}} forced />
    </div>
  );
}
