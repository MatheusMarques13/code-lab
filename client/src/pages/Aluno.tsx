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
import { ProgressRing } from "@/components/ProgressRing";
import { phaseClasses } from "@/components/PhaseBadge";
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

export default function Aluno() {
  const { currentStudent, students, hasAnyStudent, isLoading } = useStudent();
  const updateStudent = useUpdateStudent();
  const resetStudent = useResetStudent();
  const deleteStudent = useDeleteStudent();
  const { toast } = useToast();
  const [newOpen, setNewOpen] = useState(false);

  const [name, setName] = useState(currentStudent?.name ?? "");
  const [avatar, setAvatar] = useState(currentStudent?.avatarEmoji ?? AVATAR_OPTIONS[0]);

  // sync local state when student changes
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
          <p className="text-muted-foreground">Carregando…</p>
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
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        <header className="mb-8">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            Aluno
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2">Seu perfil</h1>
          <p className="text-muted-foreground mt-2">
            Aqui você ajusta nome, avatar e olha seu progresso geral.
          </p>
        </header>

        <div className="grid gap-6">
          {/* Profile card */}
          <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-mint-soft flex items-center justify-center text-3xl" aria-hidden>
                {currentStudent.avatarEmoji}
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold leading-tight">
                  {currentStudent.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {totalCompleted} de {lessons.length} aulas concluídas
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="aluno-name" className="font-medium">Nome</Label>
                <Input
                  id="aluno-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  className="h-11 text-base"
                  data-testid="input-aluno-name"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Avatar</Label>
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
                          "h-14 rounded-2xl text-2xl flex items-center justify-center transition-colors border-2",
                          selected ? "border-primary bg-primary/15" : "border-transparent bg-muted hover:bg-muted/70",
                        ].join(" ")}
                      >
                        {emo}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={save}
                disabled={updateStudent.isPending || !name.trim()}
                className="rounded-xl gap-2"
                data-testid="button-save-aluno"
              >
                <Save className="h-4 w-4" />
                Salvar mudanças
              </Button>
            </div>
          </div>

          {/* Phase progress */}
          <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">Progresso por fase</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {phases.map((phase) => {
                const phaseLessons = getLessonsByPhase(phase.id);
                const done = phaseLessons.filter((l) => currentStudent.completedLessons.includes(l.id)).length;
                const pct = phaseLessons.length === 0 ? 0 : done / phaseLessons.length;
                const c = phaseClasses(phase.color);
                return (
                  <div key={phase.id} className="flex items-center gap-4 rounded-xl bg-muted/40 p-4">
                    <ProgressRing value={pct} color={phase.color} size={56} stroke={6} />
                    <div className="min-w-0">
                      <p className="font-display font-semibold leading-tight">
                        {phase.emoji} {phase.shortTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {done}/{phaseLessons.length} aulas
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Switch / new */}
          <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">Gerenciar alunos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              O Code Lab guarda o progresso de cada aluno separado. Total de alunos: <strong>{students.length}</strong>.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => setNewOpen(true)}
                variant="outline"
                className="rounded-xl gap-2"
                data-testid="button-add-student"
              >
                <UserPlus className="h-4 w-4" />
                Cadastrar novo aluno
              </Button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold">Zona de ajuste</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Aqui dá pra zerar o progresso ou remover o aluno. Pensa duas vezes 🙏
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="rounded-xl gap-2" data-testid="button-reset-progress">
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
                  <Button variant="destructive" className="rounded-xl gap-2" data-testid="button-delete-student">
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
