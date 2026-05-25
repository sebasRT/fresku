import { measureConversionsToGrams, MeasureUnit } from '@/utils/consts/fruver';
import { getLabelPrice } from '@/utils/functions/fruver';
import { FruverProduct } from '@fresku/model/products/fruver';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CartItem = FruverProduct & { quantity: number };

interface CartStore {
    items: CartItem[];
    actions: {
        addToCart: (item: CartItem) => void;
        removeUnitById: (itemId: string) => void;
        removeFromCart: (itemId: string) => void;
        clearCart: () => void;
        updateQuantity: (itemId: string, quantity: number) => void;
    };
}

const calculateItemPrice = (unit: MeasureUnit, quantity: number): number => {
    const conversion = measureConversionsToGrams[unit];
    return conversion ? conversion * quantity : 0;
};

const useFruverCart = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            actions: {
                addToCart: (item: CartItem) =>
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
const useCartActions = () => useFruverCart((state) => state.actions);
const useCartItems = () => useFruverCart((state) => state.items);
const useCartItemById = (sku: string) =>
    useFruverCart((state) => state.items.find((item) => item.sku === sku) || null);
const useCartItemQuantity = (sku: string) =>
    useFruverCart((state) => state.items.find((item) => item.sku === sku)?.quantity ?? 0);
const useCartCount = () =>
    useFruverCart((state) =>
        state.items.reduce((count, item) => count + item.quantity, 0)
    );
const useCartSubtotal = () =>
    useFruverCart((state) =>
        state.items.reduce(
            (total, item) => total + (getLabelPrice(item) * item.quantity || 0),
            0
        )
    );

export {
    useCartActions,
    useCartCount,
    useCartItemById,
    useCartItemQuantity,
    useCartItems,
    useCartSubtotal,
    useFruverCart
};

