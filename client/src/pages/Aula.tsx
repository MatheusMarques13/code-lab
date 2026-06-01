import { useMemo } from "react";
import { Link, useRoute } from "wouter";
import ReactMarkdown from "react-markdown";
import { Layout } from "@/components/Layout";
import { useStudent, useUpdateStudent } from "@/components/StudentProvider";
import { getLesson, getPhase, getNextLesson, getPrevLesson, type LessonImage } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Construction, ExternalLink, Sparkles, Trophy, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const blockMeta = [
  { key: "materiais", emoji: "🎒", label: "Materiais", duration: "—" },
  { key: "entendendo", emoji: "📖", label: "Entendendo", duration: "10 min" },
  { key: "maoNaMassa", emoji: "🛠️", label: "Mão na massa", duration: "50 min" },
  { key: "desafio", emoji: "⭐", label: "Desafio extra", duration: "15 min" },
  { key: "entrega", emoji: "🎁", label: "Entrega", duration: "15 min" },
] as const;

function scrollToBlock(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Polaroid({ image }: { image: LessonImage }) {
  const tiltClass =
    image.tilt === "l" ? "tilt-l" :
    image.tilt === "r" ? "tilt-r" :
    image.tilt === "l-strong" ? "tilt-l-strong" :
    image.tilt === "r-strong" ? "tilt-r-strong" : "";
  return (
    <figure className={`polaroid max-w-2xl ${tiltClass}`}>
      <img src={image.src} alt={image.caption} loading="lazy" />
      <figcaption>{image.caption}</figcaption>
    </figure>
  );
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
          <h1 className="font-display text-3xl font-semibold">Aula não encontrada</h1>
          <p className="font-hand text-muted-foreground mt-2">Volta pra trilha pra ver as aulas disponíveis.</p>
          <Link href="/trilha">
            <Button className="mt-4 rounded-lg">Ver trilha</Button>
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
          <p className="font-hand text-muted-foreground">Carregando…</p>
        </div>
      </Layout>
    );
  }

  const toggleCheckpoint = (id: string, checked: boolean) => {
    if (!currentStudent) return;
    const nextSet = new Set(checkpointSet);
    if (checked) nextSet.add(id);
    else nextSet.delete(id);
    const checkpoints = {
      ...currentStudent.checkpoints,
      [lesson.id]: Array.from(nextSet),
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
        <nav className="font-hand text-sm text-muted-foreground flex items-center gap-2 mb-4 flex-wrap">
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
        <header className="sticky-card p-6 sm:p-8 relative">
          <span className="pill-badge absolute top-5 right-5">Aula {lesson.number.toString().padStart(2, "0")}</span>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sticky-yellow-soft px-2.5 py-1 font-hand text-sm">
              <span aria-hidden>{phase.emoji}</span>
              {phase.shortTitle}
            </span>
            <span className="font-hand text-sm text-muted-foreground inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {lesson.duration}
            </span>
            {isCompleted && (
              <span className="pill-badge bg-sticky-mint-soft text-foreground/70" style={{ color: "hsl(152 50% 35%)" }}>
                <CheckCircle2 className="h-3 w-3" />
                Concluída
              </span>
            )}
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05]"
            data-testid="text-lesson-title"
          >
            {lesson.title}
          </h1>
          <p className="font-hand text-lg sm:text-xl md:text-2xl text-foreground/75 mt-4 max-w-3xl leading-snug">
            {lesson.summary}
          </p>
        </header>

        {/* Draft state */}
        {lesson.status === "draft" && (
          <div className="mt-8 sticky-card p-8 sm:p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-lg bg-sticky-pink-soft flex items-center justify-center mb-4">
              <Construction className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">
              Em breve — conteúdo sendo preparado 👷
            </h2>
            <p className="font-hand text-base text-muted-foreground mt-3 max-w-md mx-auto">
              O professor tá montando essa aula com carinho. Enquanto isso, dá pra explorar as próximas ou
              voltar pra trilha.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link href="/trilha">
                <Button variant="outline" className="rounded-lg gap-2 font-hand">
                  <ArrowLeft className="h-4 w-4" /> Voltar pra trilha
                </Button>
              </Link>
              {next && (
                <Link href={`/aula/${next.id}`} data-testid="link-next-lesson">
                  <Button className="rounded-lg gap-2 font-hand">
                    Próxima aula <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {lesson.status === "ready" && (
          <>
            {/* Materiais da aula */}
            {lesson.materials && lesson.materials.length > 0 && (
              <section
                id="block-materiais"
                aria-labelledby="heading-materiais"
                className="mt-8 sticky-card p-6 relative scroll-mt-24"
              >
                <span className="pill-badge absolute top-4 right-4">Setup</span>
                <BlockHeader emoji="🎒" title="Materiais da Aula" duration="" id="heading-materiais" />
                <p className="font-hand text-lg sm:text-xl text-muted-foreground mt-3 mb-6 max-w-3xl leading-snug">
                  Tudo que você precisa pra essa aula. Abre antes de começar!
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {lesson.materials.map((m, i) => (
                    <li key={i}>
                      <a
                        href={m.url}
                        target={m.url.startsWith("#") ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        data-testid={`link-material-${i}`}
                        className="flex items-center gap-3 rounded-lg border border-card-border bg-sticky-yellow-soft px-4 py-3 hover-elevate transition-colors"
                      >
                        <span className="text-2xl" aria-hidden>{m.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-hand text-lg sm:text-xl font-semibold leading-tight">{m.label}</p>
                          {m.hint && (
                            <p className="font-hand text-sm text-muted-foreground mt-1">{m.hint}</p>
                          )}
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Time-block navigation */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {blockMeta.map((b) => (
                <button
                  key={b.key}
                  onClick={() => scrollToBlock(`block-${b.key}`)}
                  className="sticky-card px-3 py-3 text-left hover-elevate"
                  data-testid={`button-block-nav-${b.key}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none" aria-hidden>{b.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-hand text-sm font-semibold truncate leading-tight">{b.label}</p>
                      <p className="label-tiny text-muted-foreground mt-0.5">{b.duration}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Entendendo */}
            {lesson.understanding && (
              <section
                id="block-entendendo"
                aria-labelledby="heading-entendendo"
                className="mt-10 sticky-card p-6 sm:p-8 relative scroll-mt-24"
              >
                <span className="pill-badge absolute top-5 right-5">Leitura</span>
                <BlockHeader
                  emoji="📖"
                  title={lesson.understanding.title}
                  duration={lesson.understanding.duration}
                  id="heading-entendendo"
                />
                <div className="markdown-paper markdown-paper-lg mt-6 max-w-3xl">
                  <ReactMarkdown
                    components={{
                      a: ({ node, href, children, ...props }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {lesson.understanding.markdown}
                  </ReactMarkdown>
                </div>

                {lesson.understanding.images && lesson.understanding.images.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-8 justify-center">
                    {lesson.understanding.images.map((img, i) => (
                      <Polaroid key={i} image={img} />
                    ))}
                  </div>
                )}

                {/* Sources block */}
                <div className="mt-6 rounded-lg border border-dashed border-card-border bg-sticky-blue-soft/40 p-4">
                  <p className="label-tiny text-muted-foreground mb-2">Fontes</p>
                  <ul className="font-hand text-sm text-foreground/80 space-y-1">
                    <li>• <a className="underline decoration-coral/40 hover:decoration-coral" href="https://www.piskelapp.com/" target="_blank" rel="noopener noreferrer">Site oficial do Piskel</a></li>
                    <li>• <a className="underline decoration-coral/40 hover:decoration-coral" href="https://github.com/piskelapp/piskel" target="_blank" rel="noopener noreferrer">Piskel no GitHub (open source)</a></li>
                    <li>• <a className="underline decoration-coral/40 hover:decoration-coral" href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer">MDN Web Docs — Canvas API</a></li>
                    <li>• <a className="underline decoration-coral/40 hover:decoration-coral" href="https://pt.wikipedia.org/wiki/Pixel_art" target="_blank" rel="noopener noreferrer">Wikipédia — Pixel art</a></li>
                    <li>• <a className="underline decoration-coral/40 hover:decoration-coral" href="https://scratch.mit.edu/about" target="_blank" rel="noopener noreferrer">Sobre o Scratch (MIT)</a></li>
                  </ul>
                </div>
              </section>
            )}

            {/* Mão na massa */}
            {lesson.handsOn && (
              <section
                id="block-maoNaMassa"
                aria-labelledby="heading-mao"
                className="mt-8 sticky-card p-6 sm:p-8 relative scroll-mt-24"
              >
                <span className="pill-badge absolute top-5 right-5">Prática</span>
                <BlockHeader
                  emoji="🛠️"
                  title={lesson.handsOn.title}
                  duration={lesson.handsOn.duration}
                  id="heading-mao"
                />
                <p className="font-hand text-lg sm:text-xl text-muted-foreground mt-3 mb-7 max-w-3xl leading-snug">
                  {lesson.handsOn.instructions}
                </p>

                {/* Numbered steps with optional polaroid images */}
                <ol className="grid gap-7">
                  {lesson.handsOn.steps.map((step, i) => (
                    <li
                      key={i}
                      data-testid={`step-${i}`}
                      className="rounded-lg border border-card-border bg-sticky-yellow-soft/40 p-6 sm:p-7 grid sm:grid-cols-[64px_1fr] lg:grid-cols-[64px_1fr_auto] gap-5 items-start"
                    >
                      <div className="h-16 w-16 rounded-lg bg-sticky-pink flex items-center justify-center font-display text-3xl font-semibold text-foreground">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-semibold text-2xl sm:text-3xl flex items-center gap-2 leading-tight">
                          {step.emoji && <span aria-hidden>{step.emoji}</span>}
                          {step.title}
                        </h3>
                        <div className="font-hand text-lg sm:text-xl text-foreground/85 mt-3 leading-relaxed">
                          <ReactMarkdown>{step.body}</ReactMarkdown>
                        </div>
                        {step.image && (
                          <div className="mt-5 lg:hidden flex justify-center">
                            <Polaroid image={step.image} />
                          </div>
                        )}
                      </div>
                      {step.image && (
                        <div className="hidden lg:block lg:max-w-md">
                          <Polaroid image={step.image} />
                        </div>
                      )}
                    </li>
                  ))}
                </ol>

                {/* Checkpoints */}
                <div className="mt-9 rounded-lg border border-dashed border-card-border bg-sticky-pink-soft/40 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="label-tiny text-coral text-sm">Checklist</p>
                    <p className="font-hand text-base text-muted-foreground" data-testid="text-checkpoint-progress">
                      {doneCheckpoints}/{totalCheckpoints}
                    </p>
                  </div>
                  <ul className="space-y-2.5">
                    {lesson.handsOn.checkpoints.map((cp) => {
                      const checked = checkpointSet.has(cp.id);
                      return (
                        <li key={cp.id}>
                          <label
                            className="flex items-center gap-4 rounded-lg px-4 py-3.5 cursor-pointer hover-elevate bg-card border border-card-border"
                            data-testid={`checkpoint-${cp.id}`}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(v) => toggleCheckpoint(cp.id, !!v)}
                              className="h-6 w-6"
                              data-testid={`checkbox-${cp.id}`}
                            />
                            <span
                              className={[
                                "font-hand text-lg sm:text-xl",
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
              </section>
            )}

            {/* Desafio extra */}
            {lesson.bonus && (
              <section
                id="block-desafio"
                aria-labelledby="heading-desafio"
                className="mt-8 sticky-card p-6 sm:p-8 relative scroll-mt-24"
                style={{ backgroundColor: "hsl(var(--sticky-lavender-soft))" }}
              >
                <span className="pill-badge absolute top-5 right-5">Bônus</span>
                <BlockHeader
                  emoji="⭐"
                  title={lesson.bonus.title}
                  duration={lesson.bonus.duration}
                  id="heading-desafio"
                />
                <div className="mt-4 flex gap-4 items-start">
                  <Sparkles className="h-7 w-7 shrink-0 mt-1 text-coral" />
                  <p className="font-hand text-lg sm:text-xl text-foreground/85 leading-snug">{lesson.bonus.description}</p>
                </div>
              </section>
            )}

            {/* Entrega */}
            {lesson.delivery && (
              <section
                id="block-entrega"
                aria-labelledby="heading-entrega"
                className="mt-8 sticky-card p-6 sm:p-8 relative scroll-mt-24"
              >
                <span className="pill-badge absolute top-5 right-5">Entrega</span>
                <BlockHeader
                  emoji="🎁"
                  title={lesson.delivery.title}
                  duration={lesson.delivery.duration}
                  id="heading-entrega"
                />
                <p className="font-hand text-lg sm:text-xl text-foreground/85 mt-4 max-w-3xl leading-snug">
                  {lesson.delivery.description}
                </p>
                {lesson.delivery.driveFolder && (
                  <a
                    href={lesson.delivery.driveFolder}
                    target={lesson.delivery.driveFolder.startsWith("#") ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    data-testid="link-drive-folder"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sticky-blue px-4 py-2.5 font-hand text-base hover-elevate border border-card-border"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir pasta da aula no Drive
                  </a>
                )}
              </section>
            )}

            {/* Mark complete */}
            <div className="mt-10 sticky-card p-6 sm:p-8 text-center">
              {isCompleted ? (
                <>
                  <div className="mx-auto h-14 w-14 rounded-lg bg-sticky-mint flex items-center justify-center mb-3">
                    <Trophy className="h-7 w-7" />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold">
                    Você já mandou bem nessa aula!
                  </h2>
                  <p className="font-hand text-base text-muted-foreground mt-1">
                    Sempre que quiser, volta aqui pra revisar.
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto h-14 w-14 rounded-lg bg-sticky-pink flex items-center justify-center mb-3">
                    <PartyPopper className="h-7 w-7" />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold">
                    Terminou tudo?
                  </h2>
                  <p className="font-hand text-base text-muted-foreground mt-1">
                    Marca essa aula como concluída pra desbloquear a próxima na trilha.
                  </p>
                  <button
                    onClick={markComplete}
                    data-testid="button-mark-complete"
                    disabled={updateStudent.isPending}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-coral text-primary-foreground px-6 py-3 font-hand text-lg hover-elevate disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Concluir aula
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {/* Prev/Next */}
        <nav className="mt-10 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={`/aula/${prev.id}`} data-testid="link-prev-lesson">
              <div className="sticky-card p-4 hover-elevate">
                <p className="label-tiny text-muted-foreground flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" /> Aula anterior
                </p>
                <p className="font-display text-lg font-semibold mt-1 leading-tight">{prev.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link href={`/aula/${next.id}`} data-testid="link-next-lesson">
              <div className="sticky-card p-4 hover-elevate text-right">
                <p className="label-tiny text-muted-foreground flex items-center justify-end gap-1">
                  Próxima aula <ArrowRight className="h-3 w-3" />
                </p>
                <p className="font-display text-lg font-semibold mt-1 leading-tight">{next.title}</p>
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
      <h2 id={id} className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold flex items-center gap-3 leading-tight">
        <span aria-hidden className="text-3xl sm:text-4xl">{emoji}</span>
        {title}
      </h2>
      {duration && (
        <span className="inline-flex items-center gap-1 rounded-full bg-sticky-yellow-soft border border-card-border px-2.5 py-0.5 font-hand text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          {duration}
        </span>
      )}
    </div>
  );
}
