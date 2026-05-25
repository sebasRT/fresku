'use server'
import { Category } from "@/utils/consts/barcode";
import { BarcodeProduct, TenantBarcodeProduct } from "@fresku/model/products/barcode";
import { fillWithMetadata, queryBarcode } from "@fresku/mongo/products/barcode";
import { getTenantDB } from "@fresku/redis/tenants";
import { filterBestMatch } from "@fresku/utils/ai/products/barcode";
import { safeParseBarcodeProducts } from "@fresku/utils/products/barcode/parsing";
import { sortBarcodeProducts } from "@fresku/utils/products/barcode/sort";
import { FilterProps } from "@fresku/utils/products/barcode/types";
import { Collection, Db, MongoClient } from "mongodb";
import clientPromise from "..";

let client: MongoClient;

async function init(domain: string) {

    const database = await getTenantDB(domain)
    if (!database) throw new Error('Failed to fetch database name' + domain)

    let db: Db;
    let products: Collection<TenantBarcodeProduct>;

    try {
        client = await clientPromise
        db = client.db(database)
        products = db.collection('p_barcode')
        return { db, products }

    } catch (error: any) {
        throw new Error('Failed to stablish connection to database>' + error.message,)
    }
}

async function fillAndParse(products: TenantBarcodeProduct[]) {
    const result = await fillWithMetadata(products)
    return sortBarcodeProducts(safeParseBarcodeProducts(result)) as BarcodeProduct[]
}

async function barcodeQuerySearch(query: string, domain: string, limit: number = 15) {

    const { products } = await init(domain);

    const baseProducts = await queryBarcode(query);
    if (!baseProducts.length) return [];
    const barcodes = baseProducts.map(p => p.barcode);
    const results = await products
        .find({ barcode: { $in: barcodes } }, { projection: { _id: 0, barcode: 1, image: 1, brand: 1, name: 1, category: 1, subcategory: 1, measure: 1, price: 1 } })
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

async function tenantAiSearch(query: string, domain: string, context?: string) {

    try {
        const { products } = await init(domain);
        const baseProducts = await queryBarcode(query);

        if (!baseProducts.length) return { message: 'Sin resultados para' + query, products: [] };

        const barcodes = baseProducts.map(p => p.barcode);
        const results = await products.find(
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

        return await filterBestMatch(query, checkedResults, true, context);
    } catch (error: any) {
        throw new Error(error.message)
    }
}



async function getProductsByCategory(category: Category, domain: string, pagination?: { skip: number, limit: number }) {
    const { products } = await init(domain)

    if (!pagination) {
        const results = await products
            .find({ category }, { projection: { _id: 0, cost: 0 } })
            .sort({ subcategory: 1, name: 1, measure: 1 })
            .toArray();

        return fillAndParse(results)
    }

    const { skip, limit } = pagination

    const withPagination = await products
        .find({ category }, { projection: { _id: 0, cost: 0 } })
        .sort({ subcategory: 1, name: 1, measure: 1 })
        .skip(skip)
        .limit(limit)
        .toArray();

    return fillAndParse(withPagination)

}

async function getProductsBySubcategory(subcategory: string, domain: string, pagination?: { skip: number, limit: number }) {
    const { products } = await init(domain)

    if (!pagination) {
        const results = await products
            .find({ subcategory }, { projection: { _id: 0, cost: 0 } })
            .sort({ name: 1, measure: 1 })
            .toArray();

        return fillAndParse(results)
    }

    const { skip, limit } = pagination

    const withPagination = await products
        .find({ subcategory }, { projection: { _id: 0, cost: 0 } })
        .sort({ subcategory: 1, name: 1, measure: 1 })
        .skip(skip)
        .limit(limit)
        .toArray();

    return fillAndParse(withPagination)

}

async function getProductsByFilterOptions(domain: string, filters: FilterProps, pagination?: { skip: number, limit: number }) {
    const { products } = await init(domain)


    if (!pagination) {
        const results = await products
            .find(filters, { projection: { _id: 0, cost: 0 } })
            .sort({ category: 1, subcategory: 1, name: 1, measure: 1 })
            .toArray();

        return fillAndParse(results)
    }

    const { skip, limit } = pagination

    const withPagination = await products
        .find(filters, { projection: { _id: 0, cost: 0 } })
        .sort({ category: 1, subcategory: 1, name: 1, measure: 1 })
        .skip(skip)
        .limit(limit)
        .toArray();

    return fillAndParse(withPagination)
}


async function getSamplesByCategory(category: Category, domain: string, sample?: number) {
    const { products } = await init(domain)

    try {
        if (sample) {
            const result = await products.aggregate([{ $match: { category } }, { $sample: { size: sample } }, { $project: { _id: 0, cost: 0 } }]).toArray();

            return fillAndParse(result as TenantBarcodeProduct[])
        }
        const result = await products.find({ category }, { projection: { _id: 0 } }).toArray();
        return fillAndParse(result)
    } catch (error: any) {
        throw new Error(error.message)
    }
}

async function getBarcodeProducts(domain: string, barcodes: string[]) {
    const { products } = await init(domain);
    try {
        const result = await products.find({ barcode: { $in: barcodes } }, { projection: { _id: 0, cost: 0 } }).toArray();
        return fillAndParse(result as TenantBarcodeProduct[])
    } catch (error: any) {
        throw new Error(error.message)
    }
}

async function getCountByCategory(domain: string, category: Category,) {

    const { products } = await init(domain);
    try {
        const result = await products.countDocuments({ category });
        return result;
    } catch (error: any) {
        throw new Error(error.message)
    }

}


async function getCountBySubcategory(domain: string, subcategory: string,) {
    const { products } = await init(domain);
    try {
        const result = await products.countDocuments({ subcategory });
        return result;
    } catch (error: any) {
        throw new Error(error.message)
    }
}

async function getCountByFilterOptions(domain: string, filters: FilterProps,) {
    const { products } = await init(domain);
    try {
        const result = await products.countDocuments(filters);
        return result;
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export {
    barcodeQuerySearch, getBarcodeProducts, getCountByCategory, getCountByFilterOptions, getCountBySubcategory, getProductsByCategory, getProductsByFilterOptions, getProductsBySubcategory, getSamplesByCategory,
    tenantAiSearch
};

