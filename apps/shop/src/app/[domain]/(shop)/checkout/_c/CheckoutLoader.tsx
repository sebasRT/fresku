import { CheckoutKey, getCheckout, isCheckoutKey } from "@fresku/checkouts";
import { getTenantCheckoutKey } from "@fresku/redis/tenants";
import { use } from "react";

function CheckoutLoader({ domain }: { domain: string }) {
  const key = use(getTenantCheckoutKey(domain, false));
  const checkoutKey: CheckoutKey = isCheckoutKey(key) ? key : "default";

  const Checkout = use(getCheckout(checkoutKey));

  if (!Checkout) return <div>Checkout no encontrado</div>;

  return <Checkout domain={domain} />;
}

export default CheckoutLoader;
