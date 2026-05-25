import LoadingProductCards from "@/components/loading/productCards";
import { getQueryClient } from "@/lib/useQuery/get-query-client";
import { barcodeQueryOptions } from "@/lib/useQuery/products/barcode";
import { categories, Category } from "@/utils/consts/barcode";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import ProductsList from "./_c/ProductsList";
import ProductsProvider from "./_c/useProducts";

const domi = ["testing", "la_argentina"];
export async function generateStaticParams() {
  const params: { category: string; domain: string }[] = [];
  const excludedCategories: Category[] = ["carnicos", "frutas_y_verduras"];

  for (const domain of domi) {
    for (const category of categories) {
      if (!excludedCategories.includes(category)) {
        params.push({ domain, category });
      }
    }
  }

  return params;
}

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ domain: string; category: Category }>;
}) => {
  const { domain, category } = await params;
  const queryClient = getQueryClient()


  await queryClient.prefetchInfiniteQuery(barcodeQueryOptions({ domain, filters: { category } }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsProvider config={{ category, domain }} >
        <Suspense fallback={<LoadingProductCards />}>
          <ProductsList />
        </Suspense>
      </ProductsProvider>
    </HydrationBoundary>
  );
};


export default CategoryPage;
