import { Outlet, Link } from "@remix-run/react";

export default function AppLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Navigation */}
      <nav style={{
        width: "221px",
        background: "#f0f0f0",
        padding: "2rem 1rem",
        borderRight: "1px solid #ddd"
      }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>Navigation</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/" style={linkStyle}>Welcome</Link></li>
          <li><Link to="/setup" style={linkStyle}>Setup</Link></li>
          <li><Link to="/view-orders" style={linkStyle}>View Orders</Link></li>
          <li><Link to="/help" style={linkStyle}>Help</Link></li>
        </ul>
      </nav>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}

const linkStyle = {
  display: "block",
  marginBottom: "1rem",
  color: "#333",
  textDecoration: "none",
  fontWeight: "bold"
};
