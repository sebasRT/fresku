import { BarcodeProduct, newBarcodeSchema } from "@fresku/model/products/barcode";
import { Collection, Db, MongoClient } from "mongodb";
import clientPromise from "../..";
import { upsertBarcodeProduct } from "../../tenants/products/barcode";

let client: MongoClient;
let db: Db;
let barcodeProducts: Collection<Partial<BarcodeProduct & { tenants: string[] }>>;

async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = client.db("Products")
        barcodeProducts = db.collection('n_barcode')
    } catch (error) {
        throw new Error('Failed to stablish connection to database')
    }
}

async function addProductFromTenant(tenantId: string, product: Partial<BarcodeProduct>) {
    await init()
    newBarcodeSchema.omit({ tenants: true }).parse(product)

    const { barcode, brand, name, measure } = product
    const globalProduct = { barcode, name, brand, measure }

    const globalResult = await barcodeProducts.updateOne(
        { barcode: barcode },
        {
            $set: globalProduct,
            $addToSet: { tenants: tenantId }
        },
        { upsert: true }
    );

    const tenantResult = await upsertBarcodeProduct(tenantId, product)
    return { globalResult, tenantResult }
}

async function getNewProducts() {
    await init()
    return barcodeProducts.find({}, { projection: { _id: 0 } }).toArray()
}

async function deleteFromNew(barcode: string) {
    await init()
    await barcodeProducts.deleteOne({ barcode: barcode })
}

async function setToReview(barcode: string, product: Partial<BarcodeProduct>) {
    await init()
    await barcodeProducts.updateOne({ barcode: barcode }, { $set: { ...product, toReview: true } })
}

export { addProductFromTenant, deleteFromNew, getNewProducts, setToReview };

