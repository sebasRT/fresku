"use client";
import { getFruverLabels } from "@/utils/functions/fruver";
import { formatPrice } from "@/utils/functions/strings";
import { byBounding } from "@/utils/functions/styles";
import { FruverProduct } from "@fresku/model/products/fruver";
import { useRef } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import ProductImage from "../ProductImage";
import FControls from "./FControls";
import styles from "./product.module.scss";

const Modal = ({ product }: { product: FruverProduct }) => {
  const { name, image, category, sellingFormat } = product;
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
  const { price, measure } = getFruverLabels(product);

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
        <ProductImage src={image} alt={name} />
        <div className={styles.productDetails}>
          {sellingFormat === "unit" && (
            <span className={styles.measure}>{measure}</span>
          )}
          <p className={styles.category}>{category}</p>
          <h3 className={styles.modal}>{name}</h3>
          {sellingFormat === "unit" && (
            <span className={styles.price }>{formatPrice(price)}</span>
          )}
        </div>
        <FControls product={product} />
      </dialog>
    </>
  );
};

export default Modal;
