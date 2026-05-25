"use client";
import { BarcodeProduct } from "@fresku/model/products/barcode";
import {
  useBarcodeCartActions,
  useBarcodeItemQuantity,
} from "@fresku/stores/cart/barcode";
import { MdAddCircle } from "react-icons/md";
import styles from "./product.module.scss";

const AddButton = ({ product }: { product: BarcodeProduct }) => {
  const { barcode } = product;
  const quantity = useBarcodeItemQuantity(barcode);
  const { addToCart } = useBarcodeCartActions();
  const addProduct = () => addToCart({ ...product, barcode });

  return (
    <>
      {quantity > 0 && <span className={styles.count}>{quantity}</span>}
      <button className={styles.addButton} onClick={addProduct}>
        <MdAddCircle className="bg-white rounded-full" />
      </button>
    </>
  );
};

export default AddButton;
