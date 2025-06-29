// shopify.js
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const path = require('path');

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_products'], // add your app scopes here
  hostName: process.env.HOST.replace(/^https?:\/\//, ''),
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
  sessionStorage: new (require('@shopify/shopify-api').session.SQLiteSessionStorage)(
    path.join(__dirname, 'database/shopify.db')
  ),
});

module.exports = { shopify };
