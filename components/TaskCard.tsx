"use client";

import { Check, GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Priority, Task } from "@/lib/types";

const labels: Record<Priority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

const colors: Record<Priority, string> = {
  low: "bg-emerald-500/20 text-emerald-300",
  medium: "bg-amber-500/20 text-amber-300",
  high: "bg-rose-500/20 text-rose-300",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleDone,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
}) {
  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/task-id", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="group glass neon-ring rounded-2xl p-3 transition hover:-translate-y-0.5 hover:border-neon/40"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium ${task.column === "done" ? "text-slate-400 line-through" : ""}`}>
            {task.title}
          </p>
          {task.notes ? <p className="mt-1 text-xs text-slate-400">{task.notes}</p> : null}
          <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] ${colors[task.priority]}`}>
            {labels[task.priority]}
          </span>
        </div>
        <div className="flex gap-1 opacity-80 transition group-hover:opacity-100">
          <button
            onClick={() => onToggleDone(task.id)}
            className="rounded-lg p-1 hover:bg-white/5 hover:text-neon"
            title="Tamamla"
          >
            <Check className="h-4 w-4" />
          </button>
          <button onClick={() => onEdit(task)} className="rounded-lg p-1 hover:bg-white/5 hover:text-neon">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(task.id)} className="rounded-lg p-1 hover:bg-white/5 hover:text-rose-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
