import { Page, Card, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

export default function Orders() {
  return (
    <Page title="Orders">
      <Card>
        <Text as="h1" variant="headingLg">
          Orders Page
        </Text>
        <Text as="p">
          This is where store owners can view orders and access files.
        </Text>
      </Card>
    </Page>
  );
}