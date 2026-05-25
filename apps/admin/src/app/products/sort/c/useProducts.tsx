"use client";
import {
  getBarcodeProductsCount,
  getSortedBarcodeProducts,
  upsertBarcodeProduct,
} from "@/lib/products/barcode";
import { BaseBarcodeProduct } from "@fresku/model/products/barcode";
import { sortBarcodeProducts } from "@fresku/utils/products/barcode/sort";
import {
  queryOptions,
  useMutation,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { createContext, ReactNode, use, useState } from "react";

type ContextProps = {
  products: UseQueryResult<BaseBarcodeProduct[]>;
  pages: {
    current: number;
    set: (page: number) => void;
    count: number;
  };
};

const limit = 30;

const options = (page = 1) =>
  queryOptions({
    queryKey: ["products", page],
    queryFn: () => getSortedBarcodeProducts(page, limit),
  });

const ProductsContext = createContext<ContextProps | null>(null);
const ProductsContextProvider = ({ children }: { children: ReactNode }) => {
  const params = useSearchParams();
  const [page, setPage] = useState(Number(params.get("page")) || 1);
  const products = useQuery({ ...options(page) });

  const { data: productsCount } = useQuery({
    queryKey: ["productsCount"],
    queryFn: () => getBarcodeProductsCount(),
  });

  return (
    <ProductsContext.Provider
      value={{
        products,
        pages: {
          current: page,
          set: setPage,
          count: Math.ceil((productsCount || 0) / limit),
        },
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

const useProducts = () => {
  const productsContext = use(ProductsContext);

  if (!productsContext) {
    throw new Error(
      "useProducts must be used within a ProductsContextProvider"
    );
  }

  return productsContext;
};

const usePages = () => {
  const productsContext = use(ProductsContext);
  if (!productsContext) {
    throw new Error("usePages must be used within a ProductsContextProvider");
  }
  return productsContext.pages;
};

const useProductById = (barcode: string) => {
  const productsContext = use(ProductsContext);

  if (!productsContext) {
    throw new Error(
      "useProducById must be used within a ProductsContextProvider"
    );
  }

  const { pages, products } = productsContext;

  const { mutate } = useMutation({
    mutationKey: options(pages.current).queryKey,
    mutationFn: upsertBarcodeProduct,
    onMutate: async (newProduct, context) => {
      await context.client.cancelQueries({
        queryKey: options(pages.current).queryKey,
      });
      const prevProducts = context.client.getQueryData(
        options(pages.current).queryKey
      );

      context.client.setQueryData<BaseBarcodeProduct[]>(
        [options(pages.current).queryKey, newProduct.barcode],
        (old = []) =>
          sortBarcodeProducts(
            old.map((p) =>
              p.barcode === newProduct.barcode ? { ...p, newProduct } : p
            )
          )
      );

      return { prevProducts };
    },
    onError: (err, newTodo, onMutateResult, context) => {
      context.client.setQueryData(
        options(pages.current).queryKey,
        onMutateResult?.prevProducts
      );
    },
    // Always refetch after error or success:
    onSettled: (data, error, variables, onMutateResult, context) =>
      context.client.invalidateQueries({
        queryKey: options(pages.current).queryKey,
      }),
  });

  const updateProduct = (product: BaseBarcodeProduct) => {
    mutate(product);
  };

  const product = products.data?.find((p) => p.barcode === barcode);
  return { product, updateProduct };
};

export { ProductsContextProvider, usePages, useProductById, useProducts };

