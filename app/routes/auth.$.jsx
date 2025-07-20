import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  const shop = url.searchParams.get("shop");
  const host = url.searchParams.get("host");

  if (shop && host) {
    throw redirect(`/auth?shop=${shop}&host=${host}`);
  }

  if (shop) {
    throw redirect(`/auth?shop=${shop}`);
  }

  return redirect("/auth");
};

export const action = async ({ request }) => {
  const formData = await request.formData();

  const shop = formData.get("shop");
  const host = formData.get("host");

  if (shop && host) {
    throw redirect(`/auth?shop=${shop}&host=${host}`);
  }

  if (shop) {
    throw redirect(`/auth?shop=${shop}`);
  }

  return redirect("/auth");
};
