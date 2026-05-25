import { BarcodeProduct, BaseBarcodeProduct } from "@fresku/model/products/barcode";

export function sortBarcodeProducts(products: BarcodeProduct[] | BaseBarcodeProduct[]) {
    return products.sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        if (a.subcategory !== b.subcategory) {
            return a.subcategory.localeCompare(b.subcategory);
        }
        if (a.name !== b.name) {
            return a.name.localeCompare(b.name);
        }
        if (a.measure !== b.measure) {
            return a.measure.localeCompare(b.measure);
        }
        if (a.brand !== b.brand) {
            return a.brand.localeCompare(b.brand);
        }
        return a.name.localeCompare(b.name);
    })
}