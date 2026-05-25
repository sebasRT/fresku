import { barcodeAiSearch, fruverAiSearch } from '@/lib/mongo/products/ai';
import { openai } from '@ai-sdk/openai';
import { barcodeSchema } from '@fresku/model/products/barcode';
import { reglasSearchString } from '@fresku/utils/products/barcode/ai';
import { InvalidToolArgumentsError, NoSuchToolError, streamText, tool, ToolExecutionError } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const { messages, domain } = await req.json();

        const result = streamText({
            model: openai('gpt-4.1-nano'),
            system: systemPromp,
            messages,
            tools: {
                buscarProductos: tool({
                    description: 'Busca 1 o varios productos por su nombre y otras caracteristicas como la medida o la marca. Los resultados son mostrados en la UI. ',
                    parameters: z.object({ query: searchBarcodeQuerySchema }),
                    execute: async ({ query }) => {
                        console.log("the query is", query);
                        try {
                            const result = await barcodeAiSearch(query, domain, systemPromp);
                            return { query, products: result.products ?? [] }
                        } catch (error) {
                            return { products: [] }
                        }
                    },
                }),
                buscarProductoFruver: tool({
                    description: 'Busca productos en la tienda Fruver. Los resultados son mostrados en la UI. ',
                    parameters: z.object({ query: z.string().describe('Query para busqueda de productos de fruver (frutas, verduras, etc)') }),
                    execute: async ({ query }) => {
                        console.log(query);
                        try {
                            const barcode = await barcodeAiSearch(query, domain, "esta es una busqueda de productos de fruver (frutas, verduras, etc). Devuelve un array vacío si no hay resultados de productos agricolas.");
                            const fruver = await fruverAiSearch(query, domain, systemPromp);

                            return { query, barcode: barcode ?? [], fruver: fruver ?? [] }

                        } catch (error) {
                            return { barcode: [], fruver: [] }
                        }
                    }
                })
            }
        });

        return result.toDataStreamResponse({
            getErrorMessage: error => {
                if (NoSuchToolError.isInstance(error)) {
                    console.error(error);

                    return 'The model tried to call a unknown tool.';
                } else if (InvalidToolArgumentsError.isInstance(error)) {
                    console.error(error);
                    return 'The model called a tool with invalid arguments.';
                } else if (ToolExecutionError.isInstance(error)) {
                    console.error(error);
                    return 'An error occurred during tool execution.';
                } else {
                    console.error(error);
                    return 'An unknown error occurred.';
                }
            },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error?.message || 'Error interno del servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

const systemPromp = `Eres un asistente que ayuda a buscar productos de mercado. Los resultados de las busquedas son mostrados en la UI.`
    + ' Se corto y conciso en tus respuestas con naturalidad y calidez.'
    + ' Aqui tienes algunas marcas locales: "Sonsoneña", "Margarita", "Colanta", "Alquería", "Postobón", "Bavaria", "Coca Cola", "Bary" '
    + ' Usa las herramientas de busqueda de productos.'
    + ' Si te piden añadir productos, indica que usen el boton azul que se muestra en el producto. Busca el producto antes de indicarlo.';
const searchBarcodeQuerySchema = z.string().describe('Query para busqueda de productos por código de barras con estas reglas' + reglasSearchString);

export type SearchResult = { message?: string, products: z.infer<typeof barcodeSchema>[], query: string };