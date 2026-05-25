import { Order } from "@fresku/model/order";
import { BarcodeItem } from "@fresku/stores/cart/barcode";
import { FruverItem } from "@fresku/stores/cart/fruver";
import { firstToUppercase } from "@fresku/utils/functions/strings";
import { parseBarcodeItemsToOrder, parseFruverItemsToOrder } from "@fresku/utils/order/parsing";
import { createNewOrder } from "../../../_actions/order";
import { setDefaultValues } from "../../../_utils";
import { Checkout } from "../components/checkoutResolver";
import { Resume } from "../hooks/useResume";

async function createOrder(products: {
    fruver: FruverItem[], barcode: BarcodeItem[]
}, clientInfo: Checkout, resume: Resume, domain: string) {

    setDefaultValues(clientInfo)
    const { apto, building, unit, name, phone } = clientInfo
    const { fruver, barcode } = products

    const label = `${firstToUppercase(unit)} T ${building}  Apto ${apto}`

    const order: Omit<Order, "createdAt" | "orderId" | "sessionId"> = {
        address: {
            label
        },
        products: {
            barcode: parseBarcodeItemsToOrder(barcode),
            fruver: parseFruverItemsToOrder(fruver)
        },
        status: "pending",
        contact: {
            name,
            phone
        },
        ...resume
    }

    try {
        const orderId = await createNewOrder(order, domain)
        return orderId
    } catch (error) {
        console.error("Error creating order", error);
        throw new Error("Failed to create order");
    }
}

export { createOrder };

