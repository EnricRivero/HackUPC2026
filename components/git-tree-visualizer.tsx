"use client";

import { motion } from "framer-motion";
import { ArrowUpToLine, Cloud, GitBranch, ShieldCheck, Sparkles } from "lucide-react";

import type { RepositoryState, SavePoint } from "@/lib/types";

type GitTreeVisualizerProps = {
  repository: RepositoryState;
  pending?: RepositoryState;
  title?: string;
  compact?: boolean;
};

const iconMap = {
  commit: ShieldCheck,
  push: Cloud,
  restore: ArrowUpToLine,
} as const;

const laneMap = {
  commit: 0,
  push: 1,
  restore: -1,
} as const;

const lanePalette = {
  "-1": {
    dot: "bg-amber-300 border-amber-200/80 text-slate-950",
    glow: "shadow-[0_0_36px_rgba(251,191,36,0.2)]",
    line: "stroke-amber-300/40",
    pill: "bg-amber-400/10 border-amber-300/20 text-amber-100",
  },
  "0": {
    dot: "bg-emerald-300 border-emerald-200/80 text-slate-950",
    glow: "shadow-[0_0_36px_rgba(52,211,153,0.18)]",
    line: "stroke-emerald-300/35",
    pill: "bg-emerald-400/10 border-emerald-300/20 text-emerald-100",
  },
  "1": {
    dot: "bg-cyan-300 border-cyan-200/80 text-slate-950",
    glow: "shadow-[0_0_36px_rgba(34,211,238,0.18)]",
    line: "stroke-cyan-300/35",
    pill: "bg-cyan-400/10 border-cyan-300/20 text-cyan-100",
  },
} as const;

function formatTime(timestamp: string) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function GitTreeVisualizer({
  repository,
  pending,
  title = "Mapa de Historia",
  compact = false,
}: GitTreeVisualizerProps) {
  const current = pending ?? repository;
  const points = compact
    ? current.commits.slice(Math.max(current.commits.length - 3, 0))
    : current.commits;
  const laneXs = compact ? { "-1": 22, "0": 50, "1": 78 } : { "-1": 16, "0": 50, "1": 84 };
  const rowGap = compact ? 90 : 114;
  const topPadding = compact ? 36 : 54;
  const svgHeight = Math.max(topPadding * 2 + (points.length - 1) * rowGap, compact ? 180 : 260);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/35">{title}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Linea temporal multiverso</h2>
          <p className="mt-1 text-sm text-white/55">
            Cada acción abre un carril visual distinto para que el historial parezca una historia, no comandos.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60">
          <GitBranch className="h-4 w-4" />
          <span>{current.branchName}</span>
        </div>
      </div>

      <div className="rounded-[26px] border border-white/10 bg-slate-950/45 p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            Guardados
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-100">
            <Cloud className="h-3.5 w-3.5" />
            Nube
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-100">
            <ArrowUpToLine className="h-3.5 w-3.5" />
            Saltos
          </span>
        </div>

        <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.7),rgba(2,6,23,0.9))] p-3">
          <div className="absolute inset-y-0 left-[16%] border-l border-dashed border-white/8" />
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-white/8" />
          <div className="absolute inset-y-0 left-[84%] -translate-x-full border-l border-dashed border-white/8" />

          <svg viewBox={`0 0 100 ${svgHeight}`} className="absolute inset-0 h-full w-full">
            {points.map((point, index) => {
              if (index === 0) {
                return null;
              }

              const previous = points[index - 1];
              const previousLane = laneMap[previous.type];
              const lane = laneMap[point.type];
              const startX = laneXs[String(previousLane) as keyof typeof laneXs];
              const endX = laneXs[String(lane) as keyof typeof laneXs];
              const startY = topPadding + (index - 1) * rowGap;
              const endY = topPadding + index * rowGap;
              const curveY = (startY + endY) / 2;
              const palette = lanePalette[String(lane) as keyof typeof lanePalette];

              return (
                <path
                  key={`${previous.id}-${point.id}`}
                  d={`M ${startX} ${startY} C ${startX} ${curveY}, ${endX} ${curveY}, ${endX} ${endY}`}
                  className={`fill-none stroke-[0.75] ${palette.line}`}
                />
              );
            })}
          </svg>

          <div className="relative space-y-4">
            {points.map((point, index) => {
              const Icon = iconMap[point.type];
              const lane = laneMap[point.type];
              const palette = lanePalette[String(lane) as keyof typeof lanePalette];
              const isLatest = index === points.length - 1;
              const lanePosition =
                lane === -1 ? "justify-start" : lane === 0 ? "justify-center" : "justify-end";

              return (
                <motion.div
                  key={point.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  className={`flex min-h-[90px] ${lanePosition}`}
                >
                  <div className="relative w-full max-w-[240px]">
                    <div
                      className={`absolute top-4 ${
                        lane === -1 ? "left-[10px]" : lane === 0 ? "left-1/2 -translate-x-1/2" : "right-[10px]"
                      }`}
                    >
                      <div
                        className={[
                          "flex h-8 w-8 items-center justify-center rounded-full border",
                          palette.dot,
                          palette.glow,
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    <div
                      className={[
                        "rounded-[24px] border p-4 backdrop-blur-sm transition",
                        isLatest
                          ? "border-white/15 bg-white/[0.08] shadow-[0_0_45px_rgba(255,255,255,0.06)]"
                          : "border-white/10 bg-white/[0.04]",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-white">{point.label}</p>
                          <p className="mt-1 text-xs leading-5 text-white/50">{point.description}</p>
                        </div>
                        {isLatest ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-violet-300/20 bg-violet-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-100">
                            <Sparkles className="h-3 w-3" />
                            Ahora
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-white/45">
                        <span>{formatTime(point.timestamp)}</span>
                        <span className={`rounded-full border px-2.5 py-1 ${palette.pill}`}>
                          {point.type === "commit"
                            ? "Guardado"
                            : point.type === "push"
                              ? "Nube"
                              : "Salto"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
