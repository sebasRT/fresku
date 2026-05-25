"use client";
import styles from "./cart.module.scss";
import { getFruverLabels } from "@/utils/functions/fruver";
import { formatPrice } from "@/utils/functions/strings";
import { BarcodeProduct } from "@fresku/model/products/barcode";
import { FruverProduct } from "@fresku/model/products/fruver";
import {
  useBarcodeCartActions,
  useBarcodeCount,
  useBarcodeItemQuantity,
  useBarcodeItems,
  useBarcodeSubtotal,
  useCartOpen,
} from "@fresku/stores/cart/barcode";
import {
  useFruverCount,
  useFruverItemQuantity,
  useFruverItems,
  useFruverSubtotal,
} from "@fresku/stores/cart/fruver";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MdClose } from "react-icons/md";
import ProductImage from "./products/ProductImage";
import Modal from "./products/barcode/Modal";
import FruverModal from "./products/fruver/Modal";

const LottieAnimation = dynamic(
  () => import("@/assets/lotties/tsx/AddProduct"),
  { ssr: false }
);

const CartResume = () => {
  
  const { toggle } = useBarcodeCartActions();
  const open = useCartOpen();
  const barcodeItems = useBarcodeItems();
  const fruverItems = useFruverItems();
  const barcodeSubtotal = useBarcodeSubtotal();
  const fruverSubtotal = useFruverSubtotal();
  const count = useBarcodeCount();
  const fruverCount = useFruverCount();
  const subtotal = barcodeSubtotal + fruverSubtotal;

  return (
    <>
      <div
        onClick={() => toggle(false)}
        className={clsx(styles.layer, {
          [styles.open]: open,
          "backdrop-blur-2xl": open,
        })}
      />
      <div className={clsx(styles.cartResume, { [styles.open]: open })}>
        <nav>
          <h2>{`Tu carrito ${barcodeItems.length < 1 ? "está vacio" : ""}`}</h2>
          <MdClose onClick={() => toggle(false)} className="cursor-pointer" />
        </nav>
        {count < 1 && fruverCount < 1 && (
          <figure>
            <LottieAnimation />
          </figure>
        )}

        <ul>
          {fruverItems.map((item, index) => (
            <FruverItem key={item.sku + index} item={item} />
          ))}
          {barcodeItems.map((item, index) => (
            <BarcodeItem key={item.barcode + index} item={item} />
          ))}
        </ul>
        {(barcodeItems.length > 0 || fruverItems.length > 0) && (
          <section>
            <p>
              <span>Subtotal</span>
              <b>{formatPrice(subtotal)}</b>
            </p>
            <Link
              href={"/checkout"}
              onClick={() => toggle(false)}
              children={<span>Pedir</span>}
              className={styles.goToCheckout}
              autoFocus
            />
          </section>
        )}
      </div>
    </>
  );
};

const BarcodeItem = ({ item }: { item: BarcodeProduct }) => {
  const { barcode, image, name, price } = item;
  const quantity = useBarcodeItemQuantity(barcode);

  return (
    <li>
      <Modal product={item} />
      <figure>
        <ProductImage src={image} alt={name} />
      </figure>
      <section className={styles.productDetails}>
        <h3>{name}</h3>
        <div>
          <span>{formatPrice(price)} c/u</span>
          <span>{quantity}</span>
          <span>{formatPrice(price * quantity)}</span>
        </div>
      </section>
    </li>
  );
};

const FruverItem = ({ item }: { item: FruverProduct }) => {
  const { image, sku, name, avrWeight } = item;
  const quantity = useFruverItemQuantity(sku);
  const { price, measure } = getFruverLabels(item);
  const measureLabel = measure.includes("Unidad")
    ? `${avrWeight} g x ${quantity} `
    : measure;
  return (
    <li>
      <FruverModal product={item} />
      <figure>
        <ProductImage src={image} alt={name} />
      </figure>
      <section className={styles.productDetails}>
        <h3>{name}</h3>
        <div>
          <span>{formatPrice(price)}</span>
          <span>{measureLabel}</span>
          <span>{formatPrice(price * quantity)}</span>
        </div>
      </section>
    </li>
  );
};
export default CartResume;
