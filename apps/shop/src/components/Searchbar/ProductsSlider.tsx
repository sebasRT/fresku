"use client";
import { BarcodeProduct } from "@fresku/model/products/barcode";
import { FruverProduct } from "@fresku/model/products/fruver";
import { Card as BarcodeCard } from "../products/barcode/Card";
import { Card as FruverCard } from "../products/fruver/Card";

const ProductsSlider = ({
  barcode,
  fruver,
}: {
  barcode: BarcodeProduct[];
  fruver: FruverProduct[];
}) => {
  return (
    <div className="w-full max-w-full overflow-x-auto">
      {barcode.length < 1 && fruver.length < 1 ? (
        <div> Sin resultados para esta busqueda</div>
      ) : (
        <ul className="flex flex-row gap-4 py-2">
          {fruver.map((product) => (
            <FruverCard key={product.name} product={product} size="small" />
          ))}
          {barcode.map((product) => (
            <BarcodeCard key={product.barcode} product={product} size="small" />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsSlider;
