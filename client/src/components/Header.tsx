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

export function Header() {
  const { theme, toggle } = useTheme();
  const { students, currentStudent, setCurrentStudentId } = useStudent();
  const [, navigate] = useLocation();
  const [newOpen, setNewOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" data-testid="link-home-logo" className="hover-elevate rounded-md px-1.5 py-1 -ml-1.5">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            data-testid="link-nav-home"
            className="gap-2"
          >
            <HomeIcon className="h-4 w-4" />
            Início
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/trilha")}
            data-testid="link-nav-trilha"
            className="gap-2"
          >
            <Map className="h-4 w-4" />
            Trilha
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/aluno")}
            data-testid="link-nav-aluno"
            className="gap-2"
          >
            <UserIcon className="h-4 w-4" />
            Aluno
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          {currentStudent && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full pl-2 pr-3"
                  data-testid="button-student-switcher"
                >
                  <span className="text-xl leading-none" aria-hidden>
                    {currentStudent.avatarEmoji}
                  </span>
                  <span className="font-medium hidden sm:inline">{currentStudent.name}</span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Alunos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {students.map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => setCurrentStudentId(s.id)}
                    data-testid={`menuitem-student-${s.id}`}
                    className="gap-2"
                  >
                    <span className="text-lg" aria-hidden>{s.avatarEmoji}</span>
                    <span>{s.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setNewOpen(true)}
                  data-testid="menuitem-new-student"
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Novo aluno
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={theme === "dark" ? "Modo claro" : "Modo escuro"}
            data-testid="button-toggle-theme"
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <NewStudentDialog open={newOpen} onOpenChange={setNewOpen} />
    </header>
  );
}
