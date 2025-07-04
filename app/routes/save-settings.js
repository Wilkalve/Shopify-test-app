// save-settings
const express = require('express');
const router = express.Router(); 
const db = require('../../db/setup');

router.post('/', (req, res) => {
  const {
    productId,
    fileUploadId,
    energyCost,
    filamentType,
    color,
    wallThickness,
    infill,
    scaleSize,
    autoEdit
  } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Missing productId' });
  }

  console.log('🟡 Incoming save request:', {
    productId,
    fileUploadId,
    energyCost,
    filamentType,
    color,
    wallThickness,
    infill,
    scaleSize,
    autoEdit
  });

  try {
    const stmt = db.prepare(`
      INSERT INTO product_settings (
        product_id,
        file_upload_id,
        energy_cost,
        filament_type,
        color,
        wall_thickness,
        infill,
        scale_size,
        auto_edit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(product_id) DO UPDATE SET
        file_upload_id = excluded.file_upload_id,
        energy_cost = excluded.energy_cost,
        filament_type = excluded.filament_type,
        color = excluded.color,
        wall_thickness = excluded.wall_thickness,
        infill = excluded.infill,
        scale_size = excluded.scale_size,
        auto_edit = excluded.auto_edit
    `);

    stmt.run(
      productId,
      fileUploadId || null,
      energyCost,
      filamentType,
      color,
      wallThickness,
      infill,
      scaleSize,
      autoEdit ? 1 : 0
    );

    // 🔍 Confirm what was saved
    const check = db.prepare('SELECT * FROM product_settings WHERE product_id = ?').get(productId);
    console.log('Saved row:', check);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to save settings:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
