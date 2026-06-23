"use server"

import { BaseBarcodeProduct, NewBarcode } from "@fresku/model/products/barcode";
import { upsertBarcodeProduct as addGlobalProduct } from "@fresku/mongo/products/barcode";

import { getBarcodeProductsCount as baseCount, getSortedBarcodeProducts as baseGetSorted, upsertBarcodeProduct as baseUpsert } from "@fresku/mongo/products/barcode";
import { deleteFromNew, setToReview } from "@fresku/mongo/products/new/barcode";
import { pushBarcodeProduct } from "@fresku/mongo/tenants/products/barcode";

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
            await pushBarcodeProduct(tenant, product)
        }
        return { success: true }
    }

    return { success: globalResult }
}