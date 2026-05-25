"use server"
import { Order, orderSchema, rangeSchema } from "@fresku/model/order";
import { getNowInUTC, parseToUTC } from "@fresku/utils/time/index";
import { Collection, Db, MongoClient } from "mongodb";
import z from "zod";
import clientPromise from "..";
let client: MongoClient;

async function init(tenantId: string) {
    let db: Db;
    let orders: Collection<Order>;

    try {
        client = await clientPromise
        db = client.db(tenantId)
        orders = db.collection('orders')
        return { db, orders }

    } catch (error: any) {
        throw new Error('Failed to stablish connection to database>' + error.message,)
    }
}

async function createNewOrder(tenantId: string, order: Omit<Order, "createdAt" | "orderId">) {
    const { orders } = await init(tenantId);

    const now = getNowInUTC()
    const createdAt = now.toJSDate()

    const orderId = `ORD-${now.toISODate()}-${order.sessionId}-${now.toUnixInteger()}`
    const filledOrder = { ...order, createdAt, orderId } as Order

    try {
        const parsedOrder = await orderSchema.parseAsync(filledOrder)
        const result = await orders.insertOne(parsedOrder)
        return result.acknowledged
    } catch (error: any) {
        throw new Error('Failed to create order>' + error.message,)
    }
}


type Range = z.infer<typeof rangeSchema>
async function getOrders(tenantId: string, range: Range) {
    const { orders } = await init(tenantId)

    const from = parseToUTC(range.from, range.tz).toJSDate()
    const to = parseToUTC(range.to, range.tz).toJSDate()

    const result = orders.find({ createdAt: { $gte: from, $lte: to } }, { projection: { _id: 0 } }).toArray()
    return result
}

async function updateOrder(tenantId: string, order: Partial<Order>, userId: string) {
    const { orders } = await init(tenantId);
    const updatedAt = getNowInUTC().toJSDate();

    try {
        const result = await orders.findOneAndUpdate(
            { orderId: order.orderId },
            { $set: { ...order, updatedAt, updatedBy: userId } },
            { returnDocument: 'after', projection: { _id: 0 } }
        );

        if (!result) {
            throw new Error(`Order with ID ${order.orderId} not found`);
        }

        return result;
    } catch (error: any) {
        throw new Error('Failed to update order > ' + error.message);
    }
}


export { createNewOrder, getOrders, updateOrder };

