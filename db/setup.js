const Database = require('better-sqlite3');
const db = new Database('database.db');

// Create the table to store uploaded 3D files
db.prepare(`
  CREATE TABLE IF NOT EXISTS file_uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_domain TEXT NOT NULL,
    order_id TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT,
    estimated_price TEXT,
    customer_email TEXT,
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

// Create the table to store admin-configured product settings
db.prepare(`
  CREATE TABLE IF NOT EXISTS product_settings (
    product_id TEXT PRIMARY KEY,
    energy_cost TEXT,
    filament_type TEXT,
    color TEXT,
    wall_thickness TEXT,
    infill TEXT,
    scale_size TEXT,
    auto_edit INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

// Create the table to store individual printing options per upload
db.prepare(`
  CREATE TABLE IF NOT EXISTS printing_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id TEXT NOT NULL,
    material TEXT,
    quality TEXT,
    infill INTEGER,
    walls INTEGER,
    supports TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

console.log('Tables "file_uploads", "product_settings", and "printing_settings" are ready!');

module.exports = db;
