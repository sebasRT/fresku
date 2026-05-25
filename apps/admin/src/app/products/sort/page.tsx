"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import List from "./c/List";
import Pagination from "./c/Pagination";
import { ProductsContextProvider } from "./c/useProducts";

const queryClient = new QueryClient();
const page = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsContextProvider>
        <Pagination />
        <List />
        <Pagination />
      </ProductsContextProvider>
    </QueryClientProvider>
  );
};

export default page;
