import { json, type ActionFunction } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action: ActionFunction = async ({ request }) => {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");

  return json({ success: true });
};
