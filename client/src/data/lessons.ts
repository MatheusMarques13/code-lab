// ============================================================================
//  Code Lab — Curriculum data
// ----------------------------------------------------------------------------
//  Edit this file to add or change lessons. The pages read everything from
//  here, so the teacher should never need to touch React components.
// ============================================================================

export type PhaseColor = "mint" | "lavender" | "peach";

export interface VideoChapter {
  title: string;
  startSeconds: number;
  description?: string;
  bestPart?: boolean;
}

export interface LessonVideo {
  youtubeId: string;
  title: string;
  chapters: VideoChapter[];
}

export interface LessonStep {
  emoji?: string;
  title: string;
  body: string;
}

export interface LessonCheckpoint {
  id: string;
  label: string;
}

export interface Lesson {
  id: string;            // e.g. "aula-1"
  number: number;        // 1..21
  phaseId: string;       // "fase-1" .. "fase-4"
  title: string;
  summary: string;       // short description for cards
  duration: string;      // "1h30"
  status: "ready" | "draft";  // "draft" → renders the friendly "em breve" page
  intro?: {
    video: LessonVideo;
    text: string;
  };
  guided?: {
    video: LessonVideo;
    steps: LessonStep[];
  };
  handsOn?: {
    title: string;
    instructions: string;
    checkpoints: LessonCheckpoint[];
  };
  bonus?: {
    title: string;
    description: string;
  };
  delivery?: {
    title: string;
    description: string;
    driveFolder?: string; // placeholder Drive link
  };
}

export interface Phase {
  id: string;
  title: string;
  emoji: string;
  shortTitle: string;
  color: PhaseColor;
  description: string;
  tool: string;
  lessonIds: string[];
}

// ----------------------------------------------------------------------------
//  Aula 1 — Full proof-of-concept content
// ----------------------------------------------------------------------------

const aula1: Lesson = {
  id: "aula-1",
  number: 1,
  phaseId: "fase-1",
  title: "Bem-vindo ao Piskel — Criando seu primeiro personagem",
  summary:
    "Vamos abrir o Piskel pela primeira vez e desenhar um personagem pixel art do zero.",
  duration: "1h30",
  status: "ready",
  intro: {
    text:
      "Hoje você vai criar o seu primeiríssimo personagem em pixel art! O Piskel é uma ferramenta gratuita que funciona direto no navegador — sem instalar nada. No fim da aula, você vai sair com um sprite salvo no seu computador, pronto para virar herói do seu jogo. Bora?",
    video: {
      youtubeId: "dQw4w9WgXcQ",
      title: "Abertura — O que vamos fazer hoje",
      chapters: [
        { title: "Oi! O que é pixel art?", startSeconds: 0 },
        { title: "Por que o Piskel?", startSeconds: 30 },
        { title: "O que você vai criar hoje", startSeconds: 75, bestPart: true, description: "A parte mais legal — olha o personagem pronto!" },
      ],
    },
  },
  guided: {
    video: {
      youtubeId: "dQw4w9WgXcQ",
      title: "Tutorial passo a passo — Seu primeiro sprite",
      chapters: [
        { title: "Abrindo o Piskel", startSeconds: 0 },
        { title: "Escolhendo o tamanho do canvas (16×16)", startSeconds: 45 },
        { title: "Ferramentas básicas: lápis, balde, borracha", startSeconds: 120 },
        { title: "Pintando a cabeça", startSeconds: 210, bestPart: true, description: "Truque para o personagem ficar fofinho" },
        { title: "Pintando o corpo", startSeconds: 320 },
        { title: "Olhos e boca — dando vida", startSeconds: 420 },
        { title: "Salvando como PNG", startSeconds: 540 },
        { title: "Exportando GIF animado (bônus)", startSeconds: 620 },
      ],
    },
    steps: [
      {
        emoji: "🌐",
        title: "Abrir o Piskel no navegador",
        body: "Vai em piskelapp.com e clica no botão azul **Create Sprite**. Não precisa criar conta — pode usar como visitante mesmo.",
      },
      {
        emoji: "📐",
        title: "Escolher o tamanho do canvas (16×16)",
        body: "Pixel art clássica usa quadrados pequenos. Clica em **Resize** e coloca 16 de largura e 16 de altura. Esse é o tamanho dos sprites do Mario antigo!",
      },
      {
        emoji: "🎨",
        title: "Escolher a paleta de cores",
        body: "No canto direito tem uma paletinha. Começa com 4 ou 5 cores — quanto menos cores, mais bonita fica a pixel art.",
      },
      {
        emoji: "👤",
        title: "Pintar a cabeça do personagem",
        body: "Usa o lápis (atalho **P**) e pinta uma forma redondinha no topo do canvas. Pode ser uma cabeça humana, de bicho, robô... o que você quiser!",
      },
      {
        emoji: "🦵",
        title: "Pintar o corpo",
        body: "Logo abaixo da cabeça, desenha o corpo. Lembra que cada quadradinho é um pixel — vai com calma!",
      },
      {
        emoji: "👀",
        title: "Adicionar olhos e boca",
        body: "Dois pixelzinhos pretos para os olhos e um traço para a boca. Pronto, ele virou gente!",
      },
      {
        emoji: "💾",
        title: "Salvar como PNG",
        body: "Clica em **Export** → **PNG** → **Download**. Salva na pasta da Aula 01 do seu computador.",
      },
      {
        emoji: "✨",
        title: "Exportar como GIF animado (opcional)",
        body: "Se sobrar tempo, adiciona um segundo frame e exporta como GIF. Vai parecer que o personagem está se mexendo!",
      },
    ],
  },
  handsOn: {
    title: "Crie o seu personagem",
    instructions:
      "Agora é com você! Siga os passos no seu Piskel e marca cada item conforme for terminando. Pode pedir ajuda quando quiser.",
    checkpoints: [
      { id: "abri-piskel", label: "Abri o Piskel no navegador" },
      { id: "criei-canvas", label: "Criei o canvas 16×16" },
      { id: "escolhi-paleta", label: "Escolhi minha paleta de cores" },
      { id: "desenhei-cabeca", label: "Desenhei a cabeça do personagem" },
      { id: "desenhei-corpo", label: "Desenhei o corpo" },
      { id: "adicionei-olhos", label: "Adicionei olhos e boca" },
      { id: "salvei-png", label: "Salvei o sprite como PNG" },
    ],
  },
  bonus: {
    title: "Desafio extra — Troca de roupa",
    description:
      "Crie uma segunda versão do seu personagem com uma roupa diferente: pode ser de pijama, de super-herói, de explorador… Use a função **Duplicate frame** do Piskel para não começar do zero.",
  },
  delivery: {
    title: "Entrega da aula",
    description:
      "Salve seu sprite (.png) na pasta **Aula 01 — Meu primeiro personagem** do Google Drive da turma. Manda também uma print para o professor!",
    driveFolder: "https://drive.google.com/drive/folders/aula-01-placeholder",
  },
};

// ----------------------------------------------------------------------------
//  Helper to build placeholder lessons quickly
// ----------------------------------------------------------------------------

function draft(
  id: string,
  number: number,
  phaseId: string,
  title: string,
  summary: string
): Lesson {
  return { id, number, phaseId, title, summary, duration: "1h30", status: "draft" };
}

// ----------------------------------------------------------------------------
//  All 21 lessons
// ----------------------------------------------------------------------------

export const lessons: Lesson[] = [
  aula1,
  draft("aula-2", 2, "fase-1", "Cores e formas — Inimigos e itens do seu jogo",
    "Vamos desenhar inimigos engraçados e itens colecionáveis para o jogo."),
  draft("aula-3", 3, "fase-1", "Animação frame-a-frame — Fazendo seu personagem andar",
    "Aprenda a fazer um personagem caminhar usando múltiplos frames."),
  draft("aula-4", 4, "fase-1", "Cenários e mundos — Montando o lugar onde tudo acontece",
    "Desenhe o cenário do seu jogo: chão, plataformas, céu e detalhes."),

  draft("aula-5", 5, "fase-2", "Conhecendo o Scratch — Importando seu personagem",
    "Primeiros passos no Scratch e como colocar o sprite que você desenhou."),
  draft("aula-6", 6, "fase-2", "Loops — Fazendo coisas acontecerem sozinhas",
    "Blocos de repetição para o personagem se mover sem parar."),
  draft("aula-7", 7, "fase-2", "Se/Então — Regras e colisões",
    "Como o jogo entende quando o herói encosta no inimigo."),
  draft("aula-8", 8, "fase-2", "Variáveis — Pontuação, vidas e tempo",
    "Aprenda a criar placar de pontos, sistema de vidas e cronômetro."),
  draft("aula-9", 9, "fase-2", "Sons — Dando vida ao seu jogo",
    "Adicione sons de pulo, moedas e música de fundo."),
  draft("aula-10", 10, "fase-2", "Projeto Final da Fase 1 — Seu primeiro jogo completo",
    "Junte tudo: personagem, cenário, inimigos, pontos e som."),

  draft("aula-11", 11, "fase-3", "Conhecendo o Construct 3",
    "Apresentação da ferramenta que cria jogos 2D profissionais."),
  draft("aula-12", 12, "fase-3", "Física e movimento — Plataforma e top-down",
    "Faça o personagem pular, andar, cair e correr de verdade."),
  draft("aula-13", 13, "fase-3", "Inimigos e sistema de vida",
    "Crie inimigos que se movem e um sistema de HP."),
  draft("aula-14", 14, "fase-3", "Múltiplas fases e transições",
    "Aprenda a montar várias fases com checkpoints e portas."),
  draft("aula-15", 15, "fase-3", "Menu, Game Over e Vitória",
    "Telas profissionais: menu inicial, tela de game over e final feliz."),
  draft("aula-16", 16, "fase-3", "Projeto Final da Fase 2 — Jogo 2D exportável",
    "Exporte seu jogo para web e compartilhe com a família."),

  draft("aula-17", 17, "fase-4", "Bem-vindo ao Roblox Studio",
    "Entrando no mundo da programação de verdade dentro do Roblox."),
  draft("aula-18", 18, "fase-4", "Suas primeiras linhas de Lua",
    "Print, variáveis e os primeiros comandos de uma linguagem real."),
  draft("aula-19", 19, "fase-4", "Variáveis, funções e eventos",
    "Como guardar valores, criar funções e responder a eventos."),
  draft("aula-20", 20, "fase-4", "NPCs e interações",
    "Personagens com diálogos e missões dentro do seu jogo."),
  draft("aula-21", 21, "fase-4", "Publicando sua experience no Roblox",
    "Como subir sua criação e jogar com os amigos no Roblox."),
];

