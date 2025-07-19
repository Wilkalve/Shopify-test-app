export const loader = async ({ request }) => {
  const { authenticate } = await import("../../shopify.server");
  return authenticate.admin(request);
};
