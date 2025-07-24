import {
  Outlet,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData
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
import { json } from "@remix-run/node";

// ✅ Loader to pass ENV to client
export const loader = () => {
  return json({
    ENV: {
      SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY // <-- Replace with your actual key
    }
  });
};

// ✅ Polaris stylesheet from CDN
export const links = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/@shopify/polaris@12.7.0/build/esm/styles.css"
  }
];

export default function App() {
  const { ENV } = useLoaderData(); 
  const [app, setApp] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = new URLSearchParams(window.location.search).get("host");

      if (host && ENV?.SHOPIFY_API_KEY) {
        const appBridgeConfig = {
          host,
          apiKey: ENV.SHOPIFY_API_KEY, 
          forceRedirect: true
        };

        const appInstance = createApp(appBridgeConfig);
        setApp(appInstance);
      }
    }
  }, [ENV]);

  // ✅ Polaris translations (safe client-side loading)
  const [translations, setTranslations] = useState({});
  useEffect(() => {
    async function loadTranslations() {
      const module = await import("@shopify/polaris/locales/en.json", {
        assert: { type: "json" }
      });
      setTranslations(module.default);
    }
    if (typeof window !== "undefined") {
      loadTranslations();
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0 }}>
        <PolarisProvider i18n={translations}>
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

        {/* ✅ Inject ENV for browser access if needed */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)};`
          }}
        />
      </body>
    </html>
  );
}
