
import { useEffect, useState } from 'react';
import {
  reactExtension,
  useApi,
  AdminAction,
  BlockStack,
  Button,
  Text,
  TextField,
  Select,
  Checkbox,
} from '@shopify/ui-extensions-react/admin';


// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.product-details.action.render';

export default reactExtension(TARGET, () => <App />);

function App() {
  const { i18n, close, data } = useApi(TARGET);

  // The useApi hook provides access to several useful APIs like i18n, close, and data.

  const [productTitle, setProductTitle] = useState('');
  const [isAppEnabled, setIsAppEnabled] = useState(true);
  const [energyCost, setEnergyCost] = useState('0.15');
  const [filamentType, setFilamentType] = useState('PLA');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [autoEdit, setAutoEdit] = useState(false);

  // Use direct API calls to fetch data from Shopify.
  // See https://shopify.dev/docs/api/admin-graphql for more information about Shopify's GraphQL API
  useEffect(() => {
    if (!data.selected || data.selected.length === 0) return;

    (async function getProductInfo() {
      const getProductQuery = {
        query: `query Product($id: ID!) {
          product(id: $id) {
            title
          }
        }`,
        variables: { id: data.selected[0].id },
      };

      const res = await fetch('shopify:admin/api/graphql.json', {
        method: 'POST',
        body: JSON.stringify(getProductQuery),
      });

      if (res.ok) {
        const productData = await res.json();
        setProductTitle(productData.data.product.title);
      } else {
        console.error('Failed to get product title');
      }
    })();
  }, [data.selected]);

  const handleSave = async () => {
    if (!data.selected || !data.selected[0]?.id) return;

    const config = {
      productId: data.selected[0].id,
      isAppEnabled,
      energyCost,
      filamentType,
      color,
      size,
      autoEdit,
    };

    console.log('Saving settings:', config);

    try {
      const res = await fetch('/api/save-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        console.log('Settings saved');
        close();
      } else {
        console.error('Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const handleDownloadFiles = () => {
    console.log('Downloading 3D files for', productTitle);
    // future: fetch download link based on product ID
  };

  if (!data.selected || data.selected.length === 0) {
    return <Text>Loading product...</Text>;
  }

  return (
    <AdminAction
      primaryAction={<Button onPress={handleSave}>Save Settings</Button>}
      secondaryAction={<Button onPress={close}>Cancel</Button>}
    >
      <BlockStack gap="loose">
        <Text level="3">3D Printing Config</Text>

        <Text>
          Editing product:{' '}
          <Text fontWeight="bold">{productTitle}</Text>
        </Text>

        <Checkbox
          checked={isAppEnabled}
          onChange={setIsAppEnabled}
          label="Enable 3D printing options for this product"
        />

        <TextField
          label="Energy Cost Rate ($/kWh)"
          type="number"
          value={energyCost}
          onChange={setEnergyCost}
        />

        <Select
          label="Filament Type"
          value={filamentType}
          onChange={setFilamentType}
          options={[
            { label: 'PLA', value: 'PLA' },
            { label: 'ABS', value: 'ABS' },
            { label: 'PETG', value: 'PETG' },
            { label: 'NYLON', value: 'NYLON' },
          ]}
        />

        <Select
          label="Color"
          value={color}
          onChange={setColor}
          options={[
            { label: 'White', value: 'White' },
            { label: 'Black', value: 'Black' },
            { label: 'Red', value: 'Red' },
            { label: 'Green', value: 'Green' },
            { label: 'Blue', value: 'Blue' },
            { label: 'Orange', value: 'Orange' },
            { label: 'Yellow', value: 'Yellow' },
            { label: 'Grey', value: 'Grey' },
          ]}
        />


        <Checkbox
          checked={autoEdit}
          onChange={setAutoEdit}
          label="Auto-edit product page with 3D options"
        />

        <BlockStack gap="base">
          <Button kind="secondary" onPress={() => console.log('Show setup guide')}>
            View Setup Guide
          </Button>

          <Button kind="secondary" onPress={handleDownloadFiles}>
            Download 3D Files
          </Button>
        </BlockStack>

      </BlockStack>
    </AdminAction>
  );

}
