"use client";
import ProductImage from "@/components/ProductImage";
import {
  BaseBarcodeProduct,
  baseProductSchema,
} from "@fresku/model/products/barcode";
import { byBounding, cn } from "@fresku/utils/functions/styles";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  RefObject,
  use,
  useRef,
} from "react";
import { useOnClickOutside } from "usehooks-ts";
import EditForm from "./Form";

type Props = {
  product: BaseBarcodeProduct;
  onUpdate: (updateProduct: BaseBarcodeProduct) => void;
};

const ProductContext = createContext<Props | null>(null);

export const EditBarcode = ({
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

const useProduct = () => {
  const context = use(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductContextProvider");
  }
  return context;
};

EditBarcode.Card = function Card({ withModal = true }: { withModal: boolean }) {
  const { product } = useProduct();

  if (!product) return null;
  const { name, brand, image, category, subcategory, measure } = product;

  const error = baseProductSchema.safeParse(product).error?.formErrors;

  const errors = Object.keys(error?.fieldErrors || {});
  const isInvalid = (name: string) => errors.includes(name);
  const invalidClass = (name: string) => isInvalid(name) && "text-red-400";

  return (
    <div className="relative flex flex-col justify-evenly items-center w-52 border-4 border-gray-400 p-1">
      <p className={cn(invalidClass("barcode"))}>{product.barcode}</p>
      <p className={cn(invalidClass("brand"))}>{brand}</p>
      <ProductImage src={image} alt={name} />
      <h3
        className={cn(
          invalidClass("name"),
          "text-xl text-center font-semibold"
        )}
      >
        {name}
      </h3>
      <p className={cn(invalidClass("measure"))}>{measure}</p>
      <p className={cn(invalidClass("category"))}>{category}</p>
      <p className={cn(invalidClass("subcategory"))}>{subcategory}</p>
      {withModal && (
        <EditBarcode.Modal>
          <EditBarcode.Form />
        </EditBarcode.Modal>
      )}
    </div>
  );
};

EditBarcode.Form = function Form() {
  const { product, onUpdate } = useProduct();
  return <EditForm defaultValues={product} onUpdate={onUpdate} />;
};

EditBarcode.Modal = function Modal({ children }: { children: ReactNode }) {
  const modalRef = useRef<HTMLDialogElement>(null);

  const setShowForm = (show: boolean) => {
    if (modalRef.current) {
      show ? modalRef.current.showModal() : modalRef.current.close();
    }
  };

  useOnClickOutside(modalRef as RefObject<HTMLDialogElement>, () =>
    setShowForm(false)
  );

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="absolute inset-0 m-auto"
      />
      <dialog
        ref={modalRef}
        className="modal m-auto"
        onClick={(e) => byBounding(e, () => setShowForm(false))}
      >
        {children}
      </dialog>
    </>
  );
};

export default EditBarcode;
