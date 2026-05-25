"use client";
import { BaseBarcodeProduct } from "@fresku/model/products/barcode";
import { createContext, PropsWithChildren, use } from "react";

type Props = {
  product: BaseBarcodeProduct;
  onUpdate: (updatedProduct: BaseBarcodeProduct) => void;
};

const ProductContext = createContext<Props | null>(null);

const ProductProvider = ({
  children,
  product,
  onUpdate,
}: PropsWithChildren<Props>) => {
  return (
    <ProductContext.Provider value={{ product, onUpdate }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = use(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductContextProvider");
  }
  return context;
};

export default ProductProvider;
