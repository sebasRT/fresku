"use server"
import { User } from "@fresku/model/users/index";
import { getNowInUTC } from "@fresku/utils/time/index";
import { getOrCreateSessionId } from "@fresku/utils/users/id";
import { Collection, Db, MongoClient } from "mongodb";
import clientPromise from "..";

let client: MongoClient;
let db: Db;
let meta: Collection<User>;

async function Init() {
    if (client) return
    try {
        client = await clientPromise
        db = client.db("Users")
        meta = db.collection('users')

    } catch (error) {
        throw new Error('Failed to stablish connection to database')
    }
}

async function createUser(user: Omit<User, "userId" | "createdAt">) {
    await Init();
    try {

        const exists = await meta.findOne({ email: user.email })

        if (exists) return { success: false, message: "already exists" }

        const sessionId = await getOrCreateSessionId()
        const session = client.startSession()

        return await session.withTransaction(async () => {
            const createdAt = getNowInUTC().toBSON()
            const result = await meta.insertOne({ userId: sessionId, createdAt, ...user })

            if (!result.acknowledged) {
                return { success: false, message: 'Error al crear usuario' }
            }

            return { success: true, message: 'Usuario creado exitosamente' }
        })

    } catch (error) {
        return { success: false, message: 'Error al crear usuario' }
    }
}

export { createUser };

