"use server"
import { TenantMeta, tenantSchema } from "@fresku/model/tenants/metadata";
import { createRedisTenant, deleteTenantKey } from "@fresku/redis/tenants";
import { toTenantDB } from "@fresku/utils/functions/strings";
import { MongoClient } from "mongodb";
import clientPromise from "..";
import { createTenantMetadata } from "./meta";

let client: MongoClient;

async function init() {
    if (client) return
    try {
        client = await clientPromise

    } catch (error) {
        throw new Error('Failed to stablish connection to database')
    }
}

/**
 * Creates a new tenant in the system by setting up the tenant database, Redis cache entry, and metadata.
 * This function performs a transactional operation that includes creating the tenant in Redis,
 * setting up tenant metadata in the specific tenant DB, and inserting the tenant record into the Tenants collection.
 * 
 * @param tenant - The tenant data excluding the tenantId which will be generated during creation.
 *                 Must contain all required tenant properties such as database name and domain.
 * @returns A promise that resolves to the formatted database name for the created tenant.
 * @throws {Error} When tenant data validation fails, database connection cannot be established,
 *                 or any step in the tenant creation process fails.
 */
async function createTenant(tenant: Omit<TenantMeta, "tenantId">) {
    await init();

    const validTenant = tenantSchema.omit({ tenantId: true }).safeParse(tenant);

    if (!validTenant.success) {
        throw new Error('Invalid tenant data: ' + validTenant.error.message);
    }

    try {
        const session = client.startSession();
        const database = toTenantDB(tenant.database);
        const db = client.db(database);

        await session.withTransaction(async () => {

            // Set up the Redis cache entry for the tenant
            const tenantId = await createRedisTenant({ ...tenant, database });

            // Insert the tenant record into the Tenants collection
            await createTenantMetadata({ ...tenant, tenantId }, session);
            const meta = db.collection('meta');

            // Set up tenant metadata in the specific tenant DB
            const insertResult = await meta.insertOne({ ...tenant, tenantId }, { session });

            if (!insertResult.acknowledged) {
                await deleteTenantKey(tenant.domain);
                await session.abortTransaction();
                throw new Error('Failed to insert tenant');
            }
        });

        await session.endSession();

        return database;
    } catch (error) {
        throw new Error('Failed to create tenant database: ' + error);
    }
}

export { createTenant };

