"use client";
import FreskuIcon from "@/assets/FreskuIcon";
import { cn } from "@/utils/functions/styles";
import { Order } from "@fresku/model/order";
import { formatPrice } from "@fresku/utils/functions/strings";
import { usePathname } from "next/navigation";
import { RefObject, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import styles from "./recientes.module.scss";

const Recientes = ({ orders }: { orders: Order[] | null }) => {
  const pathName = usePathname();
  const [showList, setShowList] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)

  useOnClickOutside(button as RefObject<HTMLElement>, () => { setShowList(false) })
  useEventListener("transitionend", () => !showList && button.current?.classList.remove(styles.listShown), container as RefObject<HTMLDivElement>);

  return (

    <div className={cn([styles.container, showList && styles.listShown, (pathName !== "/" || !orders) && styles.hidden])} ref={container}>
      <button ref={button} className={styles.button} onClick={() => {
        button.current?.classList.add(styles.listShown)
        container.current?.classList.add(styles.listShown)
        setShowList(true)
      }}>
        <span className={styles.count}>{orders?.length}</span>
        <FreskuIcon />
      </button>

      <ul className={cn([styles.ordersList, showList && styles.listShown])}>
        {orders?.map((order) => (
          <OrderLi key={order.orderId} order={order} />
        ))}
      </ul>
    </div>
  );
};

const OrderLi = ({ order }: { order: Order }) => {

  const { subtotal, createdAt, status, address: { label }, deliveryFee } = order

  const statusLabel = {
    pending: "Procesando",
    packed: "En camino",
    delivered: "Entregado",
    canceled: "Cancelado"
  }

  const total = subtotal + deliveryFee
  return (
    <li className={styles.orderLi}>
      <p>{label}</p>
      <div className={styles.details}>
        <span>{formatPrice(total)}</span>
        <span>{statusLabel[status]}</span>
      </div>
    </li>
  )
}

export default Recientes;
