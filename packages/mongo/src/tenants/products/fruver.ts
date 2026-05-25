import { FruverProduct } from "@fresku/model/products/fruver";
import { safeParseFruverProducts } from "@fresku/utils/products/fruver/parsing";
import { Collection, Db, MongoClient } from "mongodb";
import clientPromise from "../..";
import { queryFruver } from "../../products/fruver";
let client: MongoClient;

async function init(tenantId: string) {
    let db: Db;
    let fruverProducts: Collection<FruverProduct>;

    try {
        client = await clientPromise
        db = client.db(tenantId)
        fruverProducts = db.collection('p_fruver')
        return { db, fruverProducts }

    } catch (error: any) {
        throw new Error('Failed to stablish connection to database>' + error.message,)
    }
}

async function queryTenantFruverProducts(tenantId: string, query: Partial<FruverProduct>) {
    const { fruverProducts } = await init(tenantId);
    const result = await fruverProducts.find(query).toArray();
    return result;
}

async function addTenantFruverProduct(tenantId: string, product: FruverProduct) {
    const { fruverProducts } = await init(tenantId);
    const result = await fruverProducts.insertOne(product);
    return result;
}

async function updateTenantFruverProduct(tenantId: string, sku: string, update: Partial<FruverProduct>) {
    const { fruverProducts } = await init(tenantId);
    const result = await fruverProducts.updateOne({ sku }, { $set: update });
    return result;
}

async function tenantFruverQuerySearch(query: string, tenantId: string, limit: number = 15) {
    const { fruverProducts } = await init(tenantId)
    const baseProducts = await queryFruver(query)

    const skus = baseProducts.map(p => p.sku)
    const results = await fruverProducts.find({ sku: { $in: skus } }, { projection: { _id: 0, cost: 0, stockStatus: 0 } }).limit(limit).toArray()
    const tenantResultsMap = Object.fromEntries(results.map(p => [p.sku, p]));
    const orderedTenantResults = baseProducts
        .map(base => ({
            ...base,
            ...(tenantResultsMap[base.sku] || {})
        }))
        .filter(p => p.sku);

    return safeParseFruverProducts(orderedTenantResults)
}

export { addTenantFruverProduct, queryTenantFruverProducts, tenantFruverQuerySearch, updateTenantFruverProduct };

