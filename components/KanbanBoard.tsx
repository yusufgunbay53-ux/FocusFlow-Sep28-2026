"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import type { ColumnId, Priority, Task } from "@/lib/types";
import TaskCard from "./TaskCard";

const COLS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "Yapılacaklar" },
  { id: "doing", title: "Yapılıyor" },
  { id: "done", title: "Tamamlandı" },
];

export default function KanbanBoard({
  tasks,
  onChange,
}: {
  tasks: Task[];
  onChange: (next: Task[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [editing, setEditing] = useState<Task | null>(null);

  const add = () => {
    const t = title.trim();
    if (!t) return;
    if (editing) {
      onChange(tasks.map((x) => (x.id === editing.id ? { ...x, title: t, priority } : x)));
      setEditing(null);
    } else {
      onChange([
        ...tasks,
        {
          id: crypto.randomUUID(),
          title: t,
          priority,
          column: "todo",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setTitle("");
    setPriority("medium");
  };

  const move = (id: string, column: ColumnId) => {
    onChange(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              column,
              completedAt: column === "done" ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  return (
    <section className="space-y-4">
      <div className="glass neon-ring flex flex-col gap-2 rounded-2xl p-3 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={editing ? "Görevi güncelle..." : "Yeni görev ekle..."}
          className="flex-1 rounded-xl bg-black/30 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-neon/50"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-xl bg-black/30 px-3 py-2 text-sm outline-none ring-1 ring-white/10"
        >
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>
        <button
          onClick={add}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-neon/20 px-4 py-2 text-sm font-medium text-neon transition hover:bg-neon/30"
        >
          <Plus className="h-4 w-4" />
          {editing ? "Kaydet" : "Ekle"}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {COLS.map((col) => (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("text/task-id");
              if (id) move(id, col.id);
            }}
            className="glass min-h-[280px] rounded-2xl p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide text-slate-200">{col.title}</h3>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
                {tasks.filter((t) => t.column === col.id).length}
              </span>
            </div>
            <div className="space-y-2">
              {tasks
                .filter((t) => t.column === col.id)
                .map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onEdit={(task) => {
                      setEditing(task);
                      setTitle(task.title);
                      setPriority(task.priority);
                    }}
                    onDelete={(id) => onChange(tasks.filter((x) => x.id !== id))}
                    onToggleDone={(id) => move(id, col.id === "done" ? "todo" : "done")}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
