import Cart from "@/components/Cart";
import { getClientTodaysOrders } from "@/lib/mongo/orders";
import { cookies } from "next/headers";
import { Suspense } from "react";
import styles from "./bottomNav.module.scss";
import Home from "./buttons/Home";
import Recientes from "./buttons/Recientes";

const BottomNav = async ({ domain }: { domain: string }) => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  const recentOrders = sessionId ? await getClientTodaysOrders(domain, sessionId) : null;

  return (
    <>
      {/* <Categorias.Dropup /> */}
      <nav className={styles.bottomNav}>
        <Home />
        {/* <Categorias.Icon /> */}
        <Recientes orders={recentOrders} />
      </nav>

      <Suspense fallback={<span>hola</span>}>
        <Cart type="pop" />
      </Suspense>
    </>
  );
};

export default BottomNav;
