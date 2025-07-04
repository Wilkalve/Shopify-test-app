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

  // Fetch product title and 3D model
  useEffect(() => {
    if (!data.selected?.length) return;

    const productId = data.selected[0].id;

    const fetchProductDetails = async () => {
      const query = {
        query: `query GetProductWithMedia($id: ID!) {
          product(id: $id) {
            title
            media(first: 10) {
              edges {
                node {
                  ... on Model3d {
                    id
                    sources {
                      url
                      format
                      mimeType
                    }
                  }
                }
              }
            }
          }
        }`,
        variables: { id: productId },
      };

      try {
        const res = await fetch('shopify:admin/api/graphql.json', {
          method: 'POST',
          body: JSON.stringify(query),
        });
        const result = await res.json();
        const product = result?.data?.product;
        setProductTitle(product?.title || '');

        const model = product?.media?.edges?.find(
          (edge) => edge.node?.sources?.[0]?.url
        )?.node;

        if (model) {
          setUploadedFile({
            name: model.sources[0].format,
            url: model.sources[0].url,
            fileUploadId: model.id,
          });
        }
      } catch (err) {
        console.error('GraphQL error:', err);
      }
    };

    fetchProductDetails();
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

  // Save settings handler
  const handleSave = async () => {
    if (!data.selected?.[0]?.id) return;

    const productId = data.selected[0].id;
    const fileUploadId = uploadedFile?.fileUploadId || null;

    if (
      isNaN(parseFloat(energyCost)) ||
      isNaN(parseFloat(wallThickness)) ||
      isNaN(parseFloat(infill)) ||
      isNaN(parseFloat(scaleSize))
    ) {
      console.error('Validation error: Please fill in all numeric fields with valid numbers.');
      return;
    }

    try {
      const res = await fetch('https://46a8-64-229-115-37.ngrok-free.app/api/save-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          fileUploadId,
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
        return;
      }

      console.log('Settings saved successfully');
      close();
    } catch (err) {
      console.error('Network error while saving settings:', err);
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

        {uploadedFile ? (
          <Text appearance="subdued">
            Linked 3D model: <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer">{uploadedFile.name}</a>
          </Text>
        ) : (
          <Text appearance="subdued">No 3D model linked to this product yet.</Text>
        )}

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
