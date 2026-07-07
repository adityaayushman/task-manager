import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: "#F4F7FB" }}>
      <Sidebar />
      <div style={{ flex: 1, background: "linear-gradient(180deg, #F8FAFF 0%, #F4F7FB 100%)" }}>
        <Outlet />
      </div>
    </div>
  );
}
