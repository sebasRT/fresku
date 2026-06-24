import { Order } from "@fresku/model/order";
import { formatPrice } from "@fresku/utils/functions/strings";
import { Coiny } from "next/font/google";
import Link from "next/link";
import { use } from "react";
import { IoIosArrowForward } from "react-icons/io";
import styles from "./recentOrders.module.scss";

const coiny = Coiny({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const RecentOrders = ({ orders }: { orders: Promise<Order[]> }) => {
  const recentOrders = use(orders);
  if (!recentOrders || recentOrders.length === 0) {
    return (
      <p className="mt-9 px-5 text-center">
        Aqui encontraras el historial de tus{" "}
        <span className={coiny.className}>Domis</span> ⚡
      </p>
    );
  }

  return (
    <div className={styles.ordersList}>
      {recentOrders.map((order) => (
        <OrderLI key={order.orderId} order={order} />
      ))}
    </div>
  );
};

const OrderLI = ({ order }: { order: Order }) => (
  <div className={styles.orderListItem}>
    <span>{orderStatus[order.status]}</span>
    <span>
      <span className="font-mono mx-1">
        {(order.products.barcode?.length || 0) +
          (order.products.fruver?.length || 0)}
      </span>
      items
    </span>
    <span>{formatPrice(order.total)}</span>
    <Link href={`/order/${order.orderId}`}>
      Ver <IoIosArrowForward />
    </Link>
  </div>
);

const orderStatus: Record<Order["status"], string> = {
  pending: "Pendiente",
  packed: "En camino",
  delivered: "Entregado",
  canceled: "Cancelado",
  ready_for_pickup: "Listo para recoger"
};
export default RecentOrders;
