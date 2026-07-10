"use client"

import { CalendarDays, GripVertical, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { PRIORITY_META, type Task } from "@/lib/kanban-data"

interface TaskCardProps {
  task: Task
  isDragging: boolean
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnd: () => void
  onDelete: (id: string) => void
}

function formatDueDate(iso: string) {
  const date = new Date(iso + "T00:00:00")
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.round((date.getTime() - today.getTime()) / 86_400_000)

  const label = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  let tone: "overdue" | "soon" | "normal" = "normal"
  let hint = label
  if (diffDays < 0) {
    tone = "overdue"
    hint = `${label} · overdue`
  } else if (diffDays === 0) {
    tone = "soon"
    hint = "Today"
  } else if (diffDays === 1) {
    tone = "soon"
    hint = "Tomorrow"
  } else if (diffDays <= 3) {
    tone = "soon"
  }

  return { hint, tone }
}

export function TaskCard({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  onDelete,
}: TaskCardProps) {
  const priority = PRIORITY_META[task.priority]
  const due = task.dueDate ? formatDueDate(task.dueDate) : null

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative cursor-grab rounded-xl border border-border bg-card p-3.5 shadow-sm transition-all",
        "hover:border-primary/40 hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
            priority.badge,
          )}
        >
          <span className={cn("size-1.5 rounded-full", priority.dot)} />
          {priority.label}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task ${task.title}`}
            className="rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-destructive/15 hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Trash2 className="size-3.5" />
          </button>
          <GripVertical
            aria-hidden="true"
            className="size-4 text-muted-foreground/50"
          />
        </div>
      </div>

      <h3 className="mt-2.5 text-pretty text-sm font-medium leading-snug text-card-foreground">
        {task.title}
      </h3>
      {task.description ? (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {task.description}
        </p>
      ) : null}

      {due ? (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
              due.tone === "overdue" && "bg-destructive/15 text-destructive",
              due.tone === "soon" && "bg-amber-500/10 text-amber-300",
              due.tone === "normal" && "bg-muted text-muted-foreground",
            )}
          >
            <CalendarDays className="size-3.5" />
            {due.hint}
          </span>
        </div>
      ) : null}
    </div>
  )
}
