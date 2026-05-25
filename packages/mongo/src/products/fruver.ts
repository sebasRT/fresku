import { BaseFruverProduct, FruverProduct } from "@fresku/model/products/fruver";
import { Collection, Db, MongoClient } from "mongodb";
import clientPromise from "..";

let client: MongoClient;
let db: Db;
let fruverProducts: Collection<BaseFruverProduct>;

async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = client.db("Products")
        fruverProducts = db.collection('p_fruver')
    } catch (error) {
        throw new Error('Failed to stablish connection to database')
    }
}

async function queryFruver(query: string, score: number = 2) {
    await init();
    try {
        if (query.length < 3) return []
        const result = await fruverProducts.aggregate([
            {
                $search: {
                    index: "p_fruver",
                    autocomplete: {
                        query,
                        path: "name",
                        fuzzy: {
                            maxEdits: 1,
                            prefixLength: 2
                        }
                    }
                },
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
                    description: 0,
                }
            },
            { $limit: 30 }
        ]).toArray();

        result.forEach(p => console.log(p.score))
        return result.filter(p => p.score > score) as FruverProduct[]

    } catch (error) {
        console.log('Error in queryBarcodes', error)
        return []
    }
}

export { queryFruver };

