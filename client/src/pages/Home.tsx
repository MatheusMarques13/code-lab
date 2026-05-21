import { Link } from "wouter";
import { useStudent } from "@/components/StudentProvider";
import { phases, lessons, getLesson, getPhase, getLessonsByPhase } from "@/data/lessons";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Pencil, Star, Gamepad2 } from "lucide-react";

export default function Home() {
  const { currentStudent, isLoading, hasAnyStudent } = useStudent();

  if (!hasAnyStudent && !isLoading) {
    return <Layout><div className="min-h-[60vh]" /></Layout>;
  }

  if (!currentStudent) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <p className="font-hand text-muted-foreground">Carregando seu cantinho do Code Lab…</p>
        </div>
      </Layout>
    );
  }

  const completed = new Set(currentStudent.completedLessons);
  const currentLesson = getLesson(currentStudent.currentLessonId) ?? lessons[0];
  const currentPhase = getPhase(currentLesson.phaseId);
  const totalCompleted = currentStudent.completedLessons.length;

  // Streak ≈ totalCompleted for now (we don't track day-by-day yet)
  const streak = Math.max(1, totalCompleted || 1);
  // Bonus "challenges" — count of lessons completed that have a bonus (proxy for now)
  const desafios = totalCompleted;
  // "Projects" — count of phase-final lessons (10 and 16) completed
  const projetos = ["aula-10", "aula-16", "aula-21"].filter((id) => completed.has(id)).length;

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Title row — like reference's "Study Hub / RETROMYND" */}
        <div className="flex items-end justify-between gap-3 mb-6 flex-wrap">
          <div>
            <h1
              className="font-display text-4xl sm:text-5xl font-semibold leading-none"
              data-testid="text-home-greeting"
            >
              Oi, {currentStudent.name}{" "}
              <span aria-hidden className="text-3xl">{currentStudent.avatarEmoji}</span>
            </h1>
            <p className="label-tiny text-muted-foreground mt-2 ml-1">
              Programação para quem pensa diferente
            </p>
          </div>
        </div>

        {/* Stat cards row — like reference's streak/notas/metas/pomodoros */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Flame className="h-4 w-4" />}
            tint="pink"
            value={String(streak)}
            label="Streak"
            testId="stat-streak"
          />
          <StatCard
            icon={<Pencil className="h-4 w-4" />}
            tint="blue"
            value={String(totalCompleted)}
            label="Aulas feitas"
            testId="text-total-completed"
          />
          <StatCard
            icon={<Star className="h-4 w-4" />}
            tint="lavender"
            value={`${desafios}/${lessons.length}`}
            label="Desafios"
            testId="stat-desafios"
          />
          <StatCard
            icon={<Gamepad2 className="h-4 w-4" />}
            tint="mint"
            value={String(projetos)}
            label="Projetos"
            testId="stat-projetos"
          />
        </div>

        {/* Continue card — sticky-note style */}
        <div className="mt-6 sticky-card p-6 sm:p-8 relative">
          <span className="pill-badge absolute top-4 right-4">Próxima aula</span>

          <p className="label-tiny text-muted-foreground">Continue de onde parou</p>
          <h2
            className="font-display text-2xl sm:text-3xl font-semibold mt-1 leading-tight pr-24"
            data-testid="text-current-lesson"
          >
            {currentLesson.title}
          </h2>

          <div className="mt-3 flex items-center gap-3 flex-wrap font-hand text-sm text-muted-foreground">
            {currentPhase && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sticky-yellow-soft px-2.5 py-1">
                <span aria-hidden>{currentPhase.emoji}</span>
                {currentPhase.shortTitle}
              </span>
            )}
            <span>Aula {currentLesson.number}</span>
            <span>·</span>
            <span>{currentLesson.duration}</span>
          </div>

          <p className="text-foreground/75 mt-4 text-sm sm:text-base max-w-2xl">
            {currentLesson.summary}
          </p>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <Link href={`/aula/${currentLesson.id}`} data-testid="link-continue-lesson">
              <button className="inline-flex items-center gap-2 rounded-lg bg-coral text-primary-foreground px-5 py-2.5 font-hand text-base hover-elevate">
                Continuar
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/trilha" data-testid="link-view-trilha">
              <button className="inline-flex items-center gap-2 rounded-lg bg-sticky-blue-soft text-foreground px-4 py-2.5 font-hand text-base hover-elevate border border-card-border">
                Ver trilha completa
              </button>
            </Link>
          </div>
        </div>

        {/* Phases as sticky notes */}
        <div className="mt-10">
          <div className="flex items-end justify-between mb-4 gap-3">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold">
                Sua jornada
              </h2>
              <p className="label-tiny text-muted-foreground mt-1">
                4 fases · do pixel ao código de verdade
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, idx) => {
              const phaseLessons = getLessonsByPhase(phase.id);
              const done = phaseLessons.filter((l) => completed.has(l.id)).length;
              const total = phaseLessons.length;
              const pct = total === 0 ? 0 : Math.round((done / total) * 100);
              const tint = ["yellow", "blue", "lavender", "pink"][idx] as
                | "yellow" | "blue" | "lavender" | "pink";

              return (
                <Link
                  key={phase.id}
                  href="/trilha"
                  data-testid={`card-phase-${phase.id}`}
                >
                  <div className={`sticky-card p-5 h-full flex flex-col gap-3 hover-elevate cursor-pointer ${idx % 2 === 0 ? "tilt-l" : "tilt-r"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`h-11 w-11 rounded-lg flex items-center justify-center text-xl bg-sticky-${tint}`}
                        aria-hidden
                      >
                        {phase.emoji}
                      </div>
                      <span className="pill-badge">Fase {idx + 1}</span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-display font-semibold text-xl leading-tight">
                        {phase.title}
                      </h3>
                      <p className="font-hand text-sm text-muted-foreground mt-1">
                        {phase.tool}
                      </p>
                    </div>

                    {/* Hand-drawn progress bar */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs font-hand text-muted-foreground mb-1">
                        <span>{done}/{total} aulas</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-sticky-yellow-soft overflow-hidden border border-card-border">
                        <div
                          className={`h-full bg-coral rounded-full transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dica */}
        <div className="mt-10 sticky-card p-6 sm:p-7 relative">
          <span className="pill-badge absolute top-4 right-4">Dica</span>
          <h3 className="font-display font-semibold text-xl">Dica do dia</h3>
          <p className="font-hand text-base text-foreground/80 mt-2 max-w-3xl">
            Cada aula dura mais ou menos <strong>1h30</strong>. Faz pausas — o jogo só vai melhorando.
            Se algo ficar confuso, chama o professor!
          </p>
        </div>
      </section>
    </Layout>
  );
}

function StatCard({
  icon,
  tint,
  value,
  label,
  testId,
}: {
  icon: React.ReactNode;
  tint: "pink" | "blue" | "lavender" | "mint";
  value: string;
  label: string;
  testId?: string;
}) {
  const bgClass = {
    pink: "bg-sticky-pink-soft",
    blue: "bg-sticky-blue-soft",
    lavender: "bg-sticky-lavender-soft",
    mint: "bg-sticky-mint-soft",
  }[tint];
  return (
    <div className="sticky-card p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${bgClass}`} aria-hidden>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-display text-3xl font-semibold leading-none" data-testid={testId}>
          {value}
        </p>
        <p className="label-tiny text-muted-foreground mt-1.5">{label}</p>
      </div>
    </div>
  );
}
