// save-settings
const express = require('express');
const router = express.Router();
const db = require('../../db/setup');

router.post('/', (req, res) => {
  const {
    productId,
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

  try {
    const stmt = db.prepare(`
      INSERT INTO product_settings (
        product_id,
        energy_cost,
        filament_type,
        color,
        wall_thickness,
        infill,
        scale_size,
        auto_edit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(product_id) DO UPDATE SET
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
      energyCost,
      filamentType,
      color,
      wallThickness,
      infill,
      scaleSize,
      autoEdit ? 1 : 0
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to save settings:', err);
    res.status(500).json({ error: err.message });
  }
});


// GET route to fetch saved settings by productId
router.get('/:productId', (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: 'Missing productId parameter' });
  }

  try {
    const stmt = db.prepare(`
      SELECT * FROM product_settings
      WHERE product_id = ?
    `);
    const row = stmt.get(productId);

    if (!row) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    res.status(200).json(row);
  } catch (err) {
    console.error('Error retrieving settings:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
