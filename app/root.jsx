import {
  Outlet, Link, Links, Meta, Scripts, ScrollRestoration
} from "@remix-run/react";

import { AppProvider as PolarisProvider } from "@shopify/polaris";
import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";
import polarisTranslations from "@shopify/polaris/locales/en.json";

export const links = () => [{
  rel: "stylesheet",
  href: "https://unpkg.com/@shopify/polaris@12.7.0/build/esm/styles.css"
}];

export default function App() {
  const host =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("host")
      : undefined;

  const appBridgeConfig = {
    apiKey: process.env.SHOPIFY_API_KEY, 
    host,
    forceRedirect: true,
  };

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        {/* ✅ App Bridge context wrapper */}
        <AppBridgeProvider config={appBridgeConfig}>
          <PolarisProvider i18n={polarisTranslations}>
            <div style={{ display: "flex", minHeight: "100vh" }}>
              <nav style={navStyle}>
                <h2 style={{ fontSize: "1rem", marginBottom: "1.5rem" }}>Menu</h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li><Link to="/" style={linkStyle}>Welcome</Link></li>
                  <li><Link to="/StorefrontFileUpload" style={linkStyle}>Setup</Link></li>
                  <li><Link to="/view-order" style={linkStyle}>View Orders</Link></li>
                  <li><Link to="/help" style={linkStyle}>Help</Link></li>
                </ul>
              </nav>
              <main style={{ flex: 1, padding: "2rem" }}>
                <Outlet />
              </main>
            </div>
          </PolarisProvider>
        </AppBridgeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const linkStyle = {
  display: "block",
  marginBottom: "1rem",
  color: "#333",
  textDecoration: "none",
  fontWeight: "bold",
};

const navStyle = {
  width: "200px",
  background: "#f4f6f8",
  padding: "1rem",
  borderRight: "1px solid #ccc"
};
