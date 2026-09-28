export type Priority = "low" | "medium" | "high";
export type ColumnId = "todo" | "doing" | "done";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  column: ColumnId;
  createdAt: string;
  completedAt?: string;
}

export interface PomodoroLog {
  id: string;
  mode: "focus" | "break";
  startedAt: string;
  endedAt: string;
  durationSec: number;
}

export interface Stats {
  completedToday: number;
  pomodorosToday: number;
  focusMinutesToday: number;
  lastCompletedAt?: string;
}

export interface AppState {
  tasks: Task[];
  logs: PomodoroLog[];
}
