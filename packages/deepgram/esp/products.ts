import { createClient } from "@deepgram/sdk";
import { BRANDS } from "../../utils/src/products/barcode/consts.ts";
const deepgramKey = process.env.DEEPGRAM_API_KEY;

if (!deepgramKey) {
    throw new Error("Deepgram API key not provided.");
}

const deepgram = createClient(deepgramKey);

async function getProductsQuery(recording: Buffer) {

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        recording,
        {
            model: "nova-2",
            language: "es",
            keywords: [...BRANDS],
        }
    );

    if (error) throw error;
    if (!error)
        console.dir(result.results.channels[0]?.alternatives[0]?.transcript, {
            depth: null,
        });
    return result.results.channels[0]?.alternatives[0]?.transcript;
}

export { getProductsQuery };

