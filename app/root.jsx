import { Outlet, Link, Links, Meta, Scripts, ScrollRestoration } from "@remix-run/react";
import { AppProvider } from "@shopify/polaris";
import { ModelProvider } from './ModelContext';


export const links = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/@shopify/polaris@12.7.0/build/esm/styles.css",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <ModelProvider>
          <AppProvider
            i18n={{
              Polaris: {
                Avatar: {
                  label: 'Avatar',
                  labelWithInitials: 'Avatar with initials {initials}',
                },
                ContextualSaveBar: {
                  save: 'Save',
                  discard: 'Discard',
                },
                TextField: {
                  characterCount: '{count} characters',
                },
                TopBar: {
                  toggleMenuLabel: 'Toggle menu',
                },
                Modal: {
                  iFrameTitle: 'body markup',
                },
                Frame: {
                  skipToContent: 'Skip to content',
                  navigationLabel: 'Navigation',
                  Navigation: {
                    closeMobileNavigationLabel: 'Close navigation',
                  },
                },
              },
            }}
          >
            <div style={{ display: "flex", minHeight: "100vh" }}>
              {/* Sidebar */}
              <nav style={{
                width: "200px",
                background: "#f4f6f8",
                padding: "1rem",
                borderRight: "1px solid #ccc",
              }}>
                <h2 style={{ fontSize: "1rem", marginBottom: "1.5rem" }}>Menu</h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li><Link to="/" style={linkStyle}>Welcome</Link></li>
                  <li><Link to="/fileUpload" style={linkStyle}>Setup</Link></li>
                  <li><Link to="/view-order" style={linkStyle}>View Orders</Link></li>
                  <li><Link to="/help" style={linkStyle}>Help</Link></li>
                </ul>
              </nav>

              {/* Main content */}
              <main style={{ flex: 1, padding: "2rem" }}>
                <Outlet />
              </main>
            </div>
          </AppProvider>
        </ModelProvider>

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
  fontWeight: "bold"
};