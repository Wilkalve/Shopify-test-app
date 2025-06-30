// shopify.js
//core configuration for authenticating and connecting app to Shopify’s API
require('dotenv').config();
require('@shopify/shopify-api/adapters/node');
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const { SQLiteSessionStorage } = require('@shopify/shopify-app-session-storage-sqlite');
const path = require('path');

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_products'],
  hostName: (process.env.HOST || '').replace(/^https?:\/\//, ''),
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
  sessionStorage: new SQLiteSessionStorage(
    path.join(__dirname, '../database.db')
  ),
});

module.exports = { shopify };
