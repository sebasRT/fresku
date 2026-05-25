import { openai } from '@ai-sdk/openai';
import { baseProductSchema } from '@fresku/model/products/barcode';
import { reglasDeMedidaProductos, reglasMarcaDelProducto, reglasNombresProductos, reglasSearchString } from '@fresku/utils/products/barcode/ai';
import { generateObject } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { prompt, categorization }: { prompt: string, categorization: boolean } = await req.json();
    if (!categorization) {
        try {
            const { object } = await generateObject({
                model: openai('gpt-4.1-mini-2025-04-14'),
                system: systemPrompt,
                schema: baseProductSchema.partial(),
                prompt: JSON.stringify(prompt),
            });

            return Response.json(object, { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (error) {
            console.error("Error generando producto:", error);
            return new Response("Error al generar producto", { status: 500 });
        }
    }

    try {
        const { object } = await generateObject({
            model: openai('gpt-4.1-mini-2025-04-14'),
            system: systemPromptCategorization,
            schema: baseProductSchema.pick({ subcategory: true, category: true }),
            prompt: JSON.stringify(prompt),
        });

        return Response.json(object, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error generando producto:", error);
        return new Response("Error al generar producto", { status: 500 });
    }


}


const systemPrompt = `
Eres un asistente que organiza y formatea productos de groceries. 
Debes retornar el producto en JSON siguiendo el esquema proporcionado.

=== Reglas para formato de unidades ===
${JSON.stringify(reglasDeMedidaProductos, null, 2)}

=== Reglas para formato de nombres de producto ===
${JSON.stringify(reglasNombresProductos, null, 2)}

=== Reglas para formato de searchString ===
${JSON.stringify(reglasSearchString, null, 2)}
Asegúrate de que el nombre del producto sea claro y descriptivo,

=== Reglas para formato de marca del producto ===
${JSON.stringify(reglasMarcaDelProducto, null, 2)}
`;

const systemPromptCategorization = `
Eres un asistente que organiza y formatea productos de groceries.
Debes retornar la categorizacion en JSON siguiendo el esquema proporcionado.
`
