import { useState, useMemo, useEffect } from "react";
import { Plus, X, Search, ChevronRight, Circle, CheckCircle2, Filter } from "lucide-react";

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

export default function Tasks() {
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
  const [filterPriority, setFilterPriority] = useState<PriorityKey | "all">("all");

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
    let result = tasks;
    
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    if (filterPriority !== "all") {
      result = result.filter((t) => t.priority === filterPriority);
    }

    return result;
  }, [tasks, query, filterPriority]);

  const byColumn = (colId: StatusKey): Task[] => filtered.filter((t) => t.status === colId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Task Management</h2>
        <p className="text-slate-400">Organize and track your tasks with our Kanban board</p>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 bg-slate-700 rounded-lg px-4 py-2">
            <Search className="text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-700 rounded-lg px-4 py-2">
            <Filter size={20} className="text-slate-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as PriorityKey | "all")}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Add a new task..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={draftPriority}
            onChange={(e) => setDraftPriority(e.target.value as PriorityKey)}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 font-semibold"
          >
            <Plus size={20} /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((column) => (
          <div key={column.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{column.label}</h3>
              <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm font-semibold">
                {byColumn(column.id).length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-3 min-h-96">
              {byColumn(column.id).map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-700 p-4 rounded-lg border-l-4 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200"
                  style={{ borderColor: PRIORITY[task.priority].color }}
                >
                  {editingId === task.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && commitEdit(task.id)}
                        className="flex-1 bg-slate-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => commitEdit(task.id)}
                        className="text-green-400 hover:text-green-300 font-bold px-2"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Title */}
                      <div
                        className="flex items-start gap-2 cursor-pointer group"
                        onClick={() => startEdit(task)}
                      >
                        {task.status === "done" ? (
                          <CheckCircle2 size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`flex-1 ${
                            task.status === "done"
                              ? "line-through text-slate-400"
                              : "text-white group-hover:text-blue-300"
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className="px-2 py-1 rounded"
                          style={{ backgroundColor: PRIORITY[task.priority].stripe }}
                        >
                          {PRIORITY[task.priority].label}
                        </span>
                        <div className="flex gap-1">
                          {column.id !== "done" && (
                            <button
                              onClick={() => moveTask(task.id, nextStatus(task.status))}
                              className="text-blue-400 hover:text-blue-300 hover:bg-slate-600 p-1 rounded transition-colors duration-200"
                              title="Move to next column"
                            >
                              <ChevronRight size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => removeTask(task.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-slate-600 p-1 rounded transition-colors duration-200"
                            title="Delete task"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {byColumn(column.id).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm">No tasks yet</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
