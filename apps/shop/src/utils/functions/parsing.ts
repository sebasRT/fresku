// utils/parseBarcodeProducts.ts

import { BarcodeProduct, productSchema as barcodeSchema } from "@/model/products/barcode";

function parseBarcodeProducts(rawProducts: any[]): BarcodeProduct[] {
    return rawProducts.map((product) => {
        const enriched = {
            ...product,
            type: "barcode",
        };
        return barcodeSchema.parse(enriched);
    });
}

function safeParseBarcodeProducts(rawProducts: any[]): BarcodeProduct[] {
    return rawProducts
        .map((product) => ({
            ...product,
            type: "barcode",
        }))
        .filter((product) => {
            const result = barcodeSchema.safeParse(product);
            if (!result.success) {
                console.log("Failed to parse product:", product, "Error:", result.error.errors);
            }
            return result.success;
        }) as BarcodeProduct[];
}

const parseTenantName = (tenantName: string) => {
    const parts = tenantName.split("_tenant");
    if (parts.length > 1) {
        return parts[0];
    }
    return tenantName;
}

export { parseBarcodeProducts, parseTenantName, safeParseBarcodeProducts };

