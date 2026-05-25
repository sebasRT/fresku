import { BarcodeProduct } from '@fresku/model/products/barcode';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type BarcodeItem = BarcodeProduct & { quantity: number };

interface CartStore {
    items: BarcodeItem[];
    open: boolean;
    actions: {
        addToCart: (item: BarcodeProduct) => void;
        removeFromCart: (itemId: string) => void;
        removeUnitByBarcode: (itemId: string) => void;
        clearCart: () => void;
        toggle: (open?: boolean) => void;
    };
}

const useBarcodeCart = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            open: false,
            actions: {
                addToCart: (item: BarcodeProduct, quantity: number = 1) =>
                    set(state => {
                        if (quantity <= 0) {
                            return state; // No change if quantity is zero or negative
                        }
                        const existing = state.items.find(i => i.barcode === item.barcode);

                        if (existing) {
                            return {
                                items: state.items.map(i =>
                                    i.barcode === item.barcode ? { ...i, quantity: i.quantity + quantity } : i
                                ),
                            };
                        }
                        return {
                            items: [...state.items, { ...item, quantity: 1 }],
                        };
                    }),
                removeUnitByBarcode: (itemId: string, quantity: number = 1) =>
                    set(state => ({
                        items: state.items
                            .map(i =>
                                i.barcode === itemId ? { ...i, quantity: i.quantity - quantity } : i
                            )
                            .filter(i => i.quantity > 0),
                    })),

                removeFromCart: (itemId: string) =>
                    set(state => ({
                        items: state.items.filter(i => i.barcode !== itemId),
                    })),

                clearCart: () => set({ items: [] }),

                toggle: (open?: boolean) =>
                    set(state => ({
                        open: open ?? !state.open,
                    })),
            },
        }),
        {
            name: 'barcode-cart-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                items: state.items,
            }),
        }
    )
);

const useBarcodeCartActions = () => useBarcodeCart(state => state.actions);
const useBarcodeItems = () => useBarcodeCart(state => state.items);
const useBarcodeItemsById = (barcode: string) =>
    useBarcodeCart(state => state.items.find(item => item.barcode === barcode) || null);
const useBarcodeItemQuantity = (barcode: string) =>
    useBarcodeCart(state => state.items.find(item => item.barcode === barcode)?.quantity ?? 0);
const useBarcodeCount = () => useBarcodeCart(state => state.items.reduce((count, item) => count + item.quantity, 0));
const useCartOpen = () => useBarcodeCart(state => state.open);
const useBarcodeSubtotal = () =>
    useBarcodeCart(state =>
        state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    );

export {
    useBarcodeCart,
    useBarcodeCartActions, useBarcodeCount, useBarcodeItemQuantity, useBarcodeItems, useBarcodeItemsById, useBarcodeSubtotal, useCartOpen, type BarcodeItem
};


