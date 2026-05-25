"use client";
import { Card } from "@/components/products/barcode/Card";
import { BarcodeProduct } from "@fresku/model/products/barcode";

export default function ProductList({
  products,
}: {
  products: BarcodeProduct[];
}) {
  return (
    <>
      {products.map((p, i) => (
        <Card product={p} key={p.barcode + i} />
      ))}
    </>
  );
}
