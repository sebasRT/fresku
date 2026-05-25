import { BarcodeProduct, barcodeSchema, CartItem } from '@fresku/model/products/barcode';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CartStore {
    items: CartItem[];
    open: boolean;
    actions: {
        addToCart: (item: BarcodeProduct, quantity: number) => string;
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
                addToCart: (item: BarcodeProduct, quantity: number = 1) => {
                    const safe = barcodeSchema.safeParse(item)
                    if (safe.success) {
                        set(state => {
                            const existing = state.items.find(i => i.barcode === item.barcode);

                            if (existing) {
                                return {
                                    items: state.items.map(i =>
                                        i.barcode === item.barcode ? { ...i, quantity: i.quantity + quantity } : i
                                    ),
                                };
                            }
                            return {
                                items: [...state.items, { ...item, quantity }],
                            };
                        })
                        return "Producto añadido correctamente."
                    } else {
                        return "No se pudo añadir el producto. Intenta usando el boton azul (+). ";
                    }
                },
                removeUnitByBarcode: (itemId: string) =>
                    set(state => ({
                        items: state.items
                            .map(i =>
                                i.barcode === itemId ? { ...i, quantity: i.quantity - 1 } : i
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

const useCartActions = () => useBarcodeCart(state => state.actions);
const useCartItems = () => useBarcodeCart(state => state.items);
const useCartItemById = (barcode: string) =>
    useBarcodeCart(state => state.items.find(item => item.barcode === barcode) || null);
const useCartItemQuantity = (barcode: string) =>
    useBarcodeCart(state => state.items.find(item => item.barcode === barcode)?.quantity ?? 0);
const useCartCount = () => useBarcodeCart(state => state.items.reduce((count, item) => count + item.quantity, 0));
const useCartOpen = () => useBarcodeCart(state => state.open);
const useCartSubtotal = () =>
    useBarcodeCart(state =>
        state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    );
export {
    useBarcodeCart,
    useCartActions, useCartCount, useCartItemById,
    useCartItemQuantity, useCartItems, useCartOpen,
    useCartSubtotal
};

