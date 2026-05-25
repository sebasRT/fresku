import {
  getClientRecentOrders,
  getClientRecentProducts,
} from "@/lib/mongo/orders";
import { getSessionId } from "@fresku/utils/users/id";
import { Suspense } from "react";
import NoSession from "./_c/NoSession";
import LoadingRecentOrders from "./_c/orders/Loading";
import RecentOrders from "./_c/orders/RecentOrders";
import LoadingRecentProducts from "./_c/products/Loading";
import RecentProducts from "./_c/products/RecentProducts";

export default async function Recientes({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const sessionId = await getSessionId();

  if (!sessionId) {
    return <NoSession />;
  }

  const recentOrders = getClientRecentOrders(domain, sessionId);
  const recentProducts = getClientRecentProducts(domain, sessionId);

  return (
    <div className="flex flex-col gap-10 max-w-2xl mx-auto my-5 pl-4">
      <section>
        <h1 className="font-bold text-lg">Tus Domis recientes</h1>
        <Suspense fallback={<LoadingRecentOrders />}>
          <RecentOrders orders={recentOrders} />
        </Suspense>
      </section>
      <section>
        <h2 className=" font-bold text-lg">Tus productos recientes</h2>
        <Suspense fallback={<LoadingRecentProducts />}>
          <RecentProducts products={recentProducts} domain={domain} />
        </Suspense>
      </section>
    </div>
  );
}
