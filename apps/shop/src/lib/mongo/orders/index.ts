import { Order } from "@fresku/model/order";
import clientPromise from "@fresku/mongo/index";
import { getTenantDB } from "@fresku/redis/tenants";
import { generateOrderId, unixIdFromOrderId } from "@fresku/utils/order/parsing";
import { getNowInUTC } from "@fresku/utils/time/index";
import { Collection, Db, MongoClient } from "mongodb";
import { cookies } from "next/headers";

let client: MongoClient;
let db: Db;
let orders: Collection<Order>; // Replace with actual user schema

async function init(domain: string) {
    if (db) return
    const database = await getTenantDB(domain)

    try {
        client = await clientPromise
        db = client.db(database)
        orders = db.collection('orders')
    } catch (error: any) {
        throw new Error(error)
    }
}

async function getClientRecentOrders(domain: string, sessionId: string, limit: number = 10,) {
    await init(domain);

    const recentOrders = await orders
        .find({ sessionId }, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

    return recentOrders.map(order => ({ ...order, orderId: unixIdFromOrderId(order.orderId) }));
}

async function getClientTodaysOrders(domain: string, sessionId: string,) {
    await init(domain);
    const yesterday = getNowInUTC().minus({ days: 1 }).toBSON();
    const recentOrders = await orders
        .find({ sessionId, createdAt: { $gte: yesterday } }, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
    return recentOrders.map(order => ({ ...order, orderId: unixIdFromOrderId(order.orderId) }));
}

async function getClientRecentProducts(domain: string, sessionId: string, limit: number = 10) {

    await init(domain);
    const recentProducts = await orders
        .find({ sessionId }, { projection: { _id: 0, products: 1 } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

    const barcode = recentProducts
        .filter(order => order.products && order.products.barcode)
        .map(order => order.products.barcode || [])
        .flat();

    const fruver = recentProducts
        .filter(order => order.products && order.products.fruver)
        .map(order => order.products.fruver || [])
        .flat();

    return { barcode, fruver };
}

async function getOrderById(domain: string, orderId: string) {
    await init(domain)
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value || ""

    const order = await orders.findOne({ orderId: generateOrderId(sessionId, orderId) }, { projection: { _id: 0 } });
    return order
}

export { getClientRecentOrders, getClientRecentProducts, getClientTodaysOrders, getOrderById };

