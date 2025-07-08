import { Page, Card, Text, Layout } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const loader = async () => {
  return json({});
};

export default function Help() {

  const titleStyle = {
      fontSize: "40px",
      fontWeight: "600",
      fontFamily: "'Inter', system-ui, sans-serif"
    };

    const bodyStyle = {
      fontFamily: "'Inter', system-ui, sans-serif"
    };


  return (
    <Page title="Help">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <div style={titleStyle}>FAQ</div>
            <div style={{ marginTop: "30px" }}>
              <Text as="p" variant="bodyMd">1. How do I add product items in my store?</Text>
              <Text as="p" variant="bodyMd">2. How do I edit the quoting rates?</Text>
              <Text as="p" variant="bodyMd">3. How do I access the 3D printing files?</Text>
              <Text as="p" variant="bodyMd">4. How long would the 3D files stay available?</Text>
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <div style={titleStyle}>Contact</div>
            <div style={{ marginTop: "30px" }}>
              <Text as="p" variant="bodyMd">Email: exampleEmail@email.com</Text>
              <Text as="p" variant="bodyMd">
                Website: <a href="https://theuselessweb.com/" target="_blank" rel="noopener noreferrer">https://theuselessweb.com/</a>
              </Text>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
