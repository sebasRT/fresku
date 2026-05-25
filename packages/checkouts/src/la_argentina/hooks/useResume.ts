"use client"
import { useBarcodeSubtotal } from "@fresku/stores/cart/barcode";
import { useFruverSubtotal } from "@fresku/stores/cart/fruver";

export type Resume = {
    subtotal: number;
    deliveryFee: number;
    total: number;
};

const useResume = () => {
    const deliveryFee = 0;
    const barcodeSubtotal = useBarcodeSubtotal();
    const fruverSubtotal = useFruverSubtotal();
    const subtotal = barcodeSubtotal + fruverSubtotal;

    return {
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
    } as Resume;
}

export default useResume