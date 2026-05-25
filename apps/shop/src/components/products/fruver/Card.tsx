import { getLabelMeasure, getLabelPrice } from "@/utils/functions/fruver";
import { formatPrice } from "@/utils/functions/strings";
import { cn } from "@/utils/functions/styles";
import { FruverProduct } from "@fresku/model/products/fruver";
import { Suspense } from "react";
import ProductImage from "../ProductImage";
import AddButton from "./AddButton";
import Modal from "./Modal";
import styles from "./product.module.scss";

export const Card = ({
  product,
  size = "normal",
}: {
  product: FruverProduct;
  size: "small" | "normal";
}) => {
  const { name, image, category, stockStatus } = product;
  const measure = getLabelMeasure(product);
  const price = getLabelPrice(product);

  return (
    <div className={cn(styles.productCard, styles[size])}>
      <Suspense fallback={<></>}>
        {stockStatus !== "out" && (
          <>
            <Modal product={product} />
            <AddButton product={product} />
          </>
        )}
      </Suspense>
      <ProductImage src={image} alt={name} />
      <div className={cn(styles.productDetails, styles[size])}>
        <span className={styles.measure}>{measure}</span>
        <p className={styles.category}>Fruver</p>
        <h3 className="line-clamp-2">{name}</h3>
        <span className={styles.price}>{formatPrice(price)}</span>
      </div>
    </div>
  );
};
