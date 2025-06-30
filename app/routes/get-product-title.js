const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const { shopify } = require('../shopify');

// Route: POST /api/get-product-title
router.post('/', async (req, res) => {
  const { productId, shop } = req.body;

  if (!shop || !productId) {
    return res.status(400).json({ error: 'Missing shop or productId' });
  }

  try {
    // Load session by shop domain
    const session = await shopify.sessionStorage.findSessionsByShop(shop);

    if (!session || session.length === 0 || !session[0].accessToken) {
      return res.status(401).json({ error: 'Unauthorized: No active session found for shop' });
    }

    const accessToken = session[0].accessToken;

    // Handle possible incoming global ID
    const globalId = productId.startsWith('gid://')
      ? productId
      : `gid://shopify/Product/${productId}`;

    const response = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query: `
          query Product($id: ID!) {
            product(id: $id) {
              title
            }
          }
        `,
        variables: { id: globalId },
      }),
    });

    const data = await response.json();

    if (!data.data || !data.data.product) {
      return res.status(404).json({ error: 'Product not found or inaccessible' });
    }

    res.json({ title: data.data.product.title });

  } catch (err) {
    console.error('[Get Product Title Error]:', err);
    res.status(500).json({ error: 'Failed to fetch product title' });
  }
});

module.exports = router;
