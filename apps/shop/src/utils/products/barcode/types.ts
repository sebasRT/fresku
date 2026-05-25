import { categories } from "./consts";

type Category = (typeof categories)[number];
type Subcategory = (Category)[number];

export type { Category, Subcategory };

