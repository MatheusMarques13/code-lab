import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useStudent } from "@/components/StudentProvider";
import { phases, getLessonsByPhase } from "@/data/lessons";
import { CheckCircle2, Circle, Lock, Sparkles, ArrowRight } from "lucide-react";

const PHASE_TINTS = ["pink", "blue", "lavender", "mint"] as const;

export default function Trilha() {
  const { currentStudent, hasAnyStudent, isLoading } = useStudent();
  if (!hasAnyStudent && !isLoading) {
    return <Layout><div className="min-h-[60vh]" /></Layout>;
  }
  const completed = new Set(currentStudent?.completedLessons ?? []);
  const currentId = currentStudent?.currentLessonId;

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-10">
          <p className="label-tiny text-muted-foreground">Sua trilha</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-2">
            Do pixel ao código de verdade
          </h1>
          <p className="font-hand text-base sm:text-lg text-muted-foreground mt-3 max-w-2xl">
            Quatro fases que te levam do primeiro desenho até criar um jogo no Roblox. Você pode espiar
            qualquer aula — mas o ideal é fazer na ordem que o professor combinar.
          </p>
        </header>

        <ol className="space-y-14">
          {phases.map((phase, phaseIdx) => {
            const phaseLessons = getLessonsByPhase(phase.id);
            const tint = PHASE_TINTS[phaseIdx];
            return (
              <li key={phase.id} className="relative" data-testid={`trilha-phase-${phase.id}`}>
                {/* Phase header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`relative z-10 h-14 w-14 rounded-lg flex items-center justify-center text-2xl shrink-0 bg-sticky-${tint} border border-card-border ${phaseIdx % 2 === 0 ? "tilt-l" : "tilt-r"}`}
                    aria-hidden
                  >
                    {phase.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="label-tiny text-muted-foreground">
                      Fase {phaseIdx + 1} · {phase.tool}
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
                      {phase.title}
                    </h2>
                    <p className="font-hand text-base text-muted-foreground mt-1">
                      {phase.description}
                    </p>
                  </div>
                </div>

                {/* Vertical stitched rail + lessons */}
                <div className="relative sm:pl-16">
                  {/* dashed hand-drawn rail */}
                  <div
                    aria-hidden
                    className="absolute left-[26px] top-0 bottom-0 w-0 border-l-2 border-dashed border-card-border hidden sm:block"
                  />
                  <ul className="space-y-3">
                    {phaseLessons.map((lesson) => {
                      const isDone = completed.has(lesson.id);
                      const isCurrent = lesson.id === currentId;
                      const isDraft = lesson.status === "draft";

                      return (
                        <li key={lesson.id} className="relative">
                          {/* Hand-drawn wobbly circle around current lesson marker */}
                          {isCurrent && (
                            <svg
                              aria-hidden
                              className="absolute -left-1.5 -top-1.5 hidden sm:block"
                              width="60"
                              height="60"
                              style={{ filter: "url(#rough)" }}
                            >
                              <circle
                                cx="30"
                                cy="30"
                                r="22"
                                fill="none"
                                stroke="hsl(var(--coral))"
                                strokeWidth="2.5"
                                strokeDasharray="3 3"
                              />
                            </svg>
                          )}

                          <Link
                            href={`/aula/${lesson.id}`}
                            data-testid={`link-lesson-${lesson.id}`}
                            className="block"
                          >
                            <div
                              className={[
                                "sticky-card p-4 sm:p-5 hover-elevate transition-colors flex items-start gap-4",
                                isCurrent ? "border-coral" : "",
                              ].join(" ")}
                              style={isCurrent ? { borderColor: "hsl(var(--coral))" } : undefined}
                            >
                              <span className="shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-lg bg-sticky-yellow-soft border border-card-border">
                                {isDone ? (
                                  <CheckCircle2 className="h-5 w-5 text-coral" />
                                ) : isCurrent ? (
                                  <ArrowRight className="h-5 w-5 text-coral" />
                                ) : isDraft ? (
                                  <Lock className="h-4 w-4 text-muted-foreground/60" strokeWidth={1.8} />
                                ) : (
                                  <Circle className="h-5 w-5 text-muted-foreground/40" />
                                )}
                              </span>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="label-tiny text-muted-foreground">
                                    Aula {lesson.number.toString().padStart(2, "0")}
                                  </span>
                                  {isCurrent && (
                                    <span className="pill-badge">Você está aqui</span>
                                  )}
                                  {isDone && (
                                    <span className="pill-badge bg-sticky-mint-soft" style={{ color: "hsl(152 50% 30%)" }}>
                                      Concluída
                                    </span>
                                  )}
                                  {isDraft && (
                                    <span className="pill-badge bg-muted text-muted-foreground" style={{ color: "hsl(var(--muted-foreground))", backgroundColor: "hsl(var(--muted))" }}>
                                      Em breve
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-display font-semibold text-lg sm:text-xl leading-tight mt-1">
                                  {lesson.title}
                                </h3>
                                <p className="font-hand text-sm sm:text-base text-muted-foreground mt-1 line-clamp-2">
                                  {lesson.summary}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 sticky-card p-5 sm:p-6 flex items-start gap-3 relative" style={{ backgroundColor: "hsl(var(--sticky-yellow-soft))" }}>
          <span className="pill-badge absolute top-4 right-4">Spoiler</span>
          <Sparkles className="h-5 w-5 mt-0.5 shrink-0 text-coral" />
          <p className="font-hand text-base text-foreground/80">
            Cada fase tem um <strong>projeto final</strong> — no fim, você sai com um jogo de verdade
            que dá pra mostrar pra família e pros amigos.
          </p>
        </div>
      </section>
    </Layout>
  );
}
