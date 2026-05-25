import { Order } from "@fresku/model/order";
import { BarcodeItem } from "@fresku/stores/cart/barcode";
import { FruverItem } from "@fresku/stores/cart/fruver";
import { parseBarcodeItemsToOrder, parseFruverItemsToOrder } from "@fresku/utils/order/parsing";
import { createNewOrder } from "../../../_actions/order";
import { Resume } from "../hooks/useResume";
import { ClientInfo } from "./resolver";

async function createOrder(products: {
    fruver: FruverItem[], barcode: BarcodeItem[]
}, clientInfo: ClientInfo, resume: Resume, domain: string) {

    const { fruver, barcode } = products
    const { address, name, phone } = clientInfo

    const order: Omit<Order, 'createdAt'> = {
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
        await createNewOrder(order, domain)
    } catch (error) {
        console.error("Error creating order", error);
        throw new Error("Failed to create order");
    }
}

export { createOrder };

