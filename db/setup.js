const Database = require('better-sqlite3');
const db = new Database('database.db');

// Create the table to store uploaded 3D files
db.prepare(`
  CREATE TABLE IF NOT EXISTS file_uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_domain TEXT NOT NULL,
    order_id TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

// Create the table to store admin product configuration setting
db.prepare(`
  CREATE TABLE IF NOT EXISTS product_settings (
    product_id TEXT PRIMARY KEY,
    energy_cost TEXT,
    filament_type TEXT,
    color TEXT,
    size TEXT,
    auto_edit INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

console.log('Table "file_uploads" is ready!');

module.exports = db;