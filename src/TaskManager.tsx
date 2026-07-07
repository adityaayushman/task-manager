import { useState, useMemo, useEffect } from "react";
import { Plus, X, Search, ChevronRight, Circle, CheckCircle2 } from "lucide-react";

type PriorityKey = "low" | "medium" | "high";
type StatusKey = "backlog" | "active" | "done";

interface Task {
  id: number;
  title: string;
  priority: PriorityKey;
  status: StatusKey;
}

interface PriorityInfo {
  label: string;
  color: string;
  stripe: string;
}

const PRIORITY: Record<PriorityKey, PriorityInfo> = {
  low: { label: "Low", color: "#6B8F71", stripe: "#A8C3AC" },
  medium: { label: "Medium", color: "#C98A2E", stripe: "#E8C088" },
  high: { label: "High", color: "#C24A4A", stripe: "#E8A0A0" },
};

const COLUMNS: { id: StatusKey; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "active", label: "In Progress" },
  { id: "done", label: "Done" },
];

const seedTasks: Task[] = [
  { id: 1, title: "Set up project repo", priority: "medium", status: "done" },
  { id: 2, title: "Draft component structure", priority: "high", status: "active" },
  { id: 3, title: "Write API integration notes", priority: "low", status: "backlog" },
];


export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : seedTasks;
  });

  const [nextId, setNextId] = useState<number>(() => {
    const saved = localStorage.getItem("tasks");
    const parsed: Task[] = saved ? JSON.parse(saved) : seedTasks;
    return Math.max(0, ...parsed.map((t) => t.id)) + 1;
  });

  const [query, setQuery] = useState<string>("");
  const [draft, setDraft] = useState<string>("");
  const [draftPriority, setDraftPriority] = useState<PriorityKey>("medium");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (): void => {
    const title = draft.trim();
    if (!title) return;
    setTasks((t) => [...t, { id: nextId, title, priority: draftPriority, status: "backlog" }]);
    setNextId((n) => n + 1);
    setDraft("");
  };

  const moveTask = (id: number, status: StatusKey): void => {
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, status } : task)));
  };

  const removeTask = (id: number): void => {
    setTasks((t) => t.filter((task) => task.id !== id));
  };

  const startEdit = (task: Task): void => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const commitEdit = (id: number): void => {
    const title = editText.trim();
    if (title) {
      setTasks((t) => t.map((task) => (task.id === id ? { ...task, title } : task)));
    }
    setEditingId(null);
  };

  const nextStatus = (status: StatusKey): StatusKey => {
    const idx = COLUMNS.findIndex((c) => c.id === status);
    return COLUMNS[Math.min(idx + 1, COLUMNS.length - 1)].id;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, query]);

  const byColumn = (colId: StatusKey): Task[] => filtered.filter((t) => t.status === colId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Task Manager</h1>
          <p className="text-slate-400">Organize and track your tasks efficiently</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add Task Form */}
        <div className="mb-8 bg-slate-700 p-4 rounded-lg">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Add a new task..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              className="flex-1 bg-slate-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={draftPriority}
              onChange={(e) => setDraftPriority(e.target.value as PriorityKey)}
              className="bg-slate-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Plus size={20} /> Add
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => (
            <div key={column.id} className="bg-slate-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-4">{column.label}</h2>
              <div className="space-y-3">
                {byColumn(column.id).map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-600 p-3 rounded-lg border-l-4"
                    style={{ borderColor: PRIORITY[task.priority].color }}
                  >
                    {editingId === task.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && commitEdit(task.id)}
                          className="flex-1 bg-slate-500 text-white px-2 py-1 rounded focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => commitEdit(task.id)}
                          className="text-green-400 hover:text-green-300"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="flex-1 cursor-pointer text-white hover:text-slate-200"
                          onClick={() => startEdit(task)}
                        >
                          <div className="flex items-center gap-2">
                            {task.status === "done" ? (
                              <CheckCircle2 size={18} className="text-green-400" />
                            ) : (
                              <Circle size={18} className="text-slate-400" />
                            )}
                            <span
                              className={
                                task.status === "done"
                                  ? "line-through text-slate-400"
                                  : ""
                              }
                            >
                              {task.title}
                            </span>
                          </div>
                          <div className="text-xs mt-1 text-slate-400 ml-6">
                            {PRIORITY[task.priority].label} Priority
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {column.id !== "done" && (
                            <button
                              onClick={() => moveTask(task.id, nextStatus(task.status))}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <ChevronRight size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => removeTask(task.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}