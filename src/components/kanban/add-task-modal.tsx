"use client"

import { useEffect, useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  COLUMNS,
  PRIORITY_META,
  type ColumnId,
  type Priority,
  type Task,
} from "@/lib/kanban-data"

interface AddTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultStatus?: ColumnId
  onAdd: (task: Omit<Task, "id">) => void
}

const PRIORITIES: Priority[] = ["low", "medium", "high"]

export function AddTaskModal({
  open,
  onOpenChange,
  defaultStatus = "backlog",
  onAdd,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState<ColumnId>(defaultStatus)

  useEffect(() => {
    if (open) setStatus(defaultStatus)
  }, [open, defaultStatus])

  function reset() {
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate("")
    setStatus(defaultStatus)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
      status,
    })
    reset()
    onOpenChange(false)
  }

  const fieldClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-ring/30"

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-border bg-card p-5 shadow-2xl outline-none",
            "transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <Dialog.Title className="text-base font-semibold text-card-foreground">
                Add new task
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-sm text-muted-foreground">
                Fill in the details to create a task.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-title" className="text-xs font-medium text-foreground">
                Title
              </label>
              <input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design the settings page"
                className={fieldClass}
                autoFocus
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-desc" className="text-xs font-medium text-foreground">
                Description
              </label>
              <textarea
                id="task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a short description..."
                rows={3}
                className={cn(fieldClass, "resize-none")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-foreground">Priority</span>
              <div className="grid grid-cols-3 gap-2">
                {PRIORITIES.map((p) => {
                  const meta = PRIORITY_META[p]
                  const active = priority === p
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-sm font-medium transition-all",
                        active
                          ? meta.badge
                          : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", meta.dot)} />
                      {meta.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="task-due" className="text-xs font-medium text-foreground">
                  Due date
                </label>
                <input
                  id="task-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={cn(fieldClass, "[color-scheme:dark]")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="task-status" className="text-xs font-medium text-foreground">
                  Column
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ColumnId)}
                  className={cn(fieldClass, "cursor-pointer appearance-none")}
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-end gap-2">
              <Dialog.Close className="rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add task
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
