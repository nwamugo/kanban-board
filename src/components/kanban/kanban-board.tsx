"use client"

import { useEffect, useMemo, useState } from "react"
import { LayoutGrid, Plus, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  COLUMNS,
  INITIAL_TASKS,
  PRIORITY_META,
  PRIORITY_ORDER,
  type ColumnId,
  type Priority,
  type Task,
} from "@/lib/kanban-data"
import { TaskCard } from "./task-card"
import { AddTaskModal } from "./add-task-modal"

const PRIORITY_FILTERS: Priority[] = ["high", "medium", "low"]

const COLUMN_ACCENT: Record<ColumnId, string> = {
  backlog: "bg-slate-400",
  "in-progress": "bg-primary",
  review: "bg-amber-400",
  done: "bg-emerald-400",
}

const STORAGE_KEY = "flowboard.tasks.v1"

function loadTasks(): Task[] {
  if (typeof window === "undefined") return INITIAL_TASKS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_TASKS
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Task[]) : INITIAL_TASKS
  } catch {
    return INITIAL_TASKS
  }
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [query, setQuery] = useState("")
  const [priorityFilters, setPriorityFilters] = useState<Set<Priority>>(
    () => new Set(),
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // storage unavailable (e.g. private mode) — ignore
    }
  }, [tasks])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalStatus, setModalStatus] = useState<ColumnId>("backlog")
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const hasPriorityFilter = priorityFilters.size > 0
    if (!q && !hasPriorityFilter) return tasks
    return tasks.filter((t) => {
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      const matchesPriority =
        !hasPriorityFilter || priorityFilters.has(t.priority)
      return matchesQuery && matchesPriority
    })
  }, [tasks, query, priorityFilters])

  function togglePriority(priority: Priority) {
    setPriorityFilters((prev) => {
      const next = new Set(prev)
      if (next.has(priority)) next.delete(priority)
      else next.add(priority)
      return next
    })
  }

  function clearFilters() {
    setQuery("")
    setPriorityFilters(new Set())
  }

  const hasActiveFilters = query.trim() !== "" || priorityFilters.size > 0

  const byColumn = useMemo(() => {
    const map: Record<ColumnId, Task[]> = {
      backlog: [],
      "in-progress": [],
      review: [],
      done: [],
    }
    for (const task of filtered) map[task.status].push(task)
    for (const id of Object.keys(map) as ColumnId[]) {
      map[id].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    }
    return map
  }, [filtered])

  function handleAdd(task: Omit<Task, "id">) {
    setTasks((prev) => [
      { ...task, id: `t${Date.now()}` },
      ...prev,
    ])
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function handleDropOnColumn(columnId: ColumnId) {
    if (!draggingId) return
    setTasks((prev) =>
      prev.map((t) => (t.id === draggingId ? { ...t, status: columnId } : t)),
    )
    setDraggingId(null)
    setDragOverColumn(null)
  }

  function openModalFor(status: ColumnId) {
    setModalStatus(status)
    setModalOpen(true)
  }

  const doneCount = useMemo(
    () => tasks.filter((t) => t.status === "done").length,
    [tasks],
  )
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
              <LayoutGrid className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Flowboard
              </h1>
              <p className="text-sm text-muted-foreground">
                {tasks.length} tasks across {COLUMNS.length} columns
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-72 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks..."
                aria-label="Search tasks"
                className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-ring/30"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => openModalFor("backlog")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">New task</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Priority
          </span>
          {PRIORITY_FILTERS.map((priority) => {
            const active = priorityFilters.has(priority)
            const meta = PRIORITY_META[priority]
            return (
              <button
                key={priority}
                type="button"
                onClick={() => togglePriority(priority)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                <span className={cn("size-2 rounded-full", meta.dot)} />
                {meta.label}
              </button>
            )
          })}
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
              Clear
            </button>
          ) : null}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tasks completed"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
            {doneCount}/{tasks.length} done · {progress}%
          </span>
        </div>
      </header>

      {/* Board */}
      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((column) => {
          const columnTasks = byColumn[column.id]
          const isOver = dragOverColumn === column.id
          return (
            <section
              key={column.id}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverColumn(column.id)
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDragOverColumn((prev) => (prev === column.id ? null : prev))
                }
              }}
              onDrop={() => handleDropOnColumn(column.id)}
              className={cn(
                "flex flex-col rounded-2xl border border-border bg-sidebar/60 transition-colors",
                isOver && "border-primary/50 bg-primary/5",
              )}
            >
              <div className="flex items-center justify-between gap-2 px-3.5 pt-3.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn("size-2 rounded-full", COLUMN_ACCENT[column.id])}
                  />
                  <h2 className="text-sm font-semibold text-foreground">
                    {column.title}
                  </h2>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {columnTasks.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openModalFor(column.id)}
                  aria-label={`Add task to ${column.title}`}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-2.5 p-3.5">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isDragging={draggingId === task.id}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move"
                      setDraggingId(task.id)
                    }}
                    onDragEnd={() => {
                      setDraggingId(null)
                      setDragOverColumn(null)
                    }}
                    onDelete={handleDelete}
                  />
                ))}

                {columnTasks.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => openModalFor(column.id)}
                    className={cn(
                      "flex min-h-24 flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
                      isOver && "border-primary/50 text-foreground",
                    )}
                  >
                    <Plus className="size-4" />
                    {query ? "No matching tasks" : "Add a task"}
                  </button>
                ) : null}
              </div>
            </section>
          )
        })}
      </div>

      <AddTaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultStatus={modalStatus}
        onAdd={handleAdd}
      />
    </div>
  )
}
