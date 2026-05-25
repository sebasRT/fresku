'use server'
import { BarcodeProduct, barcodeSchema, BaseBarcodeProduct, baseProductSchema } from "@fresku/model/products/barcode";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { openai } from "../openai";

async function filterBestMatch(query: string, results: BaseBarcodeProduct[] | BarcodeProduct[], tenantAiSearch: boolean = false, context?: string) {

    const schema = tenantAiSearch ? barcodeSchema.omit({ _id: true, tags: true, cost: true, show: true, stock: true, stockStatus: true , category: true}) : baseProductSchema.omit({
        _id: true,
        tags: true,
        category: true
    })

    try {
        const response = await openai.responses.parse({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "system",
                    content: context + `Regresa los productos que MEJOR cumplan con la consulta "${query}" trata de filtrar a la menor cantidad posible. FILTRA MUY BIEN PRODUCTO DE FRUTAS Y VERDURAS.`,
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
    
        return response.output_parsed as { products: z.infer<typeof schema>[], query: string, };

    } catch (error) {
        console.error(error);
        return { message: "Error al filtrar los resultados", products: [], query: query };
    }

}


export { filterBestMatch };

