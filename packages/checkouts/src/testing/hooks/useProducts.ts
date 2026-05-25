import { useBarcodeItems } from "@fresku/stores/cart/barcode";
import { useFruverItems } from "@fresku/stores/cart/fruver";

const useProducts = () => {
    const barcode = useBarcodeItems();
    const fruver = useFruverItems();
    return {
        barcode,
        fruver,
    }
}

export default useProducts