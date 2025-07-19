import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  
  if (url.searchParams.get("shop")) {
    throw redirect(`/auth?${url.searchParams.toString()}`);
  }

  return redirect("/auth");
};

export const action = async ({ request }) => {
  const { shop } = await request.formData();
  
  if (shop) {
    throw redirect(`/auth?shop=${shop}`);
  }
  
  return redirect("/auth");
};