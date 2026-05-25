"use server";
import { getProductsQuery } from "@fresku/deepgram/esp/products";

async function getQuery(latestRecording: ArrayBuffer) {
  const buffer = Buffer.from(latestRecording);

  return await getProductsQuery(buffer)
}

export { getQuery };

