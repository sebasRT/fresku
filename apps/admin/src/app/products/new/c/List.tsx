"use client";
import { NewBarcode } from "@fresku/model/products/barcode";
import { use } from "react";
import Editor from "./Editor";

const List = ({ products }: { products: Promise<NewBarcode[]> }) => {
  const newProducts = use(products);
  if (!newProducts) return null;

  return (
    <Editor initialProducts={newProducts}>
      <Editor.Form />
    </Editor>
  );
};

export default List;
