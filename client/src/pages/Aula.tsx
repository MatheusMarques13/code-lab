import { useMemo } from "react";
import { Link, useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { useStudent, useUpdateStudent } from "@/components/StudentProvider";
import { getLesson, getPhase, getNextLesson, getPrevLesson } from "@/data/lessons";
import { PhaseChip, phaseClasses } from "@/components/PhaseBadge";
import { VideoWithChapters } from "@/components/VideoWithChapters";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Construction, ExternalLink, Sparkles, Trophy, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const blockMeta = [
  { key: "abertura", emoji: "🎬", label: "Abertura", duration: "5 min", color: "bg-mint" },
  { key: "guiado", emoji: "📖", label: "Conteúdo guiado", duration: "30 min", color: "bg-lavender" },
  { key: "maoNaMassa", emoji: "🛠️", label: "Mão na massa", duration: "40 min", color: "bg-peach" },
  { key: "desafio", emoji: "⭐", label: "Desafio extra", duration: "10 min", color: "bg-mint" },
  { key: "entrega", emoji: "🎁", label: "Entrega", duration: "5 min", color: "bg-lavender" },
] as const;

function scrollToBlock(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Aula() {
  const [, params] = useRoute<{ id: string }>("/aula/:id");
  const lessonId = params?.id ?? "";
  const lesson = getLesson(lessonId);
  const phase = lesson ? getPhase(lesson.phaseId) : undefined;
  const next = lesson ? getNextLesson(lesson.id) : undefined;
  const prev = lesson ? getPrevLesson(lesson.id) : undefined;

  const { currentStudent, hasAnyStudent, isLoading } = useStudent();
  const updateStudent = useUpdateStudent();
  const { toast } = useToast();

  const checkpointSet = useMemo(() => {
    if (!currentStudent || !lessonId) return new Set<string>();
    return new Set(currentStudent.checkpoints[lessonId] ?? []);
  }, [currentStudent, lessonId]);

  const isCompleted = currentStudent?.completedLessons.includes(lessonId) ?? false;

  if (!lesson) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Aula não encontrada</h1>
          <p className="text-muted-foreground mt-2">Volta pra trilha pra ver as aulas disponíveis.</p>
          <Link href="/trilha">
            <Button className="mt-4 rounded-xl">Ver trilha</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (!hasAnyStudent && !isLoading) {
    return <Layout><div className="min-h-[60vh]" /></Layout>;
  }

  if (!currentStudent || !phase) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <p className="text-muted-foreground">Carregando…</p>
        </div>
      </Layout>
    );
  }

  const c = phaseClasses(phase.color);

  const toggleCheckpoint = (id: string, checked: boolean) => {
    if (!currentStudent) return;
    const next = new Set(checkpointSet);
    if (checked) next.add(id);
    else next.delete(id);
    const checkpoints = {
      ...currentStudent.checkpoints,
      [lesson.id]: Array.from(next),
    };
    updateStudent.mutate({
      id: currentStudent.id,
      patch: { checkpoints, currentLessonId: lesson.id },
    });
  };

  const markComplete = () => {
    if (!currentStudent) return;
    if (isCompleted) return;
    const completed = Array.from(new Set([...currentStudent.completedLessons, lesson.id]));
    const nextLessonId = next?.id ?? lesson.id;
    updateStudent.mutate(
      { id: currentStudent.id, patch: { completedLessons: completed, currentLessonId: nextLessonId } },
      {
        onSuccess: () => {
          toast({
            title: `Aula ${lesson.number} concluída! 🎉`,
            description: next ? `Próximo: ${next.title}` : "Você terminou todas as aulas disponíveis!",
          });
        },
      }
    );
  };

  const totalCheckpoints = lesson.handsOn?.checkpoints.length ?? 0;
  const doneCheckpoints = lesson.handsOn?.checkpoints.filter((cp) => checkpointSet.has(cp.id)).length ?? 0;

  return (
    <Layout>
      <article className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
        {/* breadcrumb */}
        <nav className="text-sm text-muted-foreground flex items-center gap-2 mb-4 flex-wrap">
          <Link href="/" data-testid="link-back-home" className="hover:text-foreground hover-elevate rounded-md px-1.5 py-0.5">
            Início
          </Link>
          <span aria-hidden>/</span>
          <Link href="/trilha" data-testid="link-back-trilha" className="hover:text-foreground hover-elevate rounded-md px-1.5 py-0.5">
            Trilha
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground/80">Aula {lesson.number}</span>
        </nav>

        {/* Header */}
        <header className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 relative overflow-hidden">
          <div aria-hidden className={`absolute -right-12 -top-12 h-48 w-48 rounded-full ${c.bgSoft} opacity-70 blur-2xl`} />
          <div className="relative">
            <div className="flex items-center gap-2 flex-wrap">
              <PhaseChip color={phase.color} emoji={phase.emoji} label={phase.shortTitle} size="sm" />
              <span className="text-xs text-muted-foreground font-mono">
                Aula {lesson.number.toString().padStart(2, "0")}
              </span>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lesson.duration}
              </span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-mint-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="h-3 w-3" />
                  Concluída
                </span>
              )}
            </div>
            <h1
              className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold mt-3 leading-tight"
              data-testid="text-lesson-title"
            >
              {lesson.title}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-3xl text-sm sm:text-base">
              {lesson.summary}
            </p>
          </div>
        </header>

        {/* Draft state */}
        {lesson.status === "draft" && (
          <div className="mt-8 rounded-2xl border border-card-border bg-card p-8 sm:p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-peach-soft flex items-center justify-center mb-4">
              <Construction className="h-8 w-8" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold">
              Em breve — conteúdo sendo preparado 👷
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              O professor tá montando essa aula com carinho. Enquanto isso, dá pra explorar as próximas ou
              voltar pra trilha.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link href="/trilha">
                <Button variant="outline" className="rounded-xl gap-2">
                  <ArrowLeft className="h-4 w-4" /> Voltar pra trilha
                </Button>
              </Link>
              {next && (
                <Link href={`/aula/${next.id}`} data-testid="link-next-lesson">
                  <Button className="rounded-xl gap-2">
                    Próxima aula <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {lesson.status === "ready" && (
          <>
            {/* Time-block navigation */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {blockMeta.map((b) => (
                <button
                  key={b.key}
                  onClick={() => scrollToBlock(`block-${b.key}`)}
                  className="rounded-xl border border-card-border bg-card px-3 py-3 text-left hover-elevate"
                  data-testid={`button-block-nav-${b.key}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none" aria-hidden>{b.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{b.label}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{b.duration}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Abertura */}
            {lesson.intro && (
              <section
                id="block-abertura"
                aria-labelledby="heading-abertura"
                className="mt-10 grid sm:grid-cols-[8px_1fr] gap-4 sm:gap-6 scroll-mt-24"
              >
                <div className="hidden sm:block rounded-full bg-mint" />
                <div>
                  <BlockHeader emoji="🎬" title="Abertura" duration="5 min" id="heading-abertura" />
                  <p className="text-base text-foreground/85 leading-relaxed mt-3 mb-5 max-w-3xl">
                    {lesson.intro.text}
                  </p>
                  <VideoWithChapters video={lesson.intro.video} testIdPrefix="intro" />
                </div>
              </section>
            )}

            {/* Guiado */}
            {lesson.guided && (
              <section
                id="block-guiado"
                aria-labelledby="heading-guiado"
                className="mt-12 grid sm:grid-cols-[8px_1fr] gap-4 sm:gap-6 scroll-mt-24"
              >
                <div className="hidden sm:block rounded-full bg-lavender" />
                <div>
                  <BlockHeader emoji="📖" title="Conteúdo guiado" duration="30 min" id="heading-guiado" />
                  <p className="text-sm text-muted-foreground mt-2 mb-5 max-w-3xl">
                    Assiste o vídeo no seu ritmo — clica nos capítulos pra pular pra parte mais legal. Depois,
                    segue o passo a passo abaixo.
                  </p>
                  <VideoWithChapters video={lesson.guided.video} testIdPrefix="guided" />

                  <ol className="mt-8 grid gap-3">
                    {lesson.guided.steps.map((step, i) => (
                      <li
                        key={i}
                        data-testid={`step-${i}`}
                        className="rounded-2xl border border-card-border bg-card p-4 sm:p-5 flex gap-4"
                      >
                        <div className="shrink-0 h-10 w-10 rounded-xl bg-lavender-soft flex items-center justify-center font-display font-semibold">
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-semibold text-base sm:text-lg flex items-center gap-2 leading-tight">
                            {step.emoji && <span aria-hidden>{step.emoji}</span>}
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1.5">{step.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            )}

            {/* Mão na massa */}
            {lesson.handsOn && (
              <section
                id="block-maoNaMassa"
                aria-labelledby="heading-mao"
                className="mt-12 grid sm:grid-cols-[8px_1fr] gap-4 sm:gap-6 scroll-mt-24"
              >
                <div className="hidden sm:block rounded-full bg-peach" />
                <div>
                  <BlockHeader emoji="🛠️" title="Mão na massa" duration="40 min" id="heading-mao" />
                  <div className="mt-4 rounded-2xl border border-card-border bg-card p-5 sm:p-6">
                    <h3 className="font-display font-semibold text-lg">
                      {lesson.handsOn.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-5">
                      {lesson.handsOn.instructions}
                    </p>

                    <div className="rounded-xl bg-peach-soft p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-wider">
                          Checklist
                        </p>
                        <p className="text-xs font-mono text-muted-foreground" data-testid="text-checkpoint-progress">
                          {doneCheckpoints}/{totalCheckpoints}
                        </p>
                      </div>
                      <ul className="space-y-2">
                        {lesson.handsOn.checkpoints.map((cp) => {
                          const checked = checkpointSet.has(cp.id);
                          return (
                            <li key={cp.id}>
                              <label
                                className={[
                                  "flex items-center gap-3 rounded-xl px-3 py-3 cursor-pointer hover-elevate bg-card",
                                  checked ? "" : "",
                                ].join(" ")}
                                data-testid={`checkpoint-${cp.id}`}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(v) => toggleCheckpoint(cp.id, !!v)}
                                  className="h-5 w-5"
                                  data-testid={`checkbox-${cp.id}`}
                                />
                                <span
                                  className={[
                                    "text-sm sm:text-base",
                                    checked ? "line-through text-muted-foreground" : "",
                                  ].join(" ")}
                                >
                                  {cp.label}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Desafio extra */}
            {lesson.bonus && (
              <section
                id="block-desafio"
                aria-labelledby="heading-desafio"
                className="mt-12 grid sm:grid-cols-[8px_1fr] gap-4 sm:gap-6 scroll-mt-24"
              >
                <div className="hidden sm:block rounded-full bg-mint" />
                <div>
                  <BlockHeader emoji="⭐" title="Desafio extra" duration="10 min" id="heading-desafio" />
                  <div className="mt-4 rounded-2xl border border-mint bg-mint-soft p-5 sm:p-6 flex gap-4 items-start">
                    <Sparkles className="h-6 w-6 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-display font-semibold text-lg">{lesson.bonus.title}</h3>
                      <p className="text-sm text-foreground/85 mt-2">{lesson.bonus.description}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Entrega */}
            {lesson.delivery && (
              <section
                id="block-entrega"
                aria-labelledby="heading-entrega"
                className="mt-12 grid sm:grid-cols-[8px_1fr] gap-4 sm:gap-6 scroll-mt-24"
              >
                <div className="hidden sm:block rounded-full bg-lavender" />
                <div>
                  <BlockHeader emoji="🎁" title="Entrega" duration="5 min" id="heading-entrega" />
                  <div className="mt-4 rounded-2xl border border-card-border bg-card p-5 sm:p-6">
                    <h3 className="font-display font-semibold text-lg">{lesson.delivery.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{lesson.delivery.description}</p>
                    {lesson.delivery.driveFolder && (
                      <a
                        href={lesson.delivery.driveFolder}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="link-drive-folder"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-lavender-soft px-4 py-2.5 text-sm font-medium hover-elevate"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Abrir pasta da Aula no Drive
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Mark complete + nav */}
            <div className="mt-12 rounded-3xl border border-card-border bg-card p-6 sm:p-8 text-center">
              {isCompleted ? (
                <>
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-mint-soft flex items-center justify-center mb-3">
                    <Trophy className="h-7 w-7" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold">
                    Você já mandou bem nessa aula!
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Sempre que quiser, volta aqui pra revisar.
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-peach-soft flex items-center justify-center mb-3">
                    <PartyPopper className="h-7 w-7" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold">
                    Terminou tudo?
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Marca essa aula como concluída pra desbloquear a próxima na trilha.
                  </p>
                  <Button
                    onClick={markComplete}
                    size="lg"
                    className="mt-4 rounded-xl gap-2 h-12 px-6"
                    data-testid="button-mark-complete"
                    disabled={updateStudent.isPending}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Concluir aula
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {/* Prev/Next */}
        <nav className="mt-10 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={`/aula/${prev.id}`} data-testid="link-prev-lesson">
              <div className="rounded-2xl border border-card-border bg-card p-4 hover-elevate">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" /> Aula anterior
                </p>
                <p className="font-display font-semibold mt-1 leading-tight">{prev.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link href={`/aula/${next.id}`} data-testid="link-next-lesson">
              <div className="rounded-2xl border border-card-border bg-card p-4 hover-elevate text-right">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-end gap-1">
                  Próxima aula <ArrowRight className="h-3 w-3" />
                </p>
                <p className="font-display font-semibold mt-1 leading-tight">{next.title}</p>
              </div>
            </Link>
          )}
        </nav>
      </article>
    </Layout>
  );
}

function BlockHeader({ emoji, title, duration, id }: { emoji: string; title: string; duration: string; id: string }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <h2 id={id} className="font-display text-xl sm:text-2xl font-semibold flex items-center gap-2">
        <span aria-hidden className="text-2xl">{emoji}</span>
        {title}
      </h2>
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground font-mono">
        <Clock className="h-3 w-3" />
        {duration}
      </span>
    </div>
  );
}
