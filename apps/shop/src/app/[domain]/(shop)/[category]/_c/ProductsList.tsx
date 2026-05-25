"use client";
import { Card } from "@/components/products/barcode/Card";
import { SkeletonCard as Ske } from "@/components/SkeletonCard";
import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import styles from "./productsList.module.scss";
import { useProducts } from "./useProducts";

const ProductsList = () => {
  const { products, fetchNextPage, hasNextPage } = useProducts();
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5
  })

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [products]);

  useEffect(() => {
    if (!isIntersecting || !hasNextPage) return
    fetchNextPage();
  }, [isIntersecting])

  return (
    <section className={styles.productsList}>
      {products.map((p, i) => (
        <Card product={p} key={p.barcode + i} />
      ))}
      <div ref={ref} className="absolute bottom-96 w-2 h-2 bg-transparent" />
      {hasNextPage && <>
        <Ske />
        <Ske />
        <Ske />
      </>}
    </section>
  );
};

export default ProductsList;
