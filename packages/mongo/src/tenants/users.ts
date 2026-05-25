import { Domer, TenantUsers } from "@fresku/model/tenants/users";
import { Collection, Db, MongoClient } from "mongodb";
import clientPromise from "..";

let client: MongoClient;
let db: Db;
let users: Collection<TenantUsers>; // Replace with actual user schema

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
        const result = await users.findOne({ "admin.email": email }, { projection: { _id: 0, tenantId: 1, admin: 1, domain: 1 } });
        return result;
    } catch (error) {
        throw new Error('Authentication failed')
    }
}

async function getTenantDomers(tenantId: string) {
    await init();
    try {
        const result = await users.findOne({ tenantId }, { projection: { _id: 0, domers: 1 } });
        return result

    } catch (error) {
        throw new Error("failed to get tenant domis")
    }
}

async function addDomer(tenantId: string, newDomer: Domer) {
    await init();
    try {
        const result = await users.updateOne(
            { tenantId, "domers.id": { $ne: newDomer.id } },
            { $push: { domers: newDomer } }
        );
        return result.matchedCount > 0 && result.modifiedCount > 0;
    } catch (error) {
        throw new Error("failed to add domer")
    }
}

async function updateDomer(tenantId: string, newDomer: Partial<Domer>) {
    await init();
    try {
        const result = await users.updateOne(
            { tenantId },
            [
                {
                    $set: {
                        domers: {
                            $map: {
                                input: "$domers",
                                as: "domer",
                                in: {
                                    $cond: [
                                        { $eq: ["$$domer.id", newDomer.id] },
                                        { $mergeObjects: ["$$domer", newDomer] },
                                        "$$domer"
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        )
        return result.matchedCount > 0;
    } catch (error) {
        throw new Error("failed to update domer")
    }
}

async function getDomer(tenantId: string, domerId: string) {
    await init();
    try {
        const result = await users.findOne({ tenantId, "domers.id": domerId }, { projection: { _id: 0, "domers.$": 1 } });
        if (!result) return null;

        return result?.domers[0];

    } catch (error: any) {
        throw new Error(error)
    }
}

async function deleteDomer(tenantId: string, domerId: string) {
    await init();
    try {
        const result = await users.updateOne(
            { tenantId },
            { $pull: { domers: { id: domerId } } }
        );
        return result.matchedCount > 0;

    } catch (error) {
        throw new Error("failed to delete domer")
    }
}

async function setDomerToken(tenantId: string, domerId: string, token: string) {
    await init()
    try {
        const result = await users.updateOne(
            { tenantId, "domers.id": domerId },
            { $set: { "domers.$.token": token } }
        );

        return result;

    } catch (error) {
        throw new Error("failed to delete domer")
    }
}

async function getTenantDomersByDomain(domain: string) {
    await init();
    try {
        const result = await users.findOne({ domain }, { projection: { _id: 0, domers: 1 } });
        return result;
    } catch (error) {
        throw new Error("failed to get tenant domers by domain")
    }
}

export { addDomer, deleteDomer, findTenantByAdminEmail, getDomer, getTenantDomers, getTenantDomersByDomain, setDomerToken, updateDomer };

