const express = require('express');
const router = express.Router();
const db = require('./db/setup'); 

router.post('/', (req, res) => {
  const {
    productId,
    energyCost,
    filamentType,
    color,
    size,
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
        size,
        auto_edit
      )
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(product_id) DO UPDATE SET
        energy_cost = excluded.energy_cost,
        filament_type = excluded.filament_type,
        color = excluded.color,
        size = excluded.size,
        auto_edit = excluded.auto_edit
    `);

    stmt.run(
      productId,
      energyCost,
      filamentType,
      color,
      size,
      autoEdit ? 1 : 0
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to save product settings:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
