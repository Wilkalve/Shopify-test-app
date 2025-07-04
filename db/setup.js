const Database = require('better-sqlite3');
const db = new Database('database.db');

db.pragma('foreign_keys = ON');

// Drop both tables to reset schema
db.prepare(`DROP TABLE IF EXISTS product_settings;`).run();
db.prepare(`DROP TABLE IF EXISTS file_uploads;`).run();

// Create file_uploads with file_upload_id as PRIMARY KEY
db.prepare(`
  CREATE TABLE file_uploads (
    file_upload_id TEXT PRIMARY KEY,
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

// Create product_settings with correct foreign key
db.prepare(`
  CREATE TABLE product_settings (
    product_id TEXT PRIMARY KEY,
    file_upload_id TEXT,
    energy_cost TEXT,
    filament_type TEXT,
    color TEXT,
    wall_thickness TEXT,
    infill TEXT,
    scale_size TEXT,
    auto_edit INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_upload_id) REFERENCES file_uploads(file_upload_id) ON DELETE SET NULL
  );
`).run();

console.log('✅ Tables created with valid foreign key relationship');

module.exports = db;