// ----------------------------------------------------------------------------
//  Phases
// ----------------------------------------------------------------------------

export const phases: Phase[] = [
  {
    id: "fase-1",
    title: "Arte Digital & Pixel Art",
    emoji: "🎨",
    shortTitle: "Pixel Art",
    color: "peach",
    description: "Criando personagens, inimigos e cenários únicos no Piskel.",
    tool: "Piskel + Canva Kids",
    lessonIds: ["aula-1", "aula-2", "aula-3", "aula-4"],
  },
  {
    id: "fase-2",
    title: "Lógica com Scratch",
    emoji: "🧩",
    shortTitle: "Scratch",
    color: "mint",
    description: "Programando o primeiro jogo com os personagens criados.",
    tool: "Scratch 3",
    lessonIds: ["aula-5", "aula-6", "aula-7", "aula-8", "aula-9", "aula-10"],
  },
  {
    id: "fase-3",
    title: "Jogos 2D com Construct 3",
    emoji: "🎮",
    shortTitle: "Construct 3",
    color: "lavender",
    description: "Jogos 2D completos exportáveis para web.",
    tool: "Construct 3",
    lessonIds: ["aula-11", "aula-12", "aula-13", "aula-14", "aula-15", "aula-16"],
  },
  {
    id: "fase-4",
    title: "Programação Real com Lua",
    emoji: "🚀",
    shortTitle: "Roblox + Lua",
    color: "peach",
    description: "Roblox Studio e primeiras linhas de código de verdade.",
    tool: "Roblox Studio + Lua",
    lessonIds: ["aula-17", "aula-18", "aula-19", "aula-20", "aula-21"],
  },
];

// ----------------------------------------------------------------------------
//  Lookup helpers
// ----------------------------------------------------------------------------

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getPhase(id: string): Phase | undefined {
  return phases.find((p) => p.id === id);
}

export function getPhaseOfLesson(lessonId: string): Phase | undefined {
  const lesson = getLesson(lessonId);
  if (!lesson) return undefined;
  return getPhase(lesson.phaseId);
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  const phase = getPhase(phaseId);
  if (!phase) return [];
  return phase.lessonIds
    .map((id) => getLesson(id))
    .filter((l): l is Lesson => Boolean(l));
}

export function getNextLesson(currentId: string): Lesson | undefined {
  const idx = lessons.findIndex((l) => l.id === currentId);
  if (idx === -1 || idx >= lessons.length - 1) return undefined;
  return lessons[idx + 1];
}

export function getPrevLesson(currentId: string): Lesson | undefined {
  const idx = lessons.findIndex((l) => l.id === currentId);
  if (idx <= 0) return undefined;
  return lessons[idx - 1];
}
