import { NavLink } from "react-router-dom";
import { LayoutGrid, Calendar, BarChart3, Sparkles } from "lucide-react";

const links = [
  { to: "/tasks", label: "Tasks", icon: LayoutGrid },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <div style={{ width: 250, background: "linear-gradient(180deg, #131728 0%, #0f1424 100%)", color: "#F3F5FA", padding: "24px 18px", display: "flex", flexDirection: "column", gap: 14, boxShadow: "inset -1px 0 0 rgba(255,255,255,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, padding: "6px 8px" }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #7A5CFF 0%, #5B7CFA 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(91, 124, 250, 0.25)" }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16 }}>TaskMaster Pro</div>
          <div style={{ fontSize: 12, color: "#98A2B8" }}>Team Edition</div>
        </div>
      </div>
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 12px",
            borderRadius: 10,
            fontSize: 13.5,
            fontWeight: 600,
            textDecoration: "none",
            color: isActive ? "#FFFFFF" : "#B7BED4",
            background: isActive ? "linear-gradient(135deg, #5B7CFA 0%, #7A5CFF 100%)" : "transparent",
            boxShadow: isActive ? "0 8px 18px rgba(91, 124, 250, 0.22)" : "none",
          })}
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
      <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 12, color: "#8C95AD" }}>Today’s focus</div>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>3 priorities</div>
          <div style={{ fontSize: 12, color: "#9CA7BA", marginTop: 2 }}>Keep momentum across the board.</div>
        </div>
      </div>
    </div>
  );
}
