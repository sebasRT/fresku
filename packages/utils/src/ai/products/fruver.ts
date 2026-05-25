'use server'
import { BaseFruverProduct, baseFruverSchema, FruverProduct, fruverSchema, } from "@fresku/model/products/fruver";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { openai } from "../openai";
async function filterBestMatch(query: string, results: BaseFruverProduct[] | FruverProduct[], tenantAiSearch: boolean = false, context?: string) {

    const schema = tenantAiSearch ? fruverSchema.omit({ _id: true, tags: true, cost: true, show: true, stock: true, stockStatus: true }) : baseFruverSchema.omit({
        _id: true,
        tags: true,
    })

    try {
        const response = await openai?.responses.parse({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "system",
                    content: `Regresa los productos que MEJOR cumplan con la consulta "${query}" trata de filtrar a la menor cantidad posible. Si no hay resultados, o los resultados no se acercan lo suficiente regresa un array vacío. `,
                }, {
                    role: "user",
                    content: JSON.stringify({ results })
                }
            ],
            text: {
                format: zodTextFormat(z.object({
                    products: z.array(schema).describe("Array de productos que cumplen con la consulta. Cada producto debe tener al menos los campos 'barcode', 'name', 'measure' y 'brand'."),
                    query: z.string().describe("Producto a buscar"),
                }), "product_search_results"),
            }
        })

        return response?.output_parsed as { products: z.infer<typeof schema>[], query: string, };

    } catch (error) {
        console.error(error);
        return { message: "Error al filtrar los resultados", products: [], query: query };
    }

}


export { filterBestMatch };

