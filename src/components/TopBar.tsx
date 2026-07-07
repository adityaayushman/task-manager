import { Bell, Search } from "lucide-react";

export default function TopBar({ title }: { title: string }) {
  return (
    <div style={{ height: 74, borderBottom: "1px solid #E7EBF2", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "#F8FAFF" }}>
      <div>
        <div style={{ fontSize: 12, color: "#7C86A2", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 2 }}>Workspace</div>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: "#1F2937" }}>{title}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#EEF2FF", borderRadius: 10, padding: "8px 12px", border: "1px solid #E3E8FF" }}>
          <Search size={14} color="#7C86A2" />
          <input placeholder="Search…" style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#334155", width: 180 }} />
        </div>
        <button style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #E3E8FF", background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Bell size={16} color="#5B7CFA" />
        </button>
      </div>
    </div>
  );
}
