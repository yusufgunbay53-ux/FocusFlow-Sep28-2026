"use client";

import { Sparkles } from "lucide-react";
import type { Stats } from "@/lib/types";

export default function AiCoach({ stats, message }: { stats: Stats; message: string }) {
  return (
    <div className="glass neon-ring rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2 text-neon">
        <Sparkles className="h-4 w-4" />
        <p className="text-xs uppercase tracking-[0.2em]">AI Performans Koçu</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-200">{message}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat n={stats.completedToday} l="Görev" />
        <Stat n={stats.pomodorosToday} l="Pomodoro" />
        <Stat n={stats.focusMinutesToday} l="Dk odak" />
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        Mock koç — ileride OpenAI / Groq API bağlanabilir (`lib/aiCoach.ts`).
      </p>
    </div>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return (
    <div className="rounded-xl bg-black/25 px-2 py-2">
      <div className="text-lg font-semibold text-neon">{n}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{l}</div>
    </div>
  );
}
