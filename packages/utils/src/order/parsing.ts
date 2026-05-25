import { OrderBarcode, orderBarcodeSchema, OrderFruver, orderFruverSchema } from "@fresku/model/order";
import { BarcodeProduct } from "@fresku/model/products/barcode";
import { FruverProduct } from "@fresku/model/products/fruver";
import { getFruverLabels } from "../products/fruver/functions";
import { getNowInUTC } from "../time";


//-------------BARCODE PRODUCTS------------------//
const parseBarcodeItemToOrder = (product: BarcodeProduct): OrderBarcode | null => {
    const parsed = orderBarcodeSchema.safeParse(product);
    if (!parsed.success) {
        console.error("Error parsing barcode product", parsed.error);
        return null;
    }
    return parsed.data;
}

const parseBarcodeItemsToOrder = (products: BarcodeProduct[]): OrderBarcode[] => {
    return products.map(parseBarcodeItemToOrder).filter(Boolean) as OrderBarcode[];
};

//-------------FRUVER PRODUCTS------------------//
const parseFruverItemToOrder = (product: FruverProduct): OrderFruver | null => {
    const { measure: labelMeasure, price: labelPrice } = getFruverLabels(product)

    const parsed = orderFruverSchema.safeParse({ ...product, labelMeasure, labelPrice });

    if (!parsed.success) {
        console.error("Error parsing fruver product", parsed.error);
        return null;
    }
    return parsed.data;
};

const parseFruverItemsToOrder = (products: FruverProduct[]): OrderFruver[] => {
    return products.map(parseFruverItemToOrder).filter(Boolean) as OrderFruver[];
};
//-------------ORDER ID-----------------------//
const generateOrderId = (sessionId: string, unixInteger?: string | number) => {

    if (!unixInteger) {
        const now = getNowInUTC();
        const orderId = `ORD-${now.toUnixInteger()}-${sessionId}`
        return orderId;
    }

    const orderId = `ORD-${unixInteger}-${sessionId}`
    return orderId;
}

const unixIdFromOrderId = (orderId: string) => {
    const [_, unixInteger] = orderId.split('-');
    return unixInteger;
}

export { generateOrderId, parseBarcodeItemsToOrder, parseFruverItemsToOrder, unixIdFromOrderId };
export type { OrderBarcode, OrderFruver };

