import { useMemo, useState } from "react";
import { useTasks } from "../context/TaskContext";
import TopBar from "../components/TopBar";
import { PRIORITY } from "../types";

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [current, setCurrent] = useState(new Date());
  const year = current.getFullYear();
  const month = current.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  const tasksForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return tasks.filter((task) => task.dueDate === dateStr);
  };

  const upcoming = useMemo(() => tasks.filter((task) => task.dueDate).sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || "")), [tasks]);

  return (
    <div>
      <TopBar title="Calendar" />
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 100%)", border: "1px solid #E7EBF2", borderRadius: 18, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "#7C86A2", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 4 }}>Upcoming deadlines</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "#111827" }}>{upcoming.length} tasks on the calendar</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setCurrent(new Date(year, month - 1, 1))} style={{ border: "1px solid #DDE4F0", background: "#FFF", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#475569" }}>←</button>
            <div style={{ minWidth: 180, textAlign: "center", fontWeight: 700, color: "#111827" }}>{current.toLocaleString("default", { month: "long", year: "numeric" })}</div>
            <button onClick={() => setCurrent(new Date(year, month + 1, 1))} style={{ border: "1px solid #DDE4F0", background: "#FFF", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#475569" }}>→</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 16 }}>
          <div style={{ background: "#FFF", border: "1px solid #E7EBF2", borderRadius: 16, padding: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, fontSize: 11, color: "#9CA0AE", marginBottom: 6 }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} style={{ textAlign: "center" }}>{day}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {cells.map((day, index) => (
                <div key={index} style={{ minHeight: 88, background: "#FFF", border: "1px solid #E7EBF2", borderRadius: 10, padding: 6, boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)" }}>
                  {day && (
                    <>
                      <div style={{ fontSize: 11, color: "#9CA0AE", marginBottom: 4 }}>{day}</div>
                      {tasksForDay(day).map((task) => (
                        <div key={task.id} style={{ fontSize: 10.5, padding: "2px 5px", marginBottom: 3, borderRadius: 4, borderLeft: `2px solid ${PRIORITY[task.priority].color}`, background: "#F6F6FA" }}>
                          {task.title}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#FFF", border: "1px solid #E7EBF2", borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 12, color: "#7C86A2", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 10 }}>Next up</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcoming.slice(0, 6).map((task) => (
                <div key={task.id} style={{ border: "1px solid #EDF1F7", borderRadius: 10, padding: 10, background: "#F9FBFF" }}>
                  <div style={{ fontWeight: 600, color: "#111827", marginBottom: 4 }}>{task.title}</div>
                  <div style={{ fontSize: 12, color: "#7C86A2" }}>{task.dueDate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
