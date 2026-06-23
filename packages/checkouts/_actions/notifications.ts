"use server"
import { getTenantDomersByDomain } from "@fresku/mongo/tenants/users";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";

let expo = new Expo();

async function sendPushTodomers(domain: string, title: string, body: string) {
    const result = await getTenantDomersByDomain(domain);

    if (!result) {
        throw new Error("No domers found for tenant");
    }

    const messages: ExpoPushMessage[] = result.domers
        .filter((domer: { token?: string; id: string }) => {
            if (!domer.token) {
                console.warn(`No token found for domer: ${domer.id}`);
                return false;
            }
            return true;
        })
        .map((domer: { token: string }) => ({ to: domer.token, title, body }));

    const tickets: ExpoPushTicket[] = [];
    for (const chunk of expo.chunkPushNotifications(messages)) {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
    }
    return tickets;
}

async function notifyNewOrder(domain: string, address: string, options: { title?: string, body?: string } = {}) {
    const { title = "Nueva orden", body = address } = options;
    return sendPushTodomers(domain, title, body);
}

async function notifyOrderCanceled(domain: string, orderId: string, by: "tenant" | "customer") {
    const body = by === "customer"
        ? `El cliente canceló la orden ${orderId}`
        : `Orden ${orderId} cancelada`;
    return sendPushTodomers(domain, "Orden cancelada", body);
}

async function notifyOrderReadyForPickup(domain: string, orderId: string) {
    return sendPushTodomers(domain, "Lista para recoger", `Orden ${orderId} lista para recoger`);
}

export { notifyNewOrder, notifyOrderCanceled, notifyOrderReadyForPickup };
