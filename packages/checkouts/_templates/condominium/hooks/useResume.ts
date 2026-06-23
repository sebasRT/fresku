"use client"
import { useBarcodeSubtotal } from "@fresku/stores/cart/barcode";
import { useFruverSubtotal } from "@fresku/stores/cart/fruver";
import { create } from "zustand";
import { Unit } from "../utils/consts";

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
    zones: Record<string, number>;
    deliveryFee: number;
    unit: Unit | null;
    setZones: (zones: Record<string, number>) => void;
    setUnit: (unit: Unit) => void;
};

export const useResumeStore = create<ResumeStore>((set, get) => ({
    zones: {},
    deliveryFee: 0,
    unit: null,
    setZones: (zones) => set({ zones }),
    setUnit: (unit: Unit) => set({
        unit,
        deliveryFee: get().zones[unit] ?? 0,
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
