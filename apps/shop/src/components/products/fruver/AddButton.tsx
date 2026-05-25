"use client";
import { getLabelMeasure } from "@/utils/functions/fruver";
import { FruverProduct } from "@fresku/model/products/fruver";
import {
    useFruverCartActions,
    useFruverItemById,
    useFruverItemQuantity,
} from "@fresku/stores/cart/fruver";
import { MdAddCircle } from "react-icons/md";
import styles from "./product.module.scss";

const AddButton = ({ product }: { product: FruverProduct }) => {
  const { sku, sellingFormat } = product;
  const { addToCart } = useFruverCartActions();
  const saved = useFruverItemById(sku);
  const itemQuantity = useFruverItemQuantity(sku);
  const weightLabel = saved && getLabelMeasure(saved);
  const getCount = () => {
    switch (sellingFormat) {
      case "weight":
        return weightLabel;
      case "unit":
        return itemQuantity;
      default:
        return weightLabel;
    }
  };

  const handleAdd = () => {
    switch (sellingFormat) {
      case "unit":
        addToCart({ ...product, quantity: itemQuantity });
        break;
      case "weight":
        addToCart({ ...product, quantity: 1 });
        break;
    }
  };

  return (
    <>
      {saved && <span className={styles.count} children={getCount()} />}
      <button
        className={styles.addButton}
        onClick={handleAdd}
        disabled={itemQuantity > 0 && sellingFormat === "weight"}
      >
        <MdAddCircle className="bg-white rounded-full" />
      </button>
    </>
  );
};

export default AddButton;
