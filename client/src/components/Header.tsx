import { Link, useLocation } from "wouter";
import { Logo } from "./Logo";
import { useTheme } from "./ThemeProvider";
import { useStudent } from "./StudentProvider";
import { Moon, Sun, ChevronDown, UserPlus, Map, Home as HomeIcon, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { NewStudentDialog } from "./NewStudentDialog";

const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function todayLabel(): string {
  const d = new Date();
  const wd = WEEKDAYS[d.getDay()];
  const wdCap = wd.charAt(0).toUpperCase() + wd.slice(1);
  const mo = MONTHS[d.getMonth()];
  const moCap = mo.charAt(0).toUpperCase() + mo.slice(1);
  return `${wdCap}, ${d.getDate()} ${moCap} ${d.getFullYear()}`;
}

export function Header() {
  const { theme, toggle } = useTheme();
  const { students, currentStudent, setCurrentStudentId } = useStudent();
  const [location, navigate] = useLocation();
  const [newOpen, setNewOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? location === "/" : location.startsWith(path);

  return (
    <header className="sticky top-0 z-30 border-b border-card-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" data-testid="link-home-logo" className="rounded-md px-1 py-1 -ml-1">
          <Logo />
        </Link>

        {/* Center: pill nav like the reference's home/screen toggle */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-card-border bg-card px-1.5 py-1.5">
          <NavPill
            icon={<HomeIcon className="h-4 w-4" />}
            label="Início"
            active={isActive("/")}
            onClick={() => navigate("/")}
            testId="link-nav-home"
          />
          <NavPill
            icon={<Map className="h-4 w-4" />}
            label="Trilha"
            active={isActive("/trilha")}
            onClick={() => navigate("/trilha")}
            testId="link-nav-trilha"
          />
          <NavPill
            icon={<UserIcon className="h-4 w-4" />}
            label="Aluno"
            active={isActive("/aluno")}
            onClick={() => navigate("/aluno")}
            testId="link-nav-aluno"
          />
        </nav>

        <div className="flex items-center gap-2">
          {/* Date pill (hidden on small) */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-card-border bg-card px-3 py-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-coral" aria-hidden />
            <span className="font-hand text-sm text-foreground" data-testid="text-today">
              {todayLabel()}
            </span>
          </div>

          {/* Theme toggle as small icon */}
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Modo claro" : "Modo escuro"}
            data-testid="button-toggle-theme"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-card-border bg-card hover-elevate"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Student pill — sticky-note style like "math" pill in reference */}
          {currentStudent && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  data-testid="button-student-switcher"
                  className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card pl-2 pr-3 py-1.5 hover-elevate"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sticky-pink text-base" aria-hidden>
                    {currentStudent.avatarEmoji}
                  </span>
                  <span className="font-hand text-sm hidden sm:inline">{currentStudent.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-hand">Alunos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {students.map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => setCurrentStudentId(s.id)}
                    data-testid={`menuitem-student-${s.id}`}
                    className="gap-2"
                  >
                    <span className="text-lg" aria-hidden>{s.avatarEmoji}</span>
                    <span className="font-hand">{s.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setNewOpen(true)}
                  data-testid="menuitem-new-student"
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="font-hand">Novo aluno</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <NewStudentDialog open={newOpen} onOpenChange={setNewOpen} />
    </header>
  );
}

function NavPill({
  icon,
  label,
  active,
  onClick,
  testId,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
        active
          ? "bg-coral text-primary-foreground"
          : "text-foreground/75 hover:text-foreground hover:bg-sticky-pink-soft",
      ].join(" ")}
    >
      {icon}
      <span className="font-hand text-sm">{label}</span>
    </button>
  );
}
