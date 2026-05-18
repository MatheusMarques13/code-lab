import { Link } from "wouter";
import { useStudent } from "@/components/StudentProvider";
import { phases, lessons, getLesson, getPhase, getLessonsByPhase } from "@/data/lessons";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ProgressRing";
import { PhaseChip, phaseClasses } from "@/components/PhaseBadge";
import { ArrowRight, Sparkles, Map as MapIcon, Trophy } from "lucide-react";

export default function Home() {
  const { currentStudent, isLoading, hasAnyStudent } = useStudent();

  // First-run: modal is showing; render empty layout so we don't show contradictory loading text.
  if (!hasAnyStudent && !isLoading) {
    return <Layout><div className="min-h-[60vh]" /></Layout>;
  }

  if (!currentStudent) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <p className="text-muted-foreground">Carregando seu cantinho do Code Lab…</p>
        </div>
      </Layout>
    );
  }

  const completed = new Set(currentStudent.completedLessons);
  const currentLesson = getLesson(currentStudent.currentLessonId) ?? lessons[0];
  const currentPhase = getPhase(currentLesson.phaseId);
  const totalCompleted = currentStudent.completedLessons.length;

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        {/* Hero */}
        <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-10 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-mint-soft opacity-60 blur-2xl"
          />
          <div
            aria-hidden
            className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-lavender-soft opacity-50 blur-2xl"
          />
          <div className="relative">
            <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
              Bem-vindo de volta
            </p>
            <h1
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-2 leading-tight"
              data-testid="text-home-greeting"
            >
              Oi,{" "}
              <span className="inline-flex items-baseline gap-2">
                {currentStudent.name}
                <span className="text-3xl sm:text-4xl" aria-hidden>
                  {currentStudent.avatarEmoji}
                </span>
              </span>
              !
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-xl">
              Pronto pra próxima aula? Hoje a gente continua na trilha de programação criativa.
            </p>
          </div>
        </div>

        {/* Continue card */}
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {currentPhase && (
                  <PhaseChip
                    color={currentPhase.color}
                    emoji={currentPhase.emoji}
                    label={currentPhase.shortTitle}
                    size="sm"
                  />
                )}
                <span className="text-xs text-muted-foreground">Aula {currentLesson.number} · {currentLesson.duration}</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold mt-2" data-testid="text-current-lesson">
                {currentLesson.title}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {currentLesson.summary}
              </p>
            </div>
            <Link href={`/aula/${currentLesson.id}`} data-testid="link-continue-lesson">
              <Button size="lg" className="rounded-xl gap-2 h-12 px-6">
                Continuar
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-card-border bg-peach-soft p-6 flex items-center gap-4 min-w-[220px]">
            <Trophy className="h-8 w-8 shrink-0 text-foreground" />
            <div>
              <p className="font-display text-2xl font-semibold leading-none" data-testid="text-total-completed">
                {totalCompleted}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalCompleted === 1 ? "aula concluída" : "aulas concluídas"} de {lessons.length}
              </p>
            </div>
          </div>
        </div>

        {/* Phase progress */}
        <div className="mt-10">
          <div className="flex items-end justify-between mb-4 gap-3">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold">
                Sua jornada
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Quatro fases pra dominar do desenho ao código de verdade.
              </p>
            </div>
            <Link href="/trilha" data-testid="link-view-trilha">
              <Button variant="ghost" size="sm" className="gap-2">
                <MapIcon className="h-4 w-4" />
                Ver trilha completa
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase) => {
              const phaseLessons = getLessonsByPhase(phase.id);
              const done = phaseLessons.filter((l) => completed.has(l.id)).length;
              const pct = phaseLessons.length === 0 ? 0 : done / phaseLessons.length;
              const c = phaseClasses(phase.color);

              return (
                <div
                  key={phase.id}
                  data-testid={`card-phase-${phase.id}`}
                  className="rounded-2xl border border-card-border bg-card p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={[
                        "h-10 w-10 rounded-xl flex items-center justify-center text-xl",
                        c.bgSoft,
                      ].join(" ")}
                      aria-hidden
                    >
                      {phase.emoji}
                    </div>
                    <ProgressRing value={pct} color={phase.color} size={56} stroke={6} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Fase {phases.indexOf(phase) + 1}
                    </p>
                    <h3 className="font-display font-semibold text-base mt-0.5 leading-tight">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2">
                      {done}/{phaseLessons.length} aulas · {phase.tool}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips strip */}
        <div className="mt-10 rounded-2xl border border-card-border bg-lavender-soft p-6 sm:p-8 flex gap-4 items-start">
          <Sparkles className="h-6 w-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-semibold text-lg">Dica do dia</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Cada aula dura mais ou menos <strong>1h30</strong>. Tá tudo bem fazer pausas — o jogo só vai melhorando.
              Se algo ficar confuso, chama o professor!
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
