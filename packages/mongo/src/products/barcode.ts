import { BarcodeProduct, BaseBarcodeProduct, baseProductSchema, TenantBarcodeProduct } from "@fresku/model/products/barcode";
import { filterBestMatch } from "@fresku/utils/ai/products/barcode";
import { getNowInUTC } from "@fresku/utils/time/index";
import { WithRequired } from "@fresku/utils/types";
import { Collection, Db, Filter, MongoClient } from "mongodb";
import clientPromise from "..";

let client: MongoClient;
let db: Db;
let barcodeProducts: Collection<BaseBarcodeProduct>;

async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = client.db("Products")
        barcodeProducts = db.collection('p_barcode')
    } catch (error) {
        throw new Error('Failed to stablish connection to database')
    }
}

async function queryBarcode(
    query: string,
) {
    await init();
    try {
        if (query.length < 3) return [];
        const result = await barcodeProducts.aggregate([
            {
                $search: {
                    index: "p_barcode",
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query,
                                    path: "searchString",
                                    fuzzy: {
                                        maxEdits: 1,
                                        prefixLength: 2
                                    },
                                    score: { boost: { value: 5 } }
                                }
                            },
                            {
                                text: {
                                    query,
                                    path: ["name", "brand"],
                                    fuzzy: {
                                        prefixLength: 2
                                    },
                                    score: { boost: { value: 2 } }
                                }
                            },
                        ],
                        minimumShouldMatch: 2
                    }
                }
            },
            {
                $addFields: {
                    score: { $meta: "searchScore" }
                }
            },
            {
                $sort: { score: -1 }
            },
            {
                $project: {
                    _id: 0,
                    ada_embedding: 0,
                    tags: 0
                }
            },
            { $limit: 15 }
        ]).toArray();

        return result as (BaseBarcodeProduct & { score: number })[];
    } catch (error) {
        return [];
    }
}

async function getMetadataFromBarcodeArray(barcodes: string[]) {
    await init()
    try {
        const results = await barcodeProducts.find({ barcode: { $in: barcodes } }, { projection: { _id: 0, ada_embeddings: 0 } }).toArray();
        return results as BaseBarcodeProduct[];
    } catch (error: any) {
        throw new Error(error.message)
    }
}

async function fillWithMetadata(products: TenantBarcodeProduct[]) {
    const barcodes = products.map(p => p.barcode);
    const results = await getMetadataFromBarcodeArray(barcodes);
    const resultsMap = Object.fromEntries(results.map(p => [p.barcode, p]));

    return products.map(product => ({
        ...product,
        ...(resultsMap[product.barcode] || {})
    })) as BarcodeProduct[];
}

async function getByBarcode(barcode: string) {
    await init()
    const product = await barcodeProducts.findOne({ barcode }, { projection: { ada_embedding: 0 } });
    return product
}

async function aiSearch(query: string, measure?: string, limit: number = 15) {
    await init();

    let results = await queryBarcode(query);
    const completeQuery = measure ? `${query} medida: ${measure}` : query;

    if (!results.length) {
        return []
    }
    return (await filterBestMatch(completeQuery, results)).products;
}

async function addBarcodeProduct(product: Omit<BaseBarcodeProduct, "searchString">) {
    await init()
    const parsedProduct = baseProductSchema.omit({ searchString: true }).safeParse(product);
    if (!parsedProduct.success) {
        throw new Error(`Invalid product data: ${parsedProduct.error.message}`);
    }
    const { name, brand, measure } = parsedProduct.data
    await barcodeProducts.insertOne({ ...parsedProduct.data, searchString: `${name} ${brand} ${measure}` });
    return parsedProduct.data;
}

async function upsertBarcodeProduct(product: WithRequired<BaseBarcodeProduct, "barcode">) {
    await init()
    const parsedProduct = baseProductSchema.omit({ searchString: true }).safeParse(product);
    if (!parsedProduct.success) {
        throw new Error(`Invalid product data: ${parsedProduct.error.message}`);
    }
    const { name, brand, measure, barcode } = parsedProduct.data
    const lastUpdate = getNowInUTC();
    const result = await barcodeProducts.updateOne(
        { barcode },
        { $set: { ...parsedProduct.data, searchString: `${name} ${brand} ${measure}`, lastUpdate } },
        { upsert: true }
    );
    return result
}

async function getSortedBarcodeProducts(page = 0, limit = 20) {
    await init();
    const products = await barcodeProducts.find({}, { sort: { category: 1, subcategory: 1, name: 1, brand: 1 }, skip: (page + 1) * limit, limit }).project({ _id: 0 }).toArray();
    return products as BaseBarcodeProduct[]
}

async function getBarcodeProductsCount(filter: Filter<BaseBarcodeProduct> = {}) {
    await init();
    const count = await barcodeProducts.countDocuments(filter);
    return count;
}

export {
    addBarcodeProduct, aiSearch, fillWithMetadata, getBarcodeProductsCount, getByBarcode, getMetadataFromBarcodeArray, getSortedBarcodeProducts, queryBarcode,
    upsertBarcodeProduct
};

