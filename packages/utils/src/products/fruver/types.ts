import { fruverTags, measureUnits } from "./consts";

type FruverCategory = keyof typeof fruverTags;
type FruverSubcategory = typeof fruverTags[FruverCategory][number];
type MeasureUnit = typeof measureUnits[number];

export type { FruverCategory, FruverSubcategory, MeasureUnit };
