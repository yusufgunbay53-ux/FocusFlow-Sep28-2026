"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PomodoroLog } from "@/lib/types";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

function beep() {
  const ctx = new AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.value = 880;
  o.type = "sine";
  o.connect(g);
  g.connect(ctx.destination);
  g.gain.value = 0.08;
  o.start();
  setTimeout(() => {
    o.stop();
    ctx.close();
  }, 420);
}

export default function Pomodoro({ onLog }: { onLog: (log: PomodoroLog) => void }) {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [left, setLeft] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const startedAt = useRef<string | null>(null);

  const total = mode === "focus" ? FOCUS : BREAK;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (left > 0) return;
    setRunning(false);
    beep();
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(mode === "focus" ? "Pomodoro bitti — 5 dk mola" : "Mola bitti — odak zamanı");
    }
    if (startedAt.current) {
      onLog({
        id: crypto.randomUUID(),
        mode,
        startedAt: startedAt.current,
        endedAt: new Date().toISOString(),
        durationSec: total,
      });
    }
    const next = mode === "focus" ? "break" : "focus";
    setMode(next);
    setLeft(next === "focus" ? FOCUS : BREAK);
    startedAt.current = null;
  }, [left, mode, onLog, total]);

  const mmss = useMemo(() => {
    const s = Math.max(0, left);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }, [left]);

  const pct = 1 - left / total;

  return (
    <div className="glass neon-ring rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-neon/80">
        {mode === "focus" ? "Odak" : "Mola"}
      </p>
      <div className="relative mx-auto my-4 h-44 w-44">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#00d2ff"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${(1 - pct) * 2 * Math.PI * 42}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-4xl font-semibold tabular-nums">{mmss}</div>
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={async () => {
            if ("Notification" in window && Notification.permission === "default") {
              await Notification.requestPermission();
            }
            if (!running) startedAt.current = new Date().toISOString();
            setRunning((v) => !v);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-neon/20 px-4 py-2 text-sm text-neon hover:bg-neon/30"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Duraklat" : "Başlat"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setLeft(total);
            startedAt.current = null;
          }}
          className="rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
