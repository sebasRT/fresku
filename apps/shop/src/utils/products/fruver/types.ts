import { fruverTags } from "./consts";

type FruverCategory = keyof typeof fruverTags;
type FruverSubcategory = typeof fruverTags[FruverCategory][number];

export type { FruverCategory, FruverSubcategory };

