"use client"
import { useBarcodeSubtotal } from "@fresku/stores/cart/barcode";
import { useFruverSubtotal } from "@fresku/stores/cart/fruver";

export type Resume = {
    subtotal: number;
    deliveryFee: number;
    total: number;
};

const useResume = () => {
    const barcodeSubtotal = useBarcodeSubtotal();
    const fruverSubtotal = useFruverSubtotal();
    const subtotal = barcodeSubtotal + fruverSubtotal;
    const deliveryFee = 0;

    return {
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
    } as Resume;
}

export default useResume
