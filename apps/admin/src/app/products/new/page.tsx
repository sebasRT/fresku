import { NewBarcode } from "@fresku/model/products/barcode";
import { getNewProducts } from "@fresku/mongo/products/new/barcode";
import List from "./c/List";

const page = async () => {
  const newProducts = getNewProducts() as Promise<NewBarcode[]>;

  return <List products={newProducts} />;
};

export default page;
