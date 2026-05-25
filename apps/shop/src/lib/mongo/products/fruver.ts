'use server'
import clientPromise from "@/lib/mongo";
import { FruverProduct } from "@fresku/model/products/fruver";
import { queryFruver } from "@fresku/mongo/products/fruver";
import { getTenantDB } from "@fresku/redis/tenants";
import { filterBestMatch } from "@fresku/utils/ai/products/fruver";
import { safeParseFruverProducts } from "@fresku/utils/products/fruver/parsing";
import { Collection, Db, MongoClient } from "mongodb";

let client: MongoClient;

async function init(domain: string) {
    const database = await getTenantDB(domain)
    if (!database) throw new Error('Failed to fetch database name' + domain)

    let db: Db;
    let products: Collection<FruverProduct>;

    try {
        client = await clientPromise
        db = client.db(database)
        products = db.collection('p_fruver')
        return { db, products };
    } catch (error) {
        throw new Error('Failed to stablish connection to database')
    }
}

export async function findFirst(domain: string) {
    const { products } = await init(domain)
    return await products.find({}, { projection: { _id: 0 } }).toArray();

}

async function fruverQuerySearch(query: string, domain: string, limit: number = 15) {
    const { products } = await init(domain)
    const baseProducts = await queryFruver(query)

    const skus = baseProducts.map(p => p.sku)
    const results = await products.find({ sku: { $in: skus } }, { projection: { _id: 0, cost: 0, stockStatus: 0 } }).limit(limit).toArray()
    const tenantResultsMap = Object.fromEntries(results.map(p => [p.sku, p]));
    const orderedTenantResults = baseProducts
        .map(base => ({
            ...base,
            ...(tenantResultsMap[base.sku] || {})
        }))
        .filter(p => p.sku);

    return safeParseFruverProducts(orderedTenantResults)
}

async function tenantAiFruverSearch(query: string, domain: string, context?: string) {

    try {
        const { products } = await init(domain);
        const baseProducts = await queryFruver(query);
        if (!baseProducts.length) return { message: 'Sin resultados para' + query, products: [] };
        const skus = baseProducts.map(p => p.sku);
        const results = await products.find(
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

        return await filterBestMatch(query, checkedResults, true, context);
    } catch (error: any) {
        throw new Error(error)
    }
}

async function getFruverFeatured(domain: string, limit: number = 10) {
    const { products } = await init(domain)
    const featuredProducts = await products

        .find({ featured: true }, { projection: { _id: 0 } })
        .limit(limit)
        .toArray();
    return safeParseFruverProducts(featuredProducts);
}

async function getFruverSamples(domain: string, limit: number = 5) {
    const { products } = await init(domain)
    const sampleProducts = await products

        .aggregate([{ $sample: { size: limit } }, { $project: { _id: 0 } }])
        .toArray();
    return safeParseFruverProducts(sampleProducts);
}

async function getFruverProducts(domain: string, skus: string[] = []): Promise<FruverProduct[]> {
    const { products } = await init(domain)
    return await products.find({ sku: { $in: skus } }, { projection: { _id: 0 } }).toArray();
}

export { fruverQuerySearch, getFruverFeatured, getFruverProducts, getFruverSamples, tenantAiFruverSearch };

