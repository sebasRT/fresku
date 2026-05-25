import { Order } from "@fresku/model/order";
import { BarcodeItem } from "@fresku/stores/cart/barcode";
import { FruverItem } from "@fresku/stores/cart/fruver";
import { parseBarcodeItemsToOrder, parseFruverItemsToOrder } from "@fresku/utils/order/parsing";
import { createNewOrder } from "../../../_actions/order";
import { setDefaultValues } from "../../../_utils";
import { Resume } from "../hooks/useResume";
import { ClientInfo } from "./resolver";

async function createOrder(clientInfo: Omit<ClientInfo, "sessionId">, products: {
    fruver: FruverItem[], barcode: BarcodeItem[]
}, resume: Resume, domain: string) {

    setDefaultValues(clientInfo)
    const { fruver, barcode } = products
    const { address, name, phone } = clientInfo

    const order: Omit<Order, "createdAt" | "orderId" | "sessionId"> = {
        address,
        contact: { name, phone },
        products: {
            barcode: parseBarcodeItemsToOrder(barcode),
            fruver: parseFruverItemsToOrder(fruver)
        },
        status: "pending",
        ...resume
    }

    try {
        const orderId = await createNewOrder(order, domain);
        return orderId
    } catch (error) {
        console.error("Error creating order", error);
        throw new Error("Failed to create order");
    }
}

export { createOrder };

