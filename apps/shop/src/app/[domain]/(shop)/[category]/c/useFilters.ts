"use client"
import { FilterProps } from "@fresku/utils/products/barcode/types";
import { create } from "zustand";

interface FilterStore {
    filters: FilterProps;
    setFilter: (key: keyof FilterProps, value: any) => void;
    resetFilters: () => void;
}

export const useFilters = create<FilterStore>((set) => ({
    filters: {},
    setFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value }
        })),
    resetFilters: () => set({ filters: {} })
}));