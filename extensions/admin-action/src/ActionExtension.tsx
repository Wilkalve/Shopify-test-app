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
  const { i18n, close, data } = useApi(TARGET);

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

  useEffect(() => {
    if (!wallThickness) {
      setWallThickness(filamentType === 'PLA' ? '1.2' : '1.6');
    }
    if (!infill) {
      setInfill(filamentType === 'PLA' ? '15' : '30');
    }
  }, [filamentType]);

  const handleSave = async () => {
    if (!data.selected || !data.selected[0]?.id) return;

    if (uploadedFile) {
      const formData = new FormData();
      formData.append('model', uploadedFile);
      formData.append('productId', data.selected[0].id);

      
// TODO URL need to be change
     const resUpload = await fetch('https://3d18-192-197-88-101.ngrok-free.app/api/upload-model', {
        method: 'POST',
        body: formData,
      });

      if (!resUpload.ok) {
        alert('Failed to upload 3D model');
        return;
      }
    }

    const config = {
      productId: data.selected[0].id,
      isAppEnabled,
      energyCost,
      filamentType,
      color,
      wallThickness,
      infill,
      scaleSize,
      autoEdit,
    };

    console.log('Saving settings:', config);

// TODO URL need to be change
    try {
      const res = await fetch('https://3d18-192-197-88-101.ngrok-free.app/api/get-product-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: data.selected[0].id }),
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

          <Button kind="secondary" onPress={handleDownloadFiles}>
            Download 3D Files
          </Button>
        </BlockStack>
      </BlockStack>
    </AdminAction>
  );
}
