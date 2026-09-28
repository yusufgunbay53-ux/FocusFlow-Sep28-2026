"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AiCoach from "@/components/AiCoach";
import AmbientPlayer from "@/components/AmbientPlayer";
import KanbanBoard from "@/components/KanbanBoard";
import Pomodoro from "@/components/Pomodoro";
import { coachMessage, computeStats } from "@/lib/aiCoach";
import { loadState, saveState } from "@/lib/storage";
import type { AppState } from "@/lib/types";

export default function HomePage() {
  const [state, setState] = useState<AppState>({ tasks: [], logs: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const stats = useMemo(() => computeStats(state), [state]);
  const message = useMemo(
    () => coachMessage(stats, state.tasks.filter((t) => t.column === "doing").length),
    [stats, state.tasks]
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-neon/15 text-neon shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">FocusFlow</h1>
            <p className="text-xs text-slate-400">AI destekli görev ve odaklanma asistanı</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <KanbanBoard tasks={state.tasks} onChange={(tasks) => setState((s) => ({ ...s, tasks }))} />
        <aside className="space-y-4">
          <Pomodoro onLog={(log) => setState((s) => ({ ...s, logs: [...s.logs, log] }))} />
          <AmbientPlayer />
          <AiCoach stats={stats} message={message} />
        </aside>
      </div>
    </main>
  );
}
