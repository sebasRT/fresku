"use server"

import { BaseBarcodeProduct, NewBarcode } from "@fresku/model/products/barcode";
import { upsertBarcodeProduct as addGlobalProduct } from "@fresku/mongo/products/barcode";

import { getBarcodeProductsCount as baseCount, getSortedBarcodeProducts as baseGetSorted, upsertBarcodeProduct as baseUpsert } from "@fresku/mongo/products/barcode";
import { deleteFromNew, setToReview } from "@fresku/mongo/products/new/barcode";
import { upsertBarcodeProduct as upserTenantBarcode } from "@fresku/mongo/tenants/products/barcode";

export async function upsertBarcodeProduct(...args: Parameters<typeof baseUpsert>) {
    return await baseUpsert(...args);
}

export async function getSortedBarcodeProducts(...args: Parameters<typeof baseGetSorted>) {
    return await baseGetSorted(...args);
}

export async function getBarcodeProductsCount(filter: Partial<BaseBarcodeProduct> = {}): Promise<number> {
    return await baseCount(filter);
}

export async function addNewToGlobalAndUpdateTenants(product: Omit<NewBarcode & BaseBarcodeProduct, "searchString">, toReview: boolean = false) {
    if (toReview) {
        await setToReview(product.barcode, product)
        return { success: true }
    }

    const globalResult = await addGlobalProduct(product)

    if (globalResult.modifiedCount > 0 || globalResult.upsertedCount > 0) {
        await deleteFromNew(product.barcode)
    }

    if (product.tenants) {
        for (const tenant of product.tenants) {
            await upserTenantBarcode(tenant, product) // Update tenant's product collection with new data
        }
        return { success: true }
    }

    return { success: globalResult }
}