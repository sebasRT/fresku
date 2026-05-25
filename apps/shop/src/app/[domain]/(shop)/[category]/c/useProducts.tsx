"use client";
import { barcodeQueryOptions } from "@/lib/useQuery/products/barcode";
import { BarcodeProduct } from "@fresku/model/products/barcode";
import { Category } from "@fresku/utils/products/barcode/consts";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  use
} from "react";
import { useFilters } from "./useFilters";

type ProviderProps = { config: { category: Category; domain: string; } };
const productsContext = createContext<ProviderProps | null>(null);

export function ProductsProvider({
  children,
  config
}: PropsWithChildren<ProviderProps>) {

  return (
    <productsContext.Provider value={{ config }}>
      {children}
    </productsContext.Provider>
  );
}

export function useProducts() {
  const context = use(productsContext);
  const { filters } = useFilters()

  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  const { config } = context;
  const { domain, category } = config;
  const { data, isLoading, error, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery(barcodeQueryOptions({ domain, filters: { ...filters, category } }));

  return {
    isLoading,
    error,
    products: data?.pages.flatMap((page: any) => page.products) as BarcodeProduct[],
    hasNextPage,
    fetchNextPage
  };
}

export default ProductsProvider;
