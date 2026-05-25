import { BarcodeProduct } from "@fresku/model/products/barcode";
import { categories } from "./consts";

type Category = (typeof categories)[number];
type Subcategory = (Category)[number];

type FilterProps = Partial<Pick<BarcodeProduct, "subcategory" | "stockStatus" | "category" | "brand">>

export type { Category, FilterProps, Subcategory };

