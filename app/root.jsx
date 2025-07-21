import {
  Outlet, Links, Meta, Scripts, ScrollRestoration
} from "@remix-run/react";

import {
  AppProvider as PolarisProvider,
  Page,
  Frame,
  Navigation,
  Layout,
  Card
} from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json" assert { type: "json" };
import createApp from "@shopify/app-bridge";

export const links = () => [{
  rel: "stylesheet",
  href: "https://unpkg.com/@shopify/polaris@12.7.0/build/esm/styles.css"
}];

export default function App() {
  const host =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("host")
      : undefined;

  const appBridgeConfig =
    typeof window !== "undefined" && host
      ? {
          host,
          apiKey: "YOUR_API_KEY", 
          forceRedirect: true
        }
      : null;

  const app =
    typeof window !== "undefined" && appBridgeConfig
      ? createApp(appBridgeConfig)
      : null;

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
                    { label: "Welcome", url: "/ " },
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
