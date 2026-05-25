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
    const deliveryFee = 1500;
    const subtotal = barcodeSubtotal + fruverSubtotal;

    return {
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
    } as Resume;
}

export default useResume