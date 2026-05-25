"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import List from "./_c/List";
import Pagination from "./_c/Pagination";
import { ProductsContextProvider } from "./_c/useProducts";

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
