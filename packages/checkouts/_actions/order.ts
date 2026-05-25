"use server";
import { Order, orderSchema } from "@fresku/model/order";
import clientPromise from "@fresku/mongo/index";
import { getTenantDB } from "@fresku/redis/tenants";
import { generateOrderId, unixIdFromOrderId } from "@fresku/utils/order/parsing";
import { getOrCreateSessionId } from "@fresku/utils/users/id";
import { notifyNewOrder } from "./notifications";

const NODE_ENV = process.env.NODE_ENV;

async function createNewOrder(order: Omit<Order, "createdAt" | "orderId" | "sessionId">, domain: string) {
    const database = NODE_ENV === "production" ? await getTenantDB(domain, false) : "t_testing";
    const resolvedClient = await clientPromise;
    const orders = resolvedClient.db(database).collection<Order>("orders");

    const sessionId = await getOrCreateSessionId();
    const orderId = generateOrderId(sessionId);
    const filledOrder = { ...order, orderId, createdAt: new Date(), sessionId } as Order;

    try {
        const parsedOrder = await orderSchema.parseAsync(filledOrder);
        const result = await orders.insertOne(parsedOrder);
        if (result.acknowledged) {
            await notifyNewOrder(domain, order.address.label);
            return unixIdFromOrderId(orderId);
        } else {
            throw new Error("Failed to create order");
        }
    } catch (error: any) {
        throw new Error(error);
    }
}

export { createNewOrder };
