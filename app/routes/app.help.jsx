import { Page, Card, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

export default function Help() {
  return (
    <Page title="Help">
      <Card>
        <Text as="h1" variant="headingLg">
          Help Page
        </Text>
        <Text as="p">
          Contact: example@email.com
        </Text>
      </Card>
    </Page>
  );
}