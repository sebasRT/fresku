import { getCountByFilterOptions, getProductsByFilterOptions } from "@/lib/mongo/products/barcode";
import { FilterProps } from "@fresku/utils/products/barcode/types";
import { infiniteQueryOptions } from "@tanstack/react-query";

const limit = 25;

export const barcodeQueryOptions = (config: { domain: string, filters: FilterProps }) => {
    const { domain, filters } = config

    return infiniteQueryOptions({
        queryKey: [domain, "products", "barcode", { ...filters }],
        queryFn: async ({ pageParam = 1 }) => {
            const count = await getCountByFilterOptions(domain, filters);
            const newProducts = await getProductsByFilterOptions(domain, filters, { skip: (pageParam - 1) * limit, limit });
            return { products: newProducts, nextPage: pageParam * limit < count ? pageParam + 1 : null };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage ?? null,
    })
}