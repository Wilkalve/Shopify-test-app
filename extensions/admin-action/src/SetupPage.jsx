import {
  reactExtension,
  useApi,
  Text,
  BlockStack,
  InlineStack,
  Button,
  TextField,
  Select,
  Divider
} from '@shopify/ui-extensions-react/admin';

const TARGET = 'admin.apps.app.index.primary.tabs.setup';

export default reactExtension(TARGET, () => <SetupPage />);

function SetupPage() {
  const { i18n } = useApi(TARGET);

  return (
    <BlockStack gap="400">
      <BlockStack gap="200">
        <Text variant="headingLg">Setup - NovaPrint 3D Printing</Text>
        <Text variant="bodyMd">Configure your 3D printing parameters</Text>
      </BlockStack>

      <Divider />

      <BlockStack gap="400">
        <Text variant="headingMd">Product Printing Parameters</Text>
        
        <BlockStack gap="300">
          <TextField label="Default Infill Percentage" type="number" value="20" />
          <TextField label="Default Wall Thickness (mm)" type="number" value="1.2" />
          
          <Select
            label="Default Filament Type"
            options={[
              {label: 'PLA', value: 'pla'},
              {label: 'ABS', value: 'abs'},
              {label: 'PETG', value: 'petg'},
              {label: 'TPU', value: 'tpu'}
            ]}
            value="pla"
          />
        </BlockStack>
        
        <Button variant="primary">Save Settings</Button>
      </BlockStack>

      <Divider />

      <BlockStack gap="400">
        <Text variant="headingMd">Operational Parameters</Text>
        
        <BlockStack gap="300">
          <TextField label="Cost per Hour (USD)" type="number" value="5.00" />
          <TextField label="Electricity Rate (kWh)" type="number" value="0.12" />
        </BlockStack>
        
        <Button variant="primary">Save Operational Settings</Button>
      </BlockStack>
    </BlockStack>
  );
}