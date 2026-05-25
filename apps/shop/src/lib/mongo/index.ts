import { MongoClient, MongoClientOptions } from "mongodb";

const URI: string | undefined = process.env.MONGODB_URI;

const options: MongoClientOptions = {};

if (!URI) {
  throw new Error("Please add your Mongo URI to .env");
}

export const client = new MongoClient(URI, options);

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV !== "production") {
  if (!(global as any)._mongoClientPromise) {
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;