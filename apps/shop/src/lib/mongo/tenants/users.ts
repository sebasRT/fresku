import clientPromise from "@fresku/mongo/index";
import { Collection, Db, MongoClient } from "mongodb";

let client: MongoClient;
let db: Db;
let users: Collection<any>; // Replace with actual user schema

async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = client.db("Tenants")
        users = db.collection('users')
    } catch (error: any) {
        throw new Error(error)
    }
}

async function findTenantByAdminEmail(email: string) {
    await init();
    try {
        const result = await users.findOne({ "admin.email": email }, { projection: { _id: 0, tenantId: 1, admin: 1 } });
        return result;
    } catch (error) {
        throw new Error('Authentication failed')
    }
}

async function getTenantDomers(tenantId: string) {
    await init();
    try {
        const result = await users.findOne({ tenantId }, { projection: { _id: 0, domis: 1 } });
        return result.domis

    } catch (error) {
        throw new Error("failed to get tenant domis")
    }
}

export { findTenantByAdminEmail, getTenantDomers };

