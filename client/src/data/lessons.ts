// ============================================================================
//  Code Lab — Curriculum data
// ----------------------------------------------------------------------------
//  Edit this file to add or change lessons. The pages read everything from
//  here, so the teacher should never need to touch React components.
// ============================================================================

import piskelHome from "@/assets/screenshots/piskel-home.png";
import piskelEditorEmpty from "@/assets/screenshots/piskel-editor-empty.jpg";
import piskelColorPicker from "@/assets/screenshots/piskel-color-picker.jpg";
import piskelDrawing from "@/assets/screenshots/piskel-drawing.jpg";
import scratchEditor from "@/assets/screenshots/scratch-editor.png";

export type PhaseColor = "mint" | "lavender" | "peach";

export interface LessonImage {
  src: string;
  caption: string;
  tilt?: "l" | "r" | "l-strong" | "r-strong";
}

export interface LessonStep {
  emoji?: string;
  title: string;
  body: string;
  image?: LessonImage; // optional polaroid image rendered next to the step
}

export interface LessonCheckpoint {
  id: string;
  label: string;
}

export interface LessonMaterial {
  emoji: string;
  label: string;
  url: string;
  hint?: string;
}

export interface Lesson {
  id: string;            // e.g. "aula-1"
  number: number;        // 1..21
  phaseId: string;       // "fase-1" .. "fase-4"
  title: string;
  summary: string;       // short description for cards
  duration: string;      // "1h30"
  status: "ready" | "draft";  // "draft" → renders the friendly "em breve" page
  materials?: LessonMaterial[];
  understanding?: {
    title: string;       // "Entendendo"
    duration: string;    // e.g. "10 min"
    markdown: string;    // full didactic text with inline source citations
    images?: LessonImage[]; // polaroids interleaved in the section
  };
  handsOn?: {
    title: string;
    duration: string;    // "50 min"
    instructions: string;
    steps: LessonStep[];
    checkpoints: LessonCheckpoint[];
  };
  bonus?: {
    title: string;
    duration: string;    // "15 min"
    description: string;
  };
  delivery?: {
    title: string;
    duration: string;    // "15 min"
    description: string;
    driveFolder?: string;
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
  materials: [
    {
      emoji: "🔗",
      label: "Piskel (editor online)",
      url: "https://www.piskelapp.com/",
      hint: "Abre direto no navegador",
    },
    {
      emoji: "📚",
      label: "Documentação oficial",
      url: "https://www.piskelapp.com/help",
      hint: "Guia rápido do Piskel",
    },
    {
      emoji: "🎥",
      label: "Tutorial recomendado",
      url: "https://www.youtube.com/results?search_query=piskel+tutorial+iniciante+portugues",
      hint: "YouTube (link externo)",
    },
    {
      emoji: "💾",
      label: "Pasta da aula no Drive",
      url: "#drive-aula-01",
      hint: "Onde você vai salvar o sprite",
    },
    {
      emoji: "⭐",
      label: "Projeto-exemplo",
      url: "#projeto-exemplo",
      hint: "Sprite pronto pra referência",
    },
  ],
  understanding: {
    title: "Entendendo",
    duration: "10 min",
    markdown: `Antes de pôr a mão no mouse, bora entender três coisinhas que vão deixar a aula muito mais legal. Vai com calma — pode reler quantas vezes quiser.

**O que é pixel art?** Pixel art é um estilo de arte digital feito com pequenos quadradinhos chamados *pixels*, cada um com uma cor sólida. Em vez de pintar com pincel "suave", o artista escolhe pixel por pixel — quase como montar um mosaico. Esse estilo nasceu nos anos 70 e 80 por causa das limitações dos computadores e videogames antigos, mas hoje muita gente usa por escolha estética ([Wikipédia — Pixel art](https://pt.wikipedia.org/wiki/Pixel_art)).

**O que é um sprite?** Um *sprite* é uma imagem que representa um personagem, item ou elemento de um jogo — tipo o Mario, uma moeda, ou um cogumelo. Cada sprite é desenhado num pequeno espaço quadrado e depois o jogo desenha ele na tela na hora certa. Quando você juntar vários sprites parecidinhos um atrás do outro, dá pra fazer animação — é assim que o Mario "anda" ([MDN Web Docs — Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)).

**Por que jogos famosos usam pixel art?** Não é só nostalgia! Pixel art é mais rápida de produzir, ocupa pouquíssimo espaço no computador e tem um charme que muita gente ama. Jogos modernos como *Stardew Valley*, *Celeste* e *Undertale* usam pixel art de propósito porque ela transmite emoção de um jeito único. E claro, clássicos como *Super Mario Bros.* e *Pokémon* viraram lenda exatamente por causa desse visual.

**O que é o Piskel e por que a gente vai usar ele?** O Piskel é um editor de pixel art **gratuito, online e open source** — ou seja, ninguém precisa pagar e o código fonte está disponível pra qualquer um estudar ou melhorar ([site oficial do Piskel](https://www.piskelapp.com/), [Piskel no GitHub](https://github.com/piskelapp/piskel)). Ele funciona direto no navegador, sem instalar nada, e tem tudo que a gente precisa: lápis, balde de tinta, animação por frames, exportar como PNG ou GIF.

**Canvas e resolução — o tamanho importa.** *Canvas* é o nome que dão pra "tela" onde você desenha. No mundo da pixel art, a gente mede o canvas em pixels: **16×16** significa 16 quadradinhos pra cada lado (256 pixels no total). O Mario do Nintendinho cabia num canvas de 16×16. Já o **32×32** tem mais espaço pra detalhe — é o tamanho que vamos usar hoje. Quanto maior o canvas, mais detalhes cabem, mas também mais trabalho dá ([MDN — Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)).

**Por que aprender isso aqui antes de programar?** Porque todo jogo que você for fazer mais pra frente — seja no [Scratch](https://scratch.mit.edu/about), no Construct 3 ou no Roblox — vai precisar de personagens, inimigos e cenários. Se você sabe criar seus próprios sprites, seus jogos têm a sua cara. Ninguém mais no mundo vai ter um personagem igual ao seu.`,
    images: [
      {
        src: piskelHome,
        caption: "Site do Piskel — note o sprite de exemplo (a alpaca!)",
        tilt: "l",
      },
      {
        src: scratchEditor,
        caption: "Mais pra frente, esse personagem vai parar aqui no Scratch",
        tilt: "r",
      },
    ],
  },
  handsOn: {
    title: "Mão na massa — Crie o seu personagem",
    duration: "50 min",
    instructions:
      "Agora é com você! Siga os passos no seu Piskel e marca cada item conforme for terminando. Pode pedir ajuda quando quiser.",
    steps: [
      {
        emoji: "🌐",
        title: "Abrir o Piskel no navegador",
        body: "Vai em **piskelapp.com** e clica no botão azul **Create Sprite** no topo da página. Não precisa criar conta — pode usar como visitante mesmo.",
        image: {
          src: piskelHome,
          caption: "Botão 'Create Sprite' no canto superior direito",
          tilt: "r",
        },
      },
      {
        emoji: "📐",
        title: "Conhecer o editor e escolher o tamanho do canvas (32×32)",
        body: "Vai aparecer o editor com o canvas no meio. À direita tem o painel **Resize** — coloca **32** de largura e **32** de altura e clica em **Resize**. Esse é um tamanho ótimo pra começar.",
        image: {
          src: piskelEditorEmpty,
          caption: "Editor com o canvas vazio pronto pra desenhar",
          tilt: "l",
        },
      },
      {
        emoji: "🎨",
        title: "Escolher a paleta de cores",
        body: "No canto inferior direito tem a paleta. Clica num quadradinho de cor pra abrir o seletor. Começa com 4 ou 5 cores — quanto menos cores, mais bonita fica a pixel art!",
        image: {
          src: piskelColorPicker,
          caption: "Color picker do Piskel — escolha cores com calma",
          tilt: "r",
        },
      },
      {
        emoji: "👤",
        title: "Pintar a cabeça do personagem",
        body: "Usa o lápis (atalho **P**) e pinta uma forma redondinha no topo do canvas. Pode ser cabeça humana, de bicho, robô, alienígena... o que você quiser!",
        image: {
          src: piskelDrawing,
          caption: "Pixel por pixel — o lápis é seu melhor amigo",
          tilt: "l",
        },
      },
      {
        emoji: "🦵",
        title: "Pintar o corpo",
        body: "Logo abaixo da cabeça, desenha o corpo. Lembra que cada quadradinho conta — vai com calma e vai testando.",
      },
      {
        emoji: "👀",
        title: "Adicionar olhos e boca",
        body: "Dois pixelzinhos pretos pros olhos e um traço pra boca. Pronto, ele virou gente! Pode adicionar sobrancelha, sardas, capacete... o céu é o limite.",
      },
      {
        emoji: "💾",
        title: "Salvar como PNG",
        body: "Clica em **Export** no menu da esquerda → aba **PNG** → **Download**. Salva o arquivo na pasta **Aula 01** do seu computador.",
      },
      {
        emoji: "✨",
        title: "Exportar como GIF animado (opcional)",
        body: "Se sobrar tempo, na barra de frames (esquerda) clica em **Duplicate** e mexe um pouquinho no segundo frame. Depois exporta como GIF — vai parecer que o personagem se mexe!",
      },
    ],
    checkpoints: [
      { id: "abri-piskel", label: "Abri o Piskel no navegador" },
      { id: "criei-canvas", label: "Configurei o canvas 32×32" },
      { id: "escolhi-paleta", label: "Escolhi minha paleta de cores" },
      { id: "desenhei-cabeca", label: "Desenhei a cabeça do personagem" },
      { id: "desenhei-corpo", label: "Desenhei o corpo" },
      { id: "adicionei-olhos", label: "Adicionei olhos e boca" },
      { id: "salvei-png", label: "Salvei o sprite como PNG" },
    ],
  },
  bonus: {
    title: "Desafio extra — Troca de roupa",
    duration: "15 min",
    description:
      "Crie uma segunda versão do seu personagem com uma roupa diferente: de pijama, de super-herói, de explorador… Use **Duplicate frame** no Piskel pra não começar do zero. Bônus do bônus: exporta como GIF e o personagem 'troca de roupa' sozinho!",
  },
  delivery: {
    title: "Entrega da aula",
    duration: "15 min",
    description:
      "Salve seu sprite (.png) na pasta **Aula 01 — Meu primeiro personagem** do Google Drive da turma. Manda também uma print pro professor pelo grupo!",
    driveFolder: "#drive-aula-01",
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
