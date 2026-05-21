import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useStudent, useUpdateStudent, useResetStudent, useDeleteStudent } from "@/components/StudentProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AVATAR_OPTIONS, NewStudentDialog } from "@/components/NewStudentDialog";
import { lessons, phases, getLessonsByPhase } from "@/data/lessons";
import { Trash2, RotateCcw, UserPlus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PHASE_TINTS = ["pink", "blue", "lavender", "mint"] as const;

export default function Aluno() {
  const { currentStudent, students, hasAnyStudent, isLoading } = useStudent();
  const updateStudent = useUpdateStudent();
  const resetStudent = useResetStudent();
  const deleteStudent = useDeleteStudent();
  const { toast } = useToast();
  const [newOpen, setNewOpen] = useState(false);

  const [name, setName] = useState(currentStudent?.name ?? "");
  const [avatar, setAvatar] = useState(currentStudent?.avatarEmoji ?? AVATAR_OPTIONS[0]);

  if (currentStudent && currentStudent.name !== name && !updateStudent.isPending && document.activeElement?.tagName !== "INPUT") {
    setName(currentStudent.name);
    setAvatar(currentStudent.avatarEmoji);
  }

  if (!hasAnyStudent && !isLoading) {
    return <Layout><div className="min-h-[60vh]" /></Layout>;
  }

  if (!currentStudent) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <p className="font-hand text-muted-foreground">Carregando…</p>
        </div>
      </Layout>
    );
  }

  const save = async () => {
    try {
      await updateStudent.mutateAsync({
        id: currentStudent.id,
        patch: { name: name.trim(), avatarEmoji: avatar },
      });
      toast({ title: "Salvo!", description: "Seu perfil foi atualizado." });
    } catch {
      toast({ title: "Ops!", description: "Não consegui salvar.", variant: "destructive" });
    }
  };

  const handleReset = async () => {
    try {
      await resetStudent.mutateAsync(currentStudent.id);
      toast({ title: "Progresso zerado", description: "Bora começar de novo!" });
    } catch {
      toast({ title: "Ops!", description: "Não consegui zerar.", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStudent.mutateAsync(currentStudent.id);
      toast({ title: "Aluno removido" });
    } catch {
      toast({ title: "Ops!", description: "Não consegui remover.", variant: "destructive" });
    }
  };

  const totalCompleted = currentStudent.completedLessons.length;

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-8">
          <p className="label-tiny text-muted-foreground">Aluno</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-2">Seu perfil</h1>
          <p className="font-hand text-base text-muted-foreground mt-2">
            Aqui você ajusta nome, avatar e olha seu progresso geral.
          </p>
        </header>

        <div className="grid gap-6">
          {/* Profile card */}
          <div className="sticky-card p-6 sm:p-8 relative">
            <span className="pill-badge absolute top-5 right-5">Perfil</span>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-lg bg-sticky-pink flex items-center justify-center text-3xl tilt-l-strong border border-card-border" aria-hidden>
                {currentStudent.avatarEmoji}
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold leading-tight">
                  {currentStudent.name}
                </h2>
                <p className="font-hand text-sm text-muted-foreground">
                  {totalCompleted} de {lessons.length} aulas concluídas
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="aluno-name" className="font-hand text-base">Nome</Label>
                <Input
                  id="aluno-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  className="h-11 text-base font-hand"
                  data-testid="input-aluno-name"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-hand text-base">Avatar</Label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_OPTIONS.map((emo) => {
                    const selected = avatar === emo;
                    return (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => setAvatar(emo)}
                        aria-pressed={selected}
                        aria-label={`Avatar ${emo}`}
                        data-testid={`button-aluno-avatar-${emo}`}
                        className={[
                          "h-14 rounded-lg text-2xl flex items-center justify-center transition-colors border",
                          selected
                            ? "border-coral bg-sticky-pink"
                            : "border-card-border bg-sticky-yellow-soft hover:bg-sticky-yellow",
                        ].join(" ")}
                      >
                        {emo}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={save}
                disabled={updateStudent.isPending || !name.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-coral text-primary-foreground px-5 py-2.5 font-hand text-base hover-elevate disabled:opacity-50"
                data-testid="button-save-aluno"
              >
                <Save className="h-4 w-4" />
                Salvar mudanças
              </button>
            </div>
          </div>

          {/* Phase progress as sticky notes */}
          <div className="sticky-card p-6 sm:p-8 relative">
            <span className="pill-badge absolute top-5 right-5">Progresso</span>
            <h2 className="font-display text-2xl font-semibold">Progresso por fase</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {phases.map((phase, idx) => {
                const phaseLessons = getLessonsByPhase(phase.id);
                const done = phaseLessons.filter((l) => currentStudent.completedLessons.includes(l.id)).length;
                const total = phaseLessons.length;
                const pct = total === 0 ? 0 : Math.round((done / total) * 100);
                const tint = PHASE_TINTS[idx];
                return (
                  <div
                    key={phase.id}
                    className={`rounded-lg border border-card-border bg-sticky-${tint}-soft p-4 ${idx % 2 === 0 ? "tilt-l" : "tilt-r"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden>{phase.emoji}</span>
                      <p className="font-display font-semibold text-lg leading-tight">
                        {phase.shortTitle}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between font-hand text-xs text-muted-foreground mb-1">
                      <span>{done}/{total} aulas</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-card border border-card-border overflow-hidden">
                      <div
                        className="h-full bg-coral rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Switch / new */}
          <div className="sticky-card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold">Gerenciar alunos</h2>
            <p className="font-hand text-base text-muted-foreground mt-1">
              O Code Lab guarda o progresso de cada aluno separado. Total cadastrado: <strong>{students.length}</strong>.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => setNewOpen(true)}
                variant="outline"
                className="rounded-lg gap-2 font-hand"
                data-testid="button-add-student"
              >
                <UserPlus className="h-4 w-4" />
                Cadastrar novo aluno
              </Button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="sticky-card p-6 sm:p-8" style={{ backgroundColor: "hsl(var(--sticky-pink-soft))" }}>
            <h2 className="font-display text-2xl font-semibold">Zona de ajuste</h2>
            <p className="font-hand text-base text-muted-foreground mt-1">
              Aqui dá pra zerar o progresso ou remover o aluno. Pensa duas vezes 🙏
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="rounded-lg gap-2 font-hand" data-testid="button-reset-progress">
                    <RotateCcw className="h-4 w-4" />
                    Zerar progresso
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Zerar todo o progresso?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Todas as aulas concluídas e checklists vão voltar do zero. O aluno continua cadastrado.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset} data-testid="button-confirm-reset">
                      Zerar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="rounded-lg gap-2 font-hand" data-testid="button-delete-student">
                    <Trash2 className="h-4 w-4" />
                    Remover aluno
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover {currentStudent.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação apaga o aluno e todo o progresso dele. Não dá pra desfazer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete">
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <NewStudentDialog open={newOpen} onOpenChange={setNewOpen} />
      </section>
    </Layout>
  );
}
