const { saveFileUpload, getFileForOrder } = require('./db/fileUploads');

// test data 
const shop = 'test-shop.myshopify.com';
const orderId = 'gid://shopify/Order/1234567890';
const fakeUrl = 'https://example.com/3d-file.glb';

// Insert dummy record
saveFileUpload(shop, orderId, fakeUrl);
console.log('Inserted test file upload.');

// Fetch and display the result
const result = getFileForOrder(shop, orderId);
if (result) {
  console.log('Retrieved file URL:', result.file_url);
} else {
  console.log('No result found.');
}

const db = require('./db/setup'); // make sure you use the correct path

// Insert product settings
const insertProductSettings = db.prepare(`
  INSERT INTO product_settings (product_id, energy_cost, filament_type, color, size, auto_edit)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(product_id) DO UPDATE SET
    energy_cost=excluded.energy_cost,
    filament_type=excluded.filament_type,
    color=excluded.color,
    size=excluded.size,
    auto_edit=excluded.auto_edit
`);

const productId = 'gid://shopify/Product/987654321';
insertProductSettings.run(
  productId,
  '0.22',
  'PETG',
  'Silver',
  '150',
  1 // true for auto_edit
);

console.log('Inserted test product settings.');

// Fetch and display the settings
const getSettings = db.prepare(`SELECT * FROM product_settings WHERE product_id = ?`);
const settings = getSettings.get(productId);

if (settings) {
  console.log('✔ Retrieved product settings:', settings);
} else {
  console.log('⚠ No product settings found.');
}
