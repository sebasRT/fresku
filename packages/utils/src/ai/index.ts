'use server'
import { openai } from './openai';

async function getEmbbedding(string: string) {

    const result = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: string,
        dimensions: 200
    })

    return result.data[0]?.embedding;
}

export { getEmbbedding };

