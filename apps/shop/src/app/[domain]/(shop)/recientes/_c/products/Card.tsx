import { BarcodeProduct } from "@fresku/model/products/barcode";
import { FruverProduct } from "@fresku/model/products/fruver";

const Fruver = ({ product }: { product: FruverProduct }) => {
  if (!product) return null;
  return <div>{product.name}</div>;
};

const Barcode = ({ product }: { product: BarcodeProduct }) => {
  if (!product) return null;
  return <div>{product.name}</div>;
};

export const Card = { Fruver, Barcode };
