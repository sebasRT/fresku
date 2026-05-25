import { openai } from '@ai-sdk/openai';
import { baseProductSchema } from "@fresku/model/products/barcode";
import { generateObject } from 'ai';
import { ZodRawShape } from "zod";
import { reglasDeMedidaProductos, reglasMarcaDelProducto, reglasNombresProductos, reglasSearchString } from "../_rules/products/barcode";

export async function getProductBody(query: string, extend?: ZodRawShape) {

    const schema = extend ? baseProductSchema.partial().extend(extend).omit({ _id: true, barcode: true, image: true })
        : baseProductSchema.partial().omit({ _id: true, barcode: true, image: true });
        
    try {
        const { object } = await generateObject({
            model: openai('gpt-4.1-mini-2025-04-14'),
            system: systemPrompt,
            schema: schema,
            prompt: query,
        });

        return object;
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