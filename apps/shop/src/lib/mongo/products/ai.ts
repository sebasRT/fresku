import { TenantBarcodeProduct } from "@fresku/model/products/barcode";
import { FruverProduct } from "@fresku/model/products/fruver";
import clientPromise from "@fresku/mongo/index";
import { queryBarcode } from "@fresku/mongo/products/barcode";
import { queryFruver } from "@fresku/mongo/products/fruver";
import { getTenantDB } from "@fresku/redis/tenants";
import { filterBestMatch as filterBarcodeBestMarch } from "@fresku/utils/ai/products/barcode";
import { filterBestMatch as filterFruverBestMarch } from "@fresku/utils/ai/products/fruver";
import { safeParseBarcodeProducts } from "@fresku/utils/products/barcode/parsing";
import { safeParseFruverProducts } from "@fresku/utils/products/fruver/parsing";
import { Collection, Db, MongoClient } from "mongodb";

let client: MongoClient;

async function init(domain: string) {

    const database = await getTenantDB(domain)
    if (!database) throw new Error('Failed to fetch database name' + domain)

    let db: Db;
    let barcode: Collection<TenantBarcodeProduct>;
    let fruver: Collection<FruverProduct>;

    try {
        client = await clientPromise
        db = client.db(database)
        barcode = db.collection('p_barcode')
        fruver = db.collection('p_fruver')
        return { db, barcode, fruver }

    } catch (error: any) {
        throw new Error('Failed to stablish connection to database>' + error.message,)
    }
}


async function barcodeAiSearch(query: string, domain: string, context?: string) {

    try {
        const { barcode } = await init(domain);
        const baseProducts = await queryBarcode(query);

        if (!baseProducts.length) return { message: 'Sin resultados para' + query, products: [] };

        const barcodes = baseProducts.map(p => p.barcode);
        const results = await barcode.find(
            { barcode: { $in: barcodes } },
            { projection: { _id: 0, cost: 0, stockStatus: 0, tags: 0 } }
        ).toArray();

        const tenantResultsMap = new Map(results.map(p => [p.barcode, p]));

        const orderedTenantResults = baseProducts
            .filter(p => tenantResultsMap.has(p.barcode))
            .map(p => ({
                ...tenantResultsMap.get(p.barcode),
                ...p
            }));

        const checkedResults = safeParseBarcodeProducts(orderedTenantResults);

        if (checkedResults.length === 0) {
            return { message: 'No hay resultados para la búsqueda', products: [] };
        }

        return await filterBarcodeBestMarch(query, checkedResults, true, context);
    } catch (error: any) {
        throw new Error(error.message)
    }
}

async function fruverAiSearch(query: string, domain: string, context?: string) {

    try { 
        const { fruver } = await init(domain);
        const baseProducts = await queryFruver(query);
        if (!baseProducts.length) return { message: 'Sin resultados para' + query, products: [] };
        const skus = baseProducts.map(p => p.sku);
        const results = await fruver.find(
            { sku: { $in: skus } },
            { projection: { _id: 0, cost: 0, stockStatus: 0 } }
        ).toArray();

        const tenantResultsMap = new Map(results.map(p => [p.sku, p]));

        const orderedTenantResults = baseProducts
            .filter(p => tenantResultsMap.has(p.sku))
            .map(p => ({
                ...tenantResultsMap.get(p.sku),
                ...p
            }));

        const checkedResults = safeParseFruverProducts(orderedTenantResults);

        return await filterFruverBestMarch(query, checkedResults, true, context);
    } catch (error: any) {
        throw new Error(error)
    }
}

export { barcodeAiSearch, fruverAiSearch };

