import { BaseBarcodeProduct } from "@fresku/model/products/barcode";
import { useRef } from "react";

const EditBarcodeModal = ({ product }: { product: BaseBarcodeProduct }) => {
  if (!product) return null;

  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="absolute inset-0"
        onClick={() => modalRef.current?.showModal()}
      />
      <dialog ref={modalRef}></dialog>
    </>
  );
};

export default EditBarcodeModal;
