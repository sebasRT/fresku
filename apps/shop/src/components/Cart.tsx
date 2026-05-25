"use client";
import styles from "./cart.module.scss";
import {
  useBarcodeCartActions,
  useBarcodeCount,
} from "@fresku/stores/cart/barcode";
import { useFruverCount } from "@fresku/stores/cart/fruver";
import { FaCartShopping } from "react-icons/fa6";
import CartResume from "./CartResume";

const Cart = ({ type }: { type: "nav" | "pop" }) => {
  const { toggle } = useBarcodeCartActions();
  const fruverCount = useFruverCount();
  const barcodeCount = useBarcodeCount();
  const count = barcodeCount + fruverCount;
  
  return (
    <>
      <button
        id={styles.cart}
        className={styles[type]}
        onClick={() => toggle()}
      >
        <div>
          {count > 0 && <span>{count}</span>}
          <FaCartShopping />
        </div>
      </button>
      <CartResume />
    </>
  );
};

export default Cart;
