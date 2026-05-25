"use client";
import { BaseBarcodeProduct, NewBarcode } from "@fresku/model/products/barcode";
import { byBounding, cn } from "@fresku/utils/functions/styles";
import {
  createContext,
  ReactNode,
  RefObject,
  use,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOnClickOutside } from "usehooks-ts";
import Form from "./Form";
import styles from "./products.module.scss";

type EditableProduct = Partial<NewBarcode & BaseBarcodeProduct> & {
  done?: boolean;
};
const EditorContext = createContext<{
  activeProduct: EditableProduct;
  setActiveProduct: (product: EditableProduct) => void;
  setShowForm: (show: boolean) => void;
  editProduct: (product: EditableProduct) => void;
  dialogRef: RefObject<HTMLDialogElement>;
  goToNext: () => void;
} | null>(null);

export const useEditorContext = () => {
  const context = use(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an Editor component");
  }
  return context;
};

export default function Editor({
  children,
  initialProducts,
}: {
  children: ReactNode;
  initialProducts: EditableProduct[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(
    null
  ) as RefObject<HTMLDialogElement>;
  const [products, setProducts] = useState<EditableProduct[]>(initialProducts);
  const [activeProduct, setActiveProduct] = useState<EditableProduct>(
    initialProducts[0]
  );
  const editProduct = (product: EditableProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.barcode === product.barcode ? { ...p, ...product } : p
      )
    );
  };

  const goToNext = () => {
    const currentIndex = products.indexOf(activeProduct);
    if (currentIndex < products.length - 1) {
      setActiveProduct(products[currentIndex + 1]);
    } else {
      setActiveProduct(products[0]);
    }
  };

  const setShowForm = (show: boolean) => {
    if (dialogRef.current) {
      show ? dialogRef.current.showModal() : dialogRef.current.close();
    }
  };
  const context = useMemo(
    () => ({
      activeProduct,
      setActiveProduct,
      setShowForm,
      editProduct,
      goToNext,
      dialogRef,
    }),
    [activeProduct]
  );

  return (
    <EditorContext.Provider value={context}>
      {children}
      <section>
        {products.map((product, i) => (
          <Editor.Card product={product} key={i} />
        ))}
      </section>
    </EditorContext.Provider>
  );
}

Editor.Card = function EditorCard({ product }: { product: EditableProduct }) {
  const { activeProduct, setActiveProduct, setShowForm } = useEditorContext();

  if (!product.barcode) return null;

  const handleClick = () => {
    if (!product.barcode) return;
    setActiveProduct(product);
    setShowForm(true);
  };

  return (
    <button
      key={product.barcode}
      className={cn(
        styles.productCard,
        product.done ? styles.done : null,
        product.toReview ? styles.toReview : null,
        activeProduct.barcode === product.barcode ? styles.active : null
      )}
      onClick={handleClick}
    >
      <h2>{product.name}</h2>
      <p>
        <span>{product.brand}</span>
        <span>{product.measure}</span>
      </p>
    </button>
  );
};

Editor.Form = function EditorForm() {
  const { activeProduct, dialogRef, setShowForm } = useEditorContext();
  useOnClickOutside(dialogRef as RefObject<HTMLDialogElement>, () =>
    setShowForm(false)
  );

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => byBounding(e, () => setShowForm(false))}
      className={styles.dialog}
    >
      <Form />
    </dialog>
  );
};
