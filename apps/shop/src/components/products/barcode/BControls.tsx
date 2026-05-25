"use client";
import { BarcodeProduct } from "@fresku/model/products/barcode";
import {
  useBarcodeCartActions,
  useBarcodeItemQuantity,
} from "@fresku/stores/cart/barcode";
import clsx from "clsx";
import { MdAddCircle, MdRemove } from "react-icons/md";
import styles from "./product.module.scss";

const BControls = ({ product }: { product: BarcodeProduct }) => {
  const cartItemQuantity = useBarcodeItemQuantity(product.barcode);
  const { addToCart, removeUnitByBarcode } = useBarcodeCartActions();

  const addUnit = () => {
    addToCart(product);
  };

  const removeUnit = () => {
    removeUnitByBarcode(product.barcode);
  };

  return (
    <div className={clsx(styles.barcodeControls, styles["modal-controls"])}>
      {cartItemQuantity > 0 && (
        <span className={styles.count}>{cartItemQuantity}</span>
      )}

      <button children={<MdRemove />} onClick={removeUnit} />
      <span>{cartItemQuantity}</span>
      <button children={<MdAddCircle />} onClick={addUnit} />
    </div>
  );
};

export default BControls;
