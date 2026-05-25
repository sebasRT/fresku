import styles from "@/components/products/barcode/product.module.scss";
import Skeleton from "./Skeleton";

export const SkeletonCard = () => (
    <Skeleton
        style={{ minWidth: "9rem", minHeight: "15rem", maxHeight: "20em" }}
        className={styles.productCard}
    />
);