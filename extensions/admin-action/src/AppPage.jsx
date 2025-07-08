// src/AppPage.jsx
//simple welcoming main page

import {
  reactExtension,
  Page,
  Text,
  Box,
  BlockStack
} from '@shopify/ui-extensions-react/admin';

// The target for the app page
const TARGET = 'admin.app.page';

export default reactExtension(TARGET, () => <WelcomePage />);

function WelcomePage() {
  return (
    <Page title="NovaPrint 3D Printing">
      <BlockStack gap="500">
        <Box 
          background="bg-surface-secondary" 
          padding="500" 
          borderRadius="200"
        >
          <Text as="h2" alignment="center">This is a welcome page</Text>
        </Box>
      </BlockStack>
    </Page>
  );
}