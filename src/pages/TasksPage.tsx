import { useMemo, useState } from "react";
import { Plus, ChevronRight, X, Circle, CheckCircle2, Sparkles, CalendarDays, Filter, PencilLine } from "lucide-react";
import TopBar from "../components/TopBar";
import { useTasks } from "../context/TaskContext";
import { COLUMNS, PRIORITY, StatusKey, PriorityKey, Task } from "../types";

export default function TasksPage() {
  const { tasks, addTask, moveTask, removeTask, editTask } = useTasks();
  const [draft, setDraft] = useState("");
  const [priority, setPriority] = useState<PriorityKey>("medium");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editAssignee, setEditAssignee] = useState("");
  const [editPriority, setEditPriority] = useState<PriorityKey>("medium");
  const [editStatus, setEditStatus] = useState<StatusKey>("backlog");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [assignee, setAssignee] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityKey | "all">("all");
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

  const handleAdd = () => {
    if (!draft.trim()) return;
    addTask(draft, priority, dueDate || undefined, notes || undefined, assignee || undefined);
    setDraft("");
    setDueDate("");
    setNotes("");
    setAssignee("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  };

  const byColumn = useMemo(() => {
    return COLUMNS.reduce<Record<StatusKey, typeof tasks>>((acc, column) => {
      acc[column.id] = tasks.filter((task) => {
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
        return task.status === column.id && matchesStatus && matchesPriority;
      });
      return acc;
    }, {} as Record<StatusKey, typeof tasks>);
  }, [tasks, statusFilter, priorityFilter]);

  const nextStatus = (status: StatusKey): StatusKey => {
    const index = COLUMNS.findIndex((column) => column.id === status);
    return COLUMNS[Math.min(index + 1, COLUMNS.length - 1)].id;
  };

  const completed = tasks.filter((task) => task.status === "done").length;
  const highPriority = tasks.filter((task) => task.priority === "high").length;
  const dueSoon = tasks.filter((task) => task.dueDate && task.dueDate <= new Date().toISOString().slice(0, 10)).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const handleDrop = (status: StatusKey) => {
    if (draggedTaskId !== null) {
      moveTask(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };

  const openEditor = (task: Task) => {
    setEditingTask(task);
    setEditText(task.title);
    setEditDueDate(task.dueDate || "");
    setEditNotes(task.notes || "");
    setEditAssignee(task.assignee || "");
    setEditPriority(task.priority);
    setEditStatus(task.status);
  };

  const saveEdit = () => {
    if (!editingTask) return;
    editTask(editingTask.id, editText, editDueDate || undefined, editNotes || undefined, editAssignee || undefined);
    moveTask(editingTask.id, editStatus);
    setEditingTask(null);
  };

  return (
    <div>
      <TopBar title="Tasks" />
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ background: "linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 100%)", border: "1px solid #E7EBF2", borderRadius: 18, padding: 20, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 420 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 999, background: "rgba(91, 124, 250, 0.12)", color: "#5B7CFA", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
              <Sparkles size={14} /> Daily focus
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Keep your team moving with one clear board.</div>
            <div style={{ fontSize: 13, color: "#64748B" }}>Capture work, prioritize what matters, and move items forward in one calm workflow.</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ minWidth: 116, background: "#FFF", border: "1px solid #E7EBF2", borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 11, color: "#7C86A2", marginBottom: 4 }}>Completed</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{completed}/{tasks.length}</div>
            </div>
            <div style={{ minWidth: 116, background: "#FFF", border: "1px solid #E7EBF2", borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 11, color: "#7C86A2", marginBottom: 4 }}>High priority</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{highPriority}</div>
            </div>
            <div style={{ minWidth: 116, background: "#FFF", border: "1px solid #E7EBF2", borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 11, color: "#7C86A2", marginBottom: 4 }}>Due soon</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{dueSoon}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 16 }}>
          <div style={{ background: "#F8FAFF", border: "1px solid #E7EBF2", borderRadius: 16, padding: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a task"
              style={{ flex: 1, minWidth: 220, border: "1px solid #DDE4F0", borderRadius: 10, padding: "10px 12px", outline: "none", background: "#FFF", color: "#334155" }}
            />
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569" }}>
              <CalendarDays size={14} color="#5B7CFA" />
              <input aria-label="Due date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} style={{ border: "1px solid #DDE4F0", borderRadius: 8, padding: "8px 10px", outline: "none", background: "#FFF" }} />
            </label>
            <input aria-label="Assignee" value={assignee} onChange={(event) => setAssignee(event.target.value)} placeholder="Assignee" style={{ border: "1px solid #DDE4F0", borderRadius: 10, padding: "10px 12px", outline: "none", background: "#FFF", color: "#334155", minWidth: 140 }} />
            <select value={priority} onChange={(event) => setPriority(event.target.value as PriorityKey)} style={{ border: "1px solid #DDE4F0", borderRadius: 10, padding: "10px 12px", outline: "none", background: "#FFF", color: "#334155" }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notes" style={{ width: "100%", minHeight: 60, border: "1px solid #DDE4F0", borderRadius: 10, padding: "10px 12px", outline: "none", background: "#FFF", color: "#334155", resize: "vertical" }} />
            <button onClick={handleAdd} style={{ background: "linear-gradient(135deg, #5B7CFA 0%, #7A5CFF 100%)", color: "#FFF", border: "none", borderRadius: 10, padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 6px 18px rgba(91, 124, 250, 0.25)" }}>
              <Plus size={16} /> Add
            </button>
          </div>
          <div style={{ background: "#FFF", border: "1px solid #E7EBF2", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "#7C86A2", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.16em" }}>Progress</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{progress}%</div>
              <div style={{ marginTop: 10, height: 8, background: "#EEF2FF", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(135deg, #5B7CFA 0%, #7A5CFF 100%)", borderRadius: 999 }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#475569", fontSize: 13 }}>
              <Filter size={14} color="#5B7CFA" />
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>Status</span>
                <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusKey | "all")} style={{ border: "1px solid #DDE4F0", borderRadius: 8, padding: "6px 8px", outline: "none", background: "#FFF" }}>
                  <option value="all">All</option>
                  <option value="backlog">Backlog</option>
                  <option value="active">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>Priority</span>
                <select aria-label="Filter by priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as PriorityKey | "all")} style={{ border: "1px solid #DDE4F0", borderRadius: 8, padding: "6px 8px", outline: "none", background: "#FFF" }}>
                  <option value="all">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
          {COLUMNS.map((column) => (
            <div key={column.id} onDragOver={(event) => event.preventDefault()} onDrop={() => handleDrop(column.id)} style={{ background: "#FFF", border: "1px solid #E7EBF2", borderRadius: 14, padding: 14, minHeight: 360, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: "#111827" }}>{column.label}</div>
                <div style={{ fontSize: 12, color: "#9CA0AE", background: "#F5F7FD", borderRadius: 999, padding: "4px 8px" }}>{byColumn[column.id].length}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {byColumn[column.id].map((task) => (
                  <div key={task.id} draggable onDragStart={() => setDraggedTaskId(task.id)} onDragEnd={() => setDraggedTaskId(null)} style={{ border: "1px solid #EDF1F7", borderRadius: 10, padding: 10, background: "#F9FBFF", cursor: "grab" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          {task.status === "done" ? <CheckCircle2 size={16} color="#6B8F71" /> : <Circle size={16} color="#9CA0AE" />}
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{task.title}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#9CA0AE" }}>{PRIORITY[task.priority].label} • {task.dueDate || "No due date"}</div>
                        {task.notes ? <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{task.notes}</div> : null}
                        {task.assignee ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #5B7CFA 0%, #7A5CFF 100%)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                              {task.assignee.slice(0, 2).toUpperCase()}
                            </div>
                            <span style={{ fontSize: 11, color: "#475569" }}>{task.assignee}</span>
                          </div>
                        ) : null}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <button onClick={() => openEditor(task)} style={{ border: "none", background: "transparent", cursor: "pointer" }}><PencilLine size={15} color="#5B7CFA" /></button>
                        {column.id !== "done" && <button onClick={() => moveTask(task.id, nextStatus(task.status))} style={{ border: "none", background: "transparent", cursor: "pointer" }}><ChevronRight size={15} color="#5B7CFA" /></button>}
                        <button onClick={() => removeTask(task.id)} style={{ border: "none", background: "transparent", cursor: "pointer" }}><X size={15} color="#F26B6B" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingTask ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 1000 }}>
          <div style={{ width: "100%", maxWidth: 480, background: "#FFF", borderRadius: 16, padding: 20, boxShadow: "0 20px 60px rgba(15, 23, 42, 0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: "#111827" }}>Edit task</div>
              <button onClick={() => setEditingTask(null)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#475569" }}>
                <span>Title</span>
                <input value={editText} onChange={(event) => setEditText(event.target.value)} style={{ border: "1px solid #DDE4F0", borderRadius: 10, padding: "10px 12px", outline: "none" }} />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#475569" }}>
                  <span>Due date</span>
                  <input type="date" value={editDueDate} onChange={(event) => setEditDueDate(event.target.value)} style={{ border: "1px solid #DDE4F0", borderRadius: 10, padding: "10px 12px", outline: "none" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#475569" }}>
                  <span>Priority</span>
                  <select value={editPriority} onChange={(event) => setEditPriority(event.target.value as PriorityKey)} style={{ border: "1px solid #DDE4F0", borderRadius: 10, padding: "10px 12px", outline: "none", background: "#FFF" }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#475569" }}>
                <span>Status</span>
                <select value={editStatus} onChange={(event) => setEditStatus(event.target.value as StatusKey)} style={{ border: "1px solid #DDE4F0", borderRadius: 10, padding: "10px 12px", outline: "none", background: "#FFF" }}>
                  <option value="backlog">Backlog</option>
                  <option value="active">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#475569" }}>
                <span>Assignee</span>
                <input value={editAssignee} onChange={(event) => setEditAssignee(event.target.value)} style={{ border: "1px solid #DDE4F0", borderRadius: 10, padding: "10px 12px", outline: "none" }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#475569" }}>
                <span>Notes</span>
                <textarea value={editNotes} onChange={(event) => setEditNotes(event.target.value)} style={{ minHeight: 90, border: "1px solid #DDE4F0", borderRadius: 10, padding: "10px 12px", outline: "none", resize: "vertical" }} />
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button onClick={() => setEditingTask(null)} style={{ border: "1px solid #DDE4F0", background: "#FFF", borderRadius: 10, padding: "10px 14px", cursor: "pointer", color: "#475569" }}>Cancel</button>
              <button onClick={saveEdit} style={{ border: "none", background: "linear-gradient(135deg, #5B7CFA 0%, #7A5CFF 100%)", color: "#FFF", borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}>Save changes</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
