import ProductsSlider from "@/components/Searchbar/ProductsSlider";
import { barcodeSchema } from "@fresku/model/products/barcode";
import { fruverSchema } from "@fresku/model/products/fruver";
import { ToolInvocation } from "ai";
import { z } from "zod";

const SearchFruverPart = ({ tool }: { tool: ToolInvocation }) => {
  switch (tool.state) {
    case "result":
      return (
        <Result barcode={tool.result.barcode} fruver={tool.result.fruver} />
      );
  }
};

const Result = ({
  barcode,
  fruver,
}: {
  barcode: BarcodeSearchResult;
  fruver: FruverSearchResult;
}) => {
  if (barcode.products.length === 0 && fruver.products.length === 0)
    return <span>No se encontraron resultados para "{fruver.query}"</span>;

  return (
    <div className="mt-4">
      <span className="text-lg font-semibold">{fruver.query}</span>
      <ProductsSlider barcode={barcode.products} fruver={fruver.products} />
    </div>
  );
};

export type BarcodeSearchResult = {
  message: string;
  products: z.infer<typeof barcodeSchema>[];
  query: string;
};

export type FruverSearchResult = {
  message: string;
  products: z.infer<typeof fruverSchema>[];
  query: string;
};

export default SearchFruverPart;
