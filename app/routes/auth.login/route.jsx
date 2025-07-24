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

import polarisTranslations from "@shopify/polaris/locales/en.json";


export const loader = async ({ request }) => {
  const { login } = await import("../../shopify.server");
  const { loginErrorMessage } = await import("./error.server");

  const errors = loginErrorMessage(await login(request));

  return { errors, polarisTranslations };
};

export const action = async ({ request }) => {
  const { login } = await import("../../shopify.server");
  const { loginErrorMessage } = await import("./error.server");

  const errors = loginErrorMessage(await login(request));

  return { errors };
};

export const headers = () => ({
  "Content-Security-Policy": "frame-ancestors https://*.myshopify.com https://admin.shopify.com;",
});

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
            {/* ✅ Hidden field for host */}
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
