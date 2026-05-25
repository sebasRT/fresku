import { CheckoutKey, getCheckout } from "@fresku/checkouts";
import { getTenantDB } from "@fresku/redis/tenants";
import { use } from "react";

function CheckoutLoader({ domain }: { domain: string }) {
  const database = use(getTenantDB(domain, false));

  const checkoutKey: CheckoutKey =
    (database?.replace("t_", "") as CheckoutKey) || "default";

  const Checkout = use(getCheckout(checkoutKey));

  if (!Checkout) return <div>Checkout no encontrado</div>;

  return <Checkout domain={domain} />;
}

export default CheckoutLoader;
