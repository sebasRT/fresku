import { formatPrice } from "@/utils/functions/strings";
import { cn } from "@/utils/functions/styles";
import { BarcodeProduct } from "@fresku/model/products/barcode";
import { lazy, Suspense } from "react";
import ProductImage from "../ProductImage";
import AddButton from "./AddButton";
import styles from "./product.module.scss";
const Modal = lazy(() => import("./Modal"));

export const Card = ({
  product,
  size = "normal",
}: {
  product: BarcodeProduct;
  size?: "small" | "normal";
}) => {
  const { name, image, measure, price, stockStatus, brand } = product;

  return (
    <div className={cn(styles.productCard, styles[size])}>
      <AddButton product={product} />
      <Suspense fallback={<></>}>
        {stockStatus !== "out" && (
          <>
            <Modal product={product} />
          </>
        )}
        <ProductImage src={image} alt={name} />
      </Suspense>
      <div className={cn(styles.productDetails, styles[size])}>
        <span className={styles.measure}>{measure}</span>
        <p className={styles.brand}>{brand}</p>
        <h3 className="line-clamp-2">{name}</h3>
        <span className={styles.price}>{formatPrice(price)}</span>
      </div>
    </div>
  );
};
