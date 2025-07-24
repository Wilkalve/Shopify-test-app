import { useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";

import {
  AppProvider as PolarisAppProvider,
  Button,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";

import { json } from "@remix-run/node";
import polarisTranslations from "@shopify/polaris/locales/en.json";

// ✅ loader with dynamic CSP header
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "*.myshopify.com";

  const { login } = await import("../../shopify.server");
  const { loginErrorMessage } = await import("./error.server");

  const errors = loginErrorMessage(await login(request));

  const headers = new Headers();
  headers.set(
    "Content-Security-Policy",
    `frame-ancestors https://${shop} https://admin.shopify.com;`
  );

  return json(
    { errors, polarisTranslations },
    { headers }
  );
};

export const action = async ({ request }) => {
  const { login } = await import("../../shopify.server");
  const { loginErrorMessage } = await import("./error.server");

  const errors = loginErrorMessage(await login(request));

  return { errors };
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const [searchParams] = useSearchParams();
  const host = searchParams.get("host");

  const { errors } = actionData || loaderData;

  return (
    <PolarisAppProvider i18n={loaderData.polarisTranslations}>
      <Page>
        <Card>
          <Form method="post">
            <input type="hidden" name="host" value={host || ""} />
            <FormLayout>
              <Text variant="headingMd" as="h2">
                Log in
              </Text>
              <TextField
                type="text"
                name="shop"
                label="Shop domain"
                helpText="example.myshopify.com"
                value={shop}
                onChange={setShop}
                autoComplete="on"
                error={errors?.shop}
              />
              <Button submit>Log in</Button>
            </FormLayout>
          </Form>
        </Card>
      </Page>
    </PolarisAppProvider>
  );
}
