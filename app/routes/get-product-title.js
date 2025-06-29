const express = require('express');
const router = express.Router();
const { shopify } = require('../shopify');

router.post('/', async (req, res) => {
  const { productId } = req.body;
  const shop = req.query.shop || req.body.shop; 

  const session = await shopify.sessionStorage.loadSession(shop);

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: 'Unauthorized: No session' });
  }

  try {
    const response = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': session.accessToken,
      },
      body: JSON.stringify({
        query: `
          query Product($id: ID!) {
            product(id: $id) {
              title
            }
          }`,
        variables: { id: productId },
      }),
    });

    const data = await response.json();
    res.json({ title: data.data.product.title });
  } catch (err) {
    console.error('[Get Product Title Error]:', err);
    res.status(500).json({ error: 'Failed to fetch product title' });
  }
});

module.exports = router;
