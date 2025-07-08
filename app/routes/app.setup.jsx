import { Page, Card, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

export default function Setup() {
  return (
    <Page title="Setup">
      <Card>
        <Text as="h1" variant="headingLg">
          Setup Page
        </Text>
        <Text as="p">
          This is where you setup the parameters.
        </Text>
      </Card>
    </Page>
  );
}