"use client";

import { useBarcodeCart } from "@fresku/stores/cart/barcode";
import { useFruverCart } from "@fresku/stores/cart/fruver";

const useProducts = () => {
    const barcodeStore = useBarcodeCart();
    const fruverStore = useFruverCart();

    const barcode = barcodeStore.items;
    const fruver = fruverStore.items;

    const clear = () => {
        barcodeStore.actions.clearCart();
        fruverStore.actions.clearCart();
    };

    return {
        barcode,
        fruver,
        clear
    };
};

export default useProducts