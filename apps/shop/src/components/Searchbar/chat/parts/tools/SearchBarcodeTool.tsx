import ProductsSlider from "@/components/Searchbar/ProductsSlider";
import { barcodeSchema } from "@fresku/model/products/barcode";
import { ToolInvocation } from "ai";
import { z } from "zod";

const SearchBarcodeTool = ({ tool }: { tool: ToolInvocation }) => {
  switch (tool.state) {
    case "result":
      return <Result result={tool.result} />;
  }
};

const Result = ({ result }: { result: BarcodeSearchResult }) => {
  if (!result.products)
    return <span>No se encontraon resultados para "{result.query}"</span>;

  return (
    <div className="mt-4">
      <span className="text-lg font-semibold">{result.query}</span>
      {result.products.length === 0 ? (
        <span className="px-4">No hay resultados para la búsqueda</span>
      ) : (
        <ProductsSlider barcode={result.products} fruver={[]} />
      )}
    </div>
  );
};

export type BarcodeSearchResult = {
  message: string;
  products: z.infer<typeof barcodeSchema>[];
  query: string;
};

export default SearchBarcodeTool;
