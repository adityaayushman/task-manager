import { useTasks } from "../context/TaskContext";
import TopBar from "../components/TopBar";
import { COLUMNS, PRIORITY } from "../types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function AnalyticsPage() {
  const { tasks } = useTasks();
  const statusData = COLUMNS.map((column) => ({ name: column.label, count: tasks.filter((task) => task.status === column.id).length }));
  const priorityData = Object.entries(PRIORITY).map(([key, value]) => ({
    name: value.label,
    value: tasks.filter((task) => task.priority === key).length,
    color: value.color,
  }));
  const completionRate = tasks.length ? Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100) : 0;

  return (
    <div>
      <TopBar title="Analytics" />
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ background: "linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 100%)", border: "1px solid #E7EBF2", borderRadius: 18, padding: 20, display: "flex", gap: 40, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "#7C86A2", textTransform: "uppercase", letterSpacing: "0.16em" }}>Total tasks</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "#111827" }}>{tasks.length}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#7C86A2", textTransform: "uppercase", letterSpacing: "0.16em" }}>Completion rate</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "#5B7CFA" }}>{completionRate}%</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "#FFF", border: "1px solid #E7EBF2", borderRadius: 16, padding: 20, height: 320, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)" }}>
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12, color: "#111827" }}>Tasks by Status</div>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={statusData}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#5B7CFA" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: "#FFF", border: "1px solid #E7EBF2", borderRadius: 16, padding: 20, height: 320, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)" }}>
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12, color: "#111827" }}>Tasks by Priority</div>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {priorityData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
