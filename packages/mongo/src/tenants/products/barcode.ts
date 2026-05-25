import { BarcodeProduct, barcodeSchema } from "@fresku/model/products/barcode";
import { safeParseBarcodeProducts } from "@fresku/utils/products/barcode/parsing";
import { getNowInUTC } from "@fresku/utils/time/index";
import { Collection, Db, MongoClient } from "mongodb";
import clientPromise from "../..";
import { queryBarcode } from "../../products/barcode";
let client: MongoClient;

async function init(tenantId: string) {
    let db: Db;
    let barcodeProducts: Collection<BarcodeProduct>;

    try {
        client = await clientPromise
        db = client.db(tenantId)
        barcodeProducts = db.collection('p_barcode')
        return { db, barcodeProducts }

    } catch (error: any) {
        throw new Error('Failed to stablish connection to database>' + error.message,)
    }
}

async function tenantGetByBarcode(tenantId: string, barcode: string) {
    const { barcodeProducts } = await init(tenantId);
    const product = await barcodeProducts.findOne({ barcode }, { projection: { _id: 0 } })
    return product
}

async function queryTenantBarcodeProducts(tenantId: string, query: Partial<BarcodeProduct>) {
    const { barcodeProducts } = await init(tenantId);
    const result = await barcodeProducts.find(query).toArray();
    return result;
}

async function addBarcodeProduct(tenantId: string, product: Omit<BarcodeProduct, "searchString">) {
    const { barcodeProducts } = await init(tenantId);
    const parsedProduct = barcodeSchema.safeParse(product);

    if (!parsedProduct.success) {
        throw new Error(`Invalid product data: ${parsedProduct.error.message}`);
    }
    const { name, brand, measure } = parsedProduct.data
    const searchString = `${name} ${brand} ${measure}`
    const result = await barcodeProducts.insertOne({ ...parsedProduct.data, searchString });
    return result
}

async function updateBarcodeProduct(tenantId: string, barcode: string, update: Partial<BarcodeProduct>) {
    const { barcodeProducts } = await init(tenantId);
    const parsedUpdate = barcodeSchema.partial().safeParse(update);

    if (!parsedUpdate.success) {
        throw new Error(`Invalid product data: ${parsedUpdate.error.message}`);
    }

    const result = await barcodeProducts.updateOne({ barcode }, { $set: parsedUpdate.data });
    return result
}

async function upsertBarcodeProduct(tenantId: string, product: Partial<BarcodeProduct>) {
    const { barcodeProducts } = await init(tenantId);
    const parsedProduct = barcodeSchema.partial().safeParse(product)

    const lastUpdate = getNowInUTC()
    if (!parsedProduct.success) {
        throw new Error(`Invalid product data: ${parsedProduct.error.message}`);
    }

    const upsert = await barcodeProducts.updateOne(
        { barcode: product.barcode },
        { $set: { ...parsedProduct.data, lastUpdate } },
        { upsert: true }
    )

    return upsert;
}

async function tenantBarcodeQuerySearch(query: string, tenantId: string, limit: number = 15) {

    const { barcodeProducts } = await init(tenantId);

    const baseProducts = await queryBarcode(query);
    if (!baseProducts.length) return [];
    const barcodes = baseProducts.map(p => p.barcode);
    const results = await barcodeProducts
        .find({ barcode: { $in: barcodes } }, { projection: { _id: 0 } })
        .limit(limit)
        .toArray();

    const tenantResultsMap = Object.fromEntries(results.map(p => [p.barcode, p]));

    const orderedTenantResults = baseProducts.filter(p => tenantResultsMap[p.barcode]).map(p => ({
        ...tenantResultsMap[p.barcode],
        ...p,
        score: p.score
    }
    )).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

    return safeParseBarcodeProducts(orderedTenantResults);
}


export { addBarcodeProduct, queryTenantBarcodeProducts, tenantBarcodeQuerySearch, tenantGetByBarcode, updateBarcodeProduct, upsertBarcodeProduct };

