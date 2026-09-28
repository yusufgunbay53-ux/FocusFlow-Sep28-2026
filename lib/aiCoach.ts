import type { AppState, Stats } from "./types";
import { todayKey } from "./storage";

export function computeStats(state: AppState): Stats {
  const today = todayKey();
  const completedToday = state.tasks.filter(
    (t) => t.column === "done" && t.completedAt?.startsWith(today)
  ).length;
  const todayLogs = state.logs.filter((l) => l.endedAt.startsWith(today));
  const pomodorosToday = todayLogs.filter((l) => l.mode === "focus").length;
  const focusMinutesToday = Math.round(
    todayLogs.filter((l) => l.mode === "focus").reduce((a, l) => a + l.durationSec, 0) / 60
  );
  const last = [...state.tasks]
    .filter((t) => t.completedAt)
    .sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""))[0];
  return { completedToday, pomodorosToday, focusMinutesToday, lastCompletedAt: last?.completedAt };
}

export function coachMessage(stats: Stats, doingCount: number): string {
  if (stats.completedToday >= 5 && stats.pomodorosToday >= 3) {
    return "Bugün harika gidiyorsun! Ritmini koru, kısa bir su molası iyi gelir.";
  }
  if (doingCount > 3) {
    return "Aynı anda çok fazla iş açık. Tek bir yüksek öncelikli göreve odaklan.";
  }
  if (stats.completedToday === 0 && stats.pomodorosToday === 0) {
    return "Hadi başlayalım. 25 dakikalık tek bir pomodoro ile günü aç.";
  }
  if (stats.pomodorosToday >= 2 && stats.completedToday === 0) {
    return "Odak sürelerin var ama görev kapanmıyor. İşleri daha küçük parçalara böl.";
  }
  if (stats.focusMinutesToday >= 50) {
    return "Biraz yavaşladın gibi. 5 dakika mola vermek ister misin?";
  }
  return "İstikrarlı ilerliyorsun. Sıradaki görevi seç ve bir pomodoro başlat.";
}
