"use server"
import { getTenantDomersByDomain } from "@fresku/mongo/tenants/users";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";

let expo = new Expo();

async function notifyNewOrder(domain: string, address: string, options: { title?: string, body?: string } = {}) {
    const result = await getTenantDomersByDomain(domain);

    if (!result) {
        throw new Error("No domers found for tenant");
    }
    const domers = result.domers;
    let messages: ExpoPushMessage[] = [];

    const { title = "Nueva orden", body = address } = options;

    for (const domer of domers) {
        const { token } = domer;

        if (!token) {
            console.warn(`No token found for domer: ${domer.id}`);
            continue;
        }
        messages.push({
            to: token,
            title,
            body
        })

    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets: ExpoPushTicket[] = [];
    (async () => {
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);

            } catch (error) {
                console.error(error);
            }
        }
    })();


}

export { notifyNewOrder };

