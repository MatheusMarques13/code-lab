import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useStudent } from "@/components/StudentProvider";
import { phases, getLessonsByPhase } from "@/data/lessons";
import { phaseClasses, PhaseChip } from "@/components/PhaseBadge";
import { CheckCircle2, Circle, Lock, Sparkles } from "lucide-react";

export default function Trilha() {
  const { currentStudent, hasAnyStudent, isLoading } = useStudent();
  if (!hasAnyStudent && !isLoading) {
    return <Layout><div className="min-h-[60vh]" /></Layout>;
  }
  const completed = new Set(currentStudent?.completedLessons ?? []);
  const currentId = currentStudent?.currentLessonId;

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        <header className="mb-10">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            Sua trilha
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-2">
            Do pixel ao código de verdade
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Quatro fases que te levam do primeiro desenho até criar um jogo no Roblox. Você pode espiar
            qualquer aula — mas dá pra fazer na ordem que o professor combinar.
          </p>
        </header>

        <div className="relative">
          {/* vertical rail */}
          <div
            aria-hidden
            className="absolute left-[18px] top-2 bottom-2 w-1 rounded-full bg-muted hidden sm:block"
          />

          <ol className="space-y-12">
            {phases.map((phase, phaseIdx) => {
              const phaseLessons = getLessonsByPhase(phase.id);
              const c = phaseClasses(phase.color);
              return (
                <li key={phase.id} className="relative" data-testid={`trilha-phase-${phase.id}`}>
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className={[
                        "relative z-10 h-10 w-10 rounded-2xl flex items-center justify-center text-xl shrink-0",
                        c.bg,
                      ].join(" ")}
                      aria-hidden
                    >
                      {phase.emoji}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Fase {phaseIdx + 1} · {phase.tool}
                      </p>
                      <h2 className="font-display text-xl sm:text-2xl font-semibold leading-tight">
                        {phase.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 sm:ml-14">
                    {phaseLessons.map((lesson) => {
                      const isDone = completed.has(lesson.id);
                      const isCurrent = lesson.id === currentId;
                      const isDraft = lesson.status === "draft";

                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/aula/${lesson.id}`}
                            data-testid={`link-lesson-${lesson.id}`}
                            className={[
                              "block rounded-2xl border bg-card p-4 sm:p-5 hover-elevate transition-colors",
                              isCurrent ? "border-mint glow-mint" : "border-card-border",
                            ].join(" ")}
                          >
                            <div className="flex items-start gap-4">
                              <span className="mt-0.5 shrink-0">
                                {isDone ? (
                                  <CheckCircle2 className="h-6 w-6 text-mint fill-mint-soft" />
                                ) : isCurrent ? (
                                  <span className="relative inline-flex">
                                    <span className="absolute inset-0 rounded-full bg-mint/40 blur-sm" />
                                    <Circle className="relative h-6 w-6 text-mint" strokeWidth={2.5} />
                                  </span>
                                ) : isDraft ? (
                                  <Lock className="h-6 w-6 text-muted-foreground/60" strokeWidth={1.8} />
                                ) : (
                                  <Circle className="h-6 w-6 text-muted-foreground/60" />
                                )}
                              </span>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-mono text-muted-foreground">
                                    Aula {lesson.number.toString().padStart(2, "0")}
                                  </span>
                                  {isCurrent && (
                                    <PhaseChip color={phase.color} label="Você está aqui" size="sm" />
                                  )}
                                  {isDone && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-mint-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                                      Concluída
                                    </span>
                                  )}
                                  {isDraft && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                      Em breve
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-display font-semibold text-base sm:text-lg leading-tight mt-1">
                                  {lesson.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {lesson.summary}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 rounded-2xl border border-card-border bg-peach-soft p-6 flex items-start gap-3">
          <Sparkles className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="text-sm text-foreground/80">
            Cada fase tem um <strong>projeto final</strong> — no fim, você sai com um jogo de verdade
            que dá pra mostrar pra família e pros amigos.
          </p>
        </div>
      </section>
    </Layout>
  );
}
