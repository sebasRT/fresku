import { FruverProduct } from '@fresku/model/products/fruver';
import { getLabelPrice } from '@fresku/utils/products/fruver/functions';
import { UNIT_TO_GRAMS } from '@fresku/utils/products/fruver/parsing';
import { MeasureUnit } from '@fresku/utils/products/fruver/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type FruverItem = FruverProduct & { quantity: number };

interface CartStore {
    items: FruverItem[];
    actions: {
        addToCart: (item: FruverItem) => void;
        removeUnitById: (itemId: string) => void;
        removeFromCart: (itemId: string) => void;
        clearCart: () => void;
        updateQuantity: (itemId: string, quantity: number) => void;
    };
}

const calculateItemPrice = (unit: MeasureUnit, quantity: number): number => {
    const conversion = UNIT_TO_GRAMS[unit];
    return conversion ? conversion * quantity : 0;
};

const useFruverCart = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            actions: {
                addToCart: (item: FruverItem) =>
                    set(state => {
                        const existing = state.items.find(i => i.name === item.name);

                        if (existing) {

                            if (existing.sellingFormat === 'weight') {
                                const newPrice = calculateItemPrice(item.unit, item.unitQuantity);

                                return {
                                    items: state.items.map(i =>
                                        i.name === item.name ? { ...i, unit: item.unit, unitQuantity: item.unitQuantity, price: newPrice } : i
                                    ),
                                };
                            }

                            return {
                                items: state.items.map(i =>
                                    i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
                                ),
                            };
                        }
                        return {
                            items: [...state.items, { ...item, quantity: 1 }],
                        };
                    }),

                removeUnitById: (itemId: string) =>
                    set((state) => ({
                        items: state.items
                            .map((i) =>
                                i.sku === itemId ? { ...i, quantity: i.quantity - 1 } : i
                            )
                            .filter((i) => i.quantity > 0),
                    })),

                removeFromCart: (itemId: string) =>
                    set((state) => ({
                        items: state.items.filter((i) => i.sku !== itemId),
                    })),

                clearCart: () => set({ items: [] }),

                updateQuantity: (itemId: string, quantity: number) =>
                    set((state) => ({
                        items: state.items.map((i) =>
                            i.sku === itemId ? { ...i, quantity } : i
                        ),
                    })),
            },
        }),
        {
            name: 'fruver-cart-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ items: state.items }),
        }
    )
);

// Hooks for consuming state
const useFruverCartActions = () => useFruverCart((state) => state.actions);
const useFruverItems = () => useFruverCart((state) => state.items);
const useFruverItemById = (sku: string) =>
    useFruverCart((state) => state.items.find((item) => item.sku === sku) || null);
const useFruverItemQuantity = (sku: string) =>
    useFruverCart((state) => state.items.find((item) => item.sku === sku)?.quantity ?? 0);
const useFruverCount = () =>
    useFruverCart((state) =>
        state.items.reduce((count, item) => count + item.quantity, 0)
    );
const useFruverSubtotal = () =>
    useFruverCart((state) =>
        state.items.reduce(
            (total, item) => total + (getLabelPrice(item) * item.quantity || 0),
            0
        )
    );

export {
    useFruverCart, useFruverCartActions, useFruverCount,
    useFruverItemById,
    useFruverItemQuantity, useFruverItems, useFruverSubtotal, type FruverItem
};

