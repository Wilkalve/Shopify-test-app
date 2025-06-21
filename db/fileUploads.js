const Database = require('better-sqlite3');
const db = new Database('database.db');

// save file URL for a shop and order
function saveFileUpload(shopDomain, orderId, fileUrl){
    const stmt = db.prepare(`
    INSERT INTO file_uploads (shop_domain, order_id, file_url)
    VALUES (?, ?, ?)
  `);
  stmt.run(shopDomain, orderId, fileUrl);
}

// Get file URL by shop and order
function getFileForOrder(shopDomain, orderId){
    const stmt = db.prepare(`
    SELECT file_url FROM file_uploads
    WHERE shop_domain = ? AND order_id = ?
  `);
  return stmt.get(shopDomain, orderId);
}

module.exports = { saveFileUpload, getFileForOrder };