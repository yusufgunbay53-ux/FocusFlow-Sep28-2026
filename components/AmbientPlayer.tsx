"use client";

import { CloudRain, Music2, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AmbientEngine, type SoundMode } from "@/lib/audio";

export default function AmbientPlayer() {
  const engine = useRef<AmbientEngine | null>(null);
  const [mode, setMode] = useState<SoundMode>("off");
  const [vol, setVol] = useState(0.22);

  useEffect(() => {
    engine.current = new AmbientEngine();
    return () => engine.current?.stop();
  }, []);

  useEffect(() => {
    engine.current?.setVolume(vol);
  }, [vol]);

  const pick = (m: SoundMode) => {
    const next = mode === m ? "off" : m;
    setMode(next);
    engine.current?.play(next);
  };

  return (
    <div className="glass neon-ring rounded-2xl p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neon/80">Ortam Sesi</p>
      <div className="flex gap-2">
        <button
          onClick={() => pick("lofi")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
            mode === "lofi" ? "bg-neon/20 text-neon" : "bg-white/5 hover:bg-white/10"
          }`}
        >
          <Music2 className="h-4 w-4" /> Lo-Fi
        </button>
        <button
          onClick={() => pick("rain")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
            mode === "rain" ? "bg-neon/20 text-neon" : "bg-white/5 hover:bg-white/10"
          }`}
        >
          <CloudRain className="h-4 w-4" /> Yağmur
        </button>
      </div>
      <label className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <Volume2 className="h-4 w-4" />
        <input
          type="range"
          min={0}
          max={0.6}
          step={0.01}
          value={vol}
          onChange={(e) => setVol(Number(e.target.value))}
          className="w-full accent-[#00d2ff]"
        />
      </label>
    </div>
  );
}
