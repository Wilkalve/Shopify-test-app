import {
  Outlet,
  Links,
  Meta,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

import {
  AppProvider as PolarisProvider,
  Page,
  Frame,
  Navigation,
  Layout,
  Card
} from "@shopify/polaris";

import createApp from "@shopify/app-bridge";
import React, { useEffect, useState } from "react";

// Load translations in the browser only
let polarisTranslations = {};
if (typeof window !== "undefined") {
  const loadTranslations = async () => {
    const module = await import("@shopify/polaris/locales/en.json", {
      assert: { type: "json" }
    });
    polarisTranslations = module.default;
  };
  loadTranslations();
}

// Load Polaris styles via CDN instead of importing the CSS
export const links = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/@shopify/polaris@12.7.0/build/esm/styles.css"
  }
];

export default function App() {
  const [app, setApp] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = new URLSearchParams(window.location.search).get("host");

      if (host) {
        const appBridgeConfig = {
          host,
          apiKey: "YOUR_API_KEY", // 🔐 Replace with your actual API key
          forceRedirect: true
        };

        const appInstance = createApp(appBridgeConfig);
        setApp(appInstance);
      }
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0 }}>
        <PolarisProvider i18n={polarisTranslations}>
          <Frame
            navigation={
              <Navigation location="/">
                <Navigation.Section
                  title="Navigation"
                  items={[
                    { label: "Welcome", url: "/" },
                    { label: "Setup", url: "/setup" },
                    { label: "View Orders", url: "/view-order" },
                    { label: "Help", url: "/help" }
                  ]}
                />
              </Navigation>
            }
          >
            <Page title="NV 3D Print" fullWidth>
              <Layout>
                <Layout.Section>
                  <Card sectioned title="Dashboard">
                    <Outlet />
                  </Card>
                </Layout.Section>
              </Layout>
            </Page>
          </Frame>
        </PolarisProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
