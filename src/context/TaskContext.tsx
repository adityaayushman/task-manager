import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { Task, StatusKey, PriorityKey } from "../types";

const seedTasks: Task[] = [
  { id: 1, title: "Set up project repo", priority: "medium", status: "done", dueDate: "2026-07-02" },
  { id: 2, title: "Draft component structure", priority: "high", status: "active", dueDate: "2026-07-09" },
  { id: 3, title: "Write API integration notes", priority: "low", status: "backlog", dueDate: "2026-07-15" },
];

interface TaskContextValue {
  tasks: Task[];
  addTask: (title: string, priority: PriorityKey, dueDate?: string, notes?: string, assignee?: string) => void;
  moveTask: (id: number, status: StatusKey) => void;
  removeTask: (id: number) => void;
  editTask: (id: number, title: string, dueDate?: string, notes?: string, assignee?: string) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? (JSON.parse(saved) as Task[]) : seedTasks;
    } catch {
      return seedTasks;
    }
  });

  const nextIdRef = useRef<number>(
    (() => {
      try {
        const saved = localStorage.getItem("tasks");
        const parsed: Task[] = saved ? (JSON.parse(saved) as Task[]) : seedTasks;
        return Math.max(0, ...parsed.map((task) => task.id)) + 1;
      } catch {
        return seedTasks.length + 1;
      }
    })()
  );

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch {
      // Ignore storage write errors in restricted environments.
    }
  }, [tasks]);

  const addTask = (title: string, priority: PriorityKey, dueDate?: string, notes?: string, assignee?: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const id = nextIdRef.current;
    nextIdRef.current += 1;

    setTasks((current) => [...current, { id, title: trimmed, priority, status: "backlog", dueDate, notes, assignee }]);
  };

  const moveTask = (id: number, status: StatusKey) =>
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, status } : task)));

  const removeTask = (id: number) => setTasks((current) => current.filter((task) => task.id !== id));

  const editTask = (id: number, title: string, dueDate?: string, notes?: string, assignee?: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, title: trimmed, dueDate, notes, assignee } : task)));
  };

  return <TaskContext.Provider value={{ tasks, addTask, moveTask, removeTask, editTask }}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within TaskProvider");
  return context;
}
