"use client"
import { useBarcodeSubtotal } from "@fresku/stores/cart/barcode";
import { useFruverSubtotal } from "@fresku/stores/cart/fruver";
import { create } from "zustand";
import { deliveryFees, Unit } from "../utils/consts";

export type Resume = {
    subtotal: number;
    deliveryFee: number;
    total: number;
    unit: Unit | null;
};

type ResumeHook = Resume & {
    setUnit: (unit: Unit) => void;
};

type ResumeStore = {
    deliveryFee: number;
    unit: Unit | null;
    setUnit: (unit: Unit) => void;
};

export const useResumeStore = create<ResumeStore>((set) => ({
    deliveryFee: 0,
    unit: null,
    setUnit: (unit: Unit) => set(() => {
        const deliveryFee = deliveryFees[unit];
        return {
            unit,
            deliveryFee,
        };
    }),
}));

const useResume = () => {
    const { setUnit, deliveryFee, } = useResumeStore();
    const barcodeSubtotal = useBarcodeSubtotal();
    const fruverSubtotal = useFruverSubtotal();
    const subtotal = barcodeSubtotal + fruverSubtotal;

    return {
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        setUnit,
    } as ResumeHook;
}

export default useResume