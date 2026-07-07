export type PriorityKey = "low" | "medium" | "high";
export type StatusKey = "backlog" | "active" | "done";

export interface Task {
  id: number;
  title: string;
  priority: PriorityKey;
  status: StatusKey;
  dueDate?: string;
  notes?: string;
  assignee?: string;
}

export const PRIORITY: Record<PriorityKey, { label: string; color: string }> = {
  low: { label: "Low", color: "#6B8F71" },
  medium: { label: "Medium", color: "#C98A2E" },
  high: { label: "High", color: "#C24A4A" },
};

export const COLUMNS: { id: StatusKey; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "active", label: "In Progress" },
  { id: "done", label: "Done" },
];
