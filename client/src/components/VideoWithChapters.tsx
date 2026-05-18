import { useRef, useState } from "react";
import type { LessonVideo } from "@/data/lessons";
import { Play, Sparkles } from "lucide-react";

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoWithChapters({ video, testIdPrefix }: { video: LessonVideo; testIdPrefix: string }) {
  const [start, setStart] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [version, setVersion] = useState(0); // forces iframe remount on chapter jump

  const jumpTo = (s: number) => {
    setStart(s);
    setVersion((v) => v + 1);
  };

  // No autoplay (accessibility / autism-friendly). rel=0 hides related videos.
  const src = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?start=${start}&rel=0&modestbranding=1`;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="rounded-2xl overflow-hidden bg-muted aspect-video shadow-md ring-1 ring-card-border">
        <iframe
          key={version}
          ref={iframeRef}
          src={src}
          title={video.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
          data-testid={`iframe-${testIdPrefix}`}
        />
      </div>

      <aside aria-label="Capítulos do vídeo" className="rounded-2xl border border-card-border bg-card p-3">
        <div className="px-2 pb-2 pt-1 flex items-center justify-between">
          <h3 className="font-display font-semibold text-sm">Capítulos</h3>
          <span className="text-xs text-muted-foreground">Clique para pular</span>
        </div>
        <ol className="flex flex-col gap-1 max-h-[420px] overflow-y-auto pr-1">
          {video.chapters.map((c, i) => {
            const isActive = c.startSeconds === start;
            return (
              <li key={i}>
                <button
                  onClick={() => jumpTo(c.startSeconds)}
                  data-testid={`button-chapter-${testIdPrefix}-${i}`}
                  className={[
                    "w-full text-left rounded-xl px-3 py-2.5 flex items-start gap-3 transition-colors",
                    "hover-elevate",
                    isActive ? "bg-mint-soft" : "bg-transparent",
                  ].join(" ")}
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-foreground">
                    <Play className="h-3 w-3 fill-current" />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-sm leading-tight">{c.title}</span>
                      {c.bestPart && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-peach px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                          <Sparkles className="h-3 w-3" />
                          Top
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5 font-mono">
                      {fmt(c.startSeconds)}
                    </span>
                    {c.description && (
                      <span className="block text-xs text-muted-foreground mt-1">
                        {c.description}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}
