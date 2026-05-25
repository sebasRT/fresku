"use client";
import { formatPrice } from "@/utils/functions/strings";
import { byBounding } from "@/utils/functions/styles";
import { BarcodeProduct } from "@fresku/model/products/barcode";
import { Suspense, useRef } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import ProductImage from "../ProductImage";
import BControls from "./BControls";
import styles from "./product.module.scss";

const Modal = ({ product }: { product: BarcodeProduct }) => {
  const { name, image, price, measure, brand } = product;

  const dialog = useRef<HTMLDialogElement>(null);

  const handleOpen = () => {
    if (dialog.current) {
      dialog.current.showModal();
    }
  };

  const handleClose = () => {
    if (dialog.current) {
      dialog.current.close();
    }
  };

  return (
    <>
      <button className={styles.modalButton} onClick={handleOpen} />
      <dialog
        className={styles.dialog}
        ref={dialog}
        onClick={(e) => byBounding(e, handleClose)}
        tabIndex={-1}
      >
        <button
          className={styles.closeButton}
          onClick={handleClose}
          children={<IoIosCloseCircleOutline />}
        />
        <Suspense fallback={<></>}>
          <ProductImage src={image} alt={name} />
        </Suspense>
        <div className={styles.productDetails}>
          <span className={styles.measure}>{measure}</span>
          <p className={styles.brand}>{brand}</p>
          <h3 className={styles.modal}>{name}</h3>
          <span className={styles.price}>{formatPrice(price)}</span>
        </div>
        <BControls product={product} />
      </dialog>
    </>
  );
};

export default Modal;
