import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateStudent, useStudent } from "./StudentProvider";
import { useToast } from "@/hooks/use-toast";

export const AVATAR_OPTIONS = ["🦊", "🐼", "🦄", "🚀", "🎮", "🐉", "🦖", "🐙", "🌟", "🧙"];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** If true, the dialog is the first-run experience and cannot be dismissed. */
  forced?: boolean;
}

export function NewStudentDialog({ open, onOpenChange, forced }: Props) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const { setCurrentStudentId } = useStudent();
  const createStudent = useCreateStudent();
  const { toast } = useToast();

  const reset = () => {
    setName("");
    setAvatar(AVATAR_OPTIONS[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const s = await createStudent.mutateAsync({ name: name.trim(), avatarEmoji: avatar });
      setCurrentStudentId(s.id);
      toast({ title: `Tudo pronto, ${s.name}! ${s.avatarEmoji}`, description: "Seu cantinho do Code Lab tá no ar." });
      reset();
      onOpenChange(false);
    } catch (err) {
      toast({ title: "Ops!", description: "Não consegui salvar agora. Tenta de novo.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!forced) onOpenChange(v); }}>
      <DialogContent
        className={["sm:max-w-md", forced ? "[&>button.absolute]:hidden" : ""].join(" ")}
        onPointerDownOutside={(e) => forced && e.preventDefault()}
        onEscapeKeyDown={(e) => forced && e.preventDefault()}
        data-testid="dialog-new-student"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {forced ? "Oi! Vamos te conhecer 👋" : "Novo aluno"}
          </DialogTitle>
          <DialogDescription>
            {forced
              ? "Pra começar, me conta seu nome e escolhe um avatar."
              : "Cadastra um novo aluno no Code Lab."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="student-name" className="font-medium">Qual é o seu nome?</Label>
            <Input
              id="student-name"
              autoFocus
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pedro"
              data-testid="input-student-name"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Escolha seu avatar</Label>
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
                    data-testid={`button-avatar-${emo}`}
                    className={[
                      "h-14 rounded-2xl text-2xl flex items-center justify-center transition-colors",
                      "border-2",
                      selected
                        ? "border-primary bg-primary/15"
                        : "border-transparent bg-muted hover:bg-muted/70",
                    ].join(" ")}
                  >
                    {emo}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="gap-2">
            {!forced && (
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={!name.trim() || createStudent.isPending}
              data-testid="button-create-student"
              className="rounded-xl"
            >
              {createStudent.isPending ? "Salvando..." : "Começar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
