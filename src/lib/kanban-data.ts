export type Priority = "low" | "medium" | "high"

export type ColumnId = "backlog" | "in-progress" | "review" | "done"

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string | null // ISO date string (yyyy-mm-dd)
  status: ColumnId
}

export interface Column {
  id: ColumnId
  title: string
}

export const COLUMNS: Column[] = [
  { id: "backlog", title: "Backlog" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
]

export const PRIORITY_META: Record<
  Priority,
  { label: string; dot: string; badge: string }
> = {
  low: {
    label: "Low",
    dot: "bg-emerald-400/80",
    badge: "border-transparent bg-emerald-500/[0.08] text-emerald-200/90",
  },
  medium: {
    label: "Medium",
    dot: "bg-amber-400/80",
    badge: "border-transparent bg-amber-500/[0.08] text-amber-200/90",
  },
  high: {
    label: "High",
    dot: "bg-rose-400/80",
    badge: "border-transparent bg-rose-500/[0.08] text-rose-200/90",
  },
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    title: "Design onboarding flow",
    description: "Wireframe the 3-step welcome experience for new users.",
    priority: "high",
    dueDate: "2026-07-14",
    status: "backlog",
  },
  {
    id: "t2",
    title: "Research competitor pricing",
    description: "Compile a table of pricing tiers across the top 5 competitors.",
    priority: "low",
    dueDate: "2026-07-22",
    status: "backlog",
  },
  {
    id: "t3",
    title: "Build authentication API",
    description: "Implement email + password login with session management.",
    priority: "high",
    dueDate: "2026-07-12",
    status: "in-progress",
  },
  {
    id: "t4",
    title: "Migrate analytics events",
    description: "Move legacy tracking to the new event schema.",
    priority: "medium",
    dueDate: "2026-07-18",
    status: "in-progress",
  },
  {
    id: "t5",
    title: "Review landing page copy",
    description: "Proofread and tighten the hero and feature sections.",
    priority: "medium",
    dueDate: "2026-07-11",
    status: "review",
  },
  {
    id: "t6",
    title: "Set up CI pipeline",
    description: "Add lint, type-check, and test steps to the deploy workflow.",
    priority: "low",
    dueDate: "2026-07-09",
    status: "done",
  },
  {
    id: "t7",
    title: "Publish design tokens",
    description: "Export color and spacing tokens to the shared package.",
    priority: "medium",
    dueDate: null,
    status: "done",
  },
]
