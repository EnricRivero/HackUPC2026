"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import { GitTreeVisualizer } from "@/components/git-tree-visualizer";
import type { PendingAction } from "@/lib/types";

type ConfirmationModalProps = {
  pending: PendingAction;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmationModal({ pending, onClose, onConfirm }: ConfirmationModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-cyan-500/10"
        initial={{ y: 18, opacity: 0, scale: 0.985 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 10, opacity: 0, scale: 0.985 }}
        transition={{ duration: 0.22 }}
      >
        <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              Copia de seguridad antes de actuar
            </div>
            <h2 className="text-2xl font-semibold text-white">Comparacion de seguridad</h2>
            <p className="max-w-2xl text-sm text-slate-300">
              Para hacer esto, voy a crear una &quot;Copia de Seguridad&quot;. Esto guardara tu
              trabajo actual en el {pending.backupLabel} para que nunca lo pierdas. ¿Confirmas?
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <span className="mr-2 text-slate-400">Accion traducida:</span>
            <span className="font-medium text-white">{pending.summary}</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
              <Sparkles className="h-4 w-4 text-slate-400" />
              Antes
            </div>
            <GitTreeVisualizer repository={pending.before} compact />
          </div>
          <div className="rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/5 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-cyan-100">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Despues
            </div>
            <GitTreeVisualizer repository={pending.after} compact />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:bg-cyan-100"
          >
            Confirmar y continuar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
