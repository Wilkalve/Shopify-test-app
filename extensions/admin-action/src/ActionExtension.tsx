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

const TARGET = 'admin.product-details.action.render';

export default reactExtension(TARGET, () => <App />);

function App() {
  const { close, data } = useApi(TARGET);

  const [productTitle, setProductTitle] = useState('');
  const [isAppEnabled, setIsAppEnabled] = useState(true);
  const [energyCost, setEnergyCost] = useState('0.15');
  const [filamentType, setFilamentType] = useState('PLA');
  const [color, setColor] = useState('');
  const [wallThickness, setWallThickness] = useState('');
  const [infill, setInfill] = useState('');
  const [scaleSize, setScaleSize] = useState('');
  const [autoEdit, setAutoEdit] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Fetch product info
  useEffect(() => {
    if (!data.selected?.length) return;

    (async () => {
      const query = {
        query: `query Product($id: ID!) {
          product(id: $id) { title }
        }`,
        variables: { id: data.selected[0].id },
      };

      try {
        const res = await fetch('shopify:admin/api/graphql.json', {
          method: 'POST',
          body: JSON.stringify(query),
        });
        const result = await res.json();
        setProductTitle(result?.data?.product?.title || '');
      } catch (err) {
        console.error('GraphQL error:', err);
      }
    })();
  }, [data.selected]);

  // Adjust defaults based on filament
  useEffect(() => {
    if (!wallThickness) {
      setWallThickness(filamentType === 'PLA' ? '1.2' : '1.6');
    }
    if (!infill) {
      setInfill(filamentType === 'PLA' ? '15' : '30');
    }
  }, [filamentType]);

  // 💾 Save settings handler
  const handleSave = async () => {
  if (!data.selected?.[0]?.id) return;

  const productId = data.selected[0].id;

  // Validate input
  if (
    isNaN(parseFloat(energyCost)) ||
    isNaN(parseFloat(wallThickness)) ||
    isNaN(parseFloat(infill)) ||
    isNaN(parseFloat(scaleSize))
  ) {
    alert('Please fill in all numeric fields with valid numbers.');
    return;
  }

  // Upload file if present
  if (uploadedFile) {
    const formData = new FormData();
    formData.append('model', uploadedFile);
    formData.append('productId', productId);

    const uploadRes = await fetch('https://your-ngrok-url.ngrok-free.app/api/upload-model', {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      alert('Failed to upload 3D model');
      return;
    }
  }

  // Send configuration to backend
  try {
    const res = await fetch('https://ae19-192-197-88-66.ngrok-free.app/api/save-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        energyCost: parseFloat(energyCost),
        filamentType,
        color,
        wallThickness: parseFloat(wallThickness),
        infill: parseFloat(infill),
        scaleSize: parseFloat(scaleSize),
        autoEdit
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      console.error('Backend error:', msg);
      alert('Failed to save settings');
      return;
    }

    console.log('Settings saved');
    close();
  } catch (err) {
    console.error('Network error:', err);
    alert('There was a problem saving your settings.');
  }
};


  if (!data.selected?.length) {
    return <Text>Loading product...</Text>;
  }

  return (
    <AdminAction
      primaryAction={<Button onPress={handleSave}>Save Settings</Button>}
      secondaryAction={<Button onPress={close}>Cancel</Button>}
    >
      <BlockStack gap="loose">
        <Text level="3">3D Printing Config</Text>
        <Text>Editing product: <Text fontWeight="bold">{productTitle}</Text></Text>

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

        <Select
          label="Wall Thickness (mm)"
          value={wallThickness}
          onChange={setWallThickness}
          options={[
            { label: '0.8', value: '0.8' },
            { label: '1.2', value: '1.2' },
            { label: '1.6', value: '1.6' },
          ]}
        />

        <Select
          label="Infill Level"
          value={infill}
          onChange={setInfill}
          options={[
            { label: 'Minimal (5%)', value: '5' },
            { label: 'Light (15%)', value: '15' },
            { label: 'Medium (30%)', value: '30' },
            { label: 'High (60%)', value: '60' },
            { label: 'Solid (100%)', value: '100' },
          ]}
        />

        <TextField
          label="Scale Size (%)"
          type="number"
          value={scaleSize}
          onChange={setScaleSize}
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

          <Button kind="secondary" onPress={() => console.log('Downloading 3D files for', productTitle)}>
            Download 3D Files
          </Button>
        </BlockStack>
      </BlockStack>
    </AdminAction>
  );
}
