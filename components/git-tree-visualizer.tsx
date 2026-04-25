"use client";

import { motion } from "framer-motion";
import { ArrowUpToLine, Cloud, GitBranch, ShieldCheck } from "lucide-react";

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

function formatTime(timestamp: string) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function SavePointItem({
  point,
  isLatest,
}: {
  point: SavePoint;
  isLatest: boolean;
}) {
  const Icon = iconMap[point.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="relative pl-8"
    >
      {!isLatest ? (
        <div className="absolute left-[13px] top-8 h-[calc(100%+0.9rem)] w-px bg-white/10" />
      ) : null}

      <div
        className={[
          "absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border",
          isLatest
            ? "border-emerald-400/80 bg-emerald-400/20 text-emerald-100"
            : "border-white/10 bg-white/5 text-white/70",
        ].join(" ")}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div
        className={[
          "rounded-2xl border p-4 backdrop-blur-sm transition",
          isLatest
            ? "border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_40px_rgba(16,185,129,0.12)]"
            : "border-white/10 bg-white/[0.04]",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white">{point.label}</p>
            <p className="mt-1 text-xs text-white/50">{point.description}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
            {point.id}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-white/45">
          <span>{formatTime(point.timestamp)}</span>
          <span className="rounded-full bg-black/20 px-2 py-1 text-white/55">
            {point.type === "commit"
              ? "Guardado"
              : point.type === "push"
                ? "Sincronizado"
                : "Restaurado"}
          </span>
        </div>
      </div>
    </motion.div>
  );
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

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/35">{title}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">La historia de tu proyecto</h2>
          <p className="mt-1 text-sm text-white/55">
            Cada punto guarda una copia segura para poder volver cuando quieras.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60">
          <GitBranch className="h-4 w-4" />
          <span>{current.branchName}</span>
        </div>
      </div>

      <div className="space-y-4">
        {points.map((point, index) => (
          <SavePointItem key={point.id} point={point} isLatest={index === points.length - 1} />
        ))}
      </div>
    </div>
  );
}
