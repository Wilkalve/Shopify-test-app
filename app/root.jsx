import {
  Outlet, Links, Meta, Scripts, ScrollRestoration
} from "@remix-run/react";

export const links = () => [
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
  }
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, fontFamily: "'Inter', sans-serif", background: "#f9fafb" }}>
        <nav style={{ background: "#6a1b9a", padding: "20px", color: "#fff" }}>
          <h2 style={{ margin: 0 }}>NV 3D Print</h2>
          <ul style={{ display: "flex", gap: "15px", marginTop: "10px", listStyle: "none" }}>
            <li><a href="/" style={{ color: "#fff", textDecoration: "none" }}>Welcome</a></li>
            <li><a href="/setup" style={{ color: "#fff", textDecoration: "none" }}>Setup</a></li>
            <li><a href="/view-order" style={{ color: "#fff", textDecoration: "none" }}>View Orders</a></li>
            <li><a href="/help" style={{ color: "#fff", textDecoration: "none" }}>Help</a></li>
          </ul>
        </nav>

        <main style={{ padding: "40px", maxWidth: "960px", margin: "0 auto" }}>
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
