// import { Hono } from "hono";
// import { zValidator } from "@hono/zod-validator";
// import { openai } from "@fresku/utils/ai/openai";
// import z from "zod/v4";

// const ai = new Hono()




// ai.post("/", async (c) => {
//     const { messages, domain } = await c.req.json()

//     try {
//         const response = await openai.responses.create({
//             model: "gpt-4",
//             input: [{ role: "system", content: systemPromp, ...messages }],
//             tools
//         })


//     } catch () {

//     }
// })


// const tools = [{
//     type: "function",
//     name: "buscarProductos",
//     description: "Busca 1 o varios productos por su nombre y otras características como la medida o la marca. Los resultados son mostrados en la UI.",
//     parameters: z.toJSONSchema(z.object({ query: z.string() })),
//     execute: async ({ query }) => {
//         try {
//             const result = await tenantAiSearch(query, domain, systemPromp);

//             return { products: result.products ?? [] }
//         } catch (error) {
//             console.log("errorsitoooo", error);

//             return { products: [] }

//         }
//     }
// }]

// const systemPromp = `Eres un asistente que ayuda a buscar productos de mercado. Los resultados de las busquedas son mostrados en la UI.`
//     + ' Se corto y conciso en tus respuestas con naturalidad y calidez.'
//     + ' Aqui tienes algunas marcas locales: "Sonsoneña", "Margarita", "Colanta", "Alquería", "Postobón", "Bavaria", "Coca Cola", "Bary" '
//     + ' Los usuarios deben añadir los productos usando el "boton azul" que se muestra en el producto.'
//     + ' Si te piden añadir productos, indica que usen el boton azul que se muestra en el producto.';
// const searchBarcodeQuerySchema = z.string().describe('Query para busqueda de productos por código de barras con estas reglas' + reglasSearchString);
