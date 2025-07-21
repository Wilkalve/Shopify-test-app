import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server.js";
import { Buffer } from "buffer";

console.log("SHOPIFY_APP_URL:", process.env.SHOPIFY_APP_URL);

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "http://localhost:3000",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },

  // handle custom domains
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),

  // redirect with host parameter
  async afterAuth({ session, redirect }) {
    const shop = session.shop;
    const host = Buffer.from(`${shop}/admin`).toString("base64");

    return redirect(`/?shop=${shop}&host=${host}`);
  },
});

export default shopify;

export const apiVersion = ApiVersion.January25;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

// Optional security headers
export function addDocumentResponseHeaders(request, responseHeaders) {
  responseHeaders.delete("X-Frame-Options");

  responseHeaders.set(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://*.myshopify.com https://admin.shopify.com"
  );
}
