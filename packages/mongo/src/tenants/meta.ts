"use server"
import { TenantMeta, tenantSchema } from "@fresku/model/tenants/metadata";
import { ClientSession, Collection, Db, MongoClient } from "mongodb";
import clientPromise from "..";

let client: MongoClient;
let db: Db;
let tenants: Collection<TenantMeta>;

async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = client.db("Tenants")
        tenants = db.collection('meta')

    } catch (error) {
        throw error
    }
}

async function createTenantMetadata(meta: TenantMeta, session: ClientSession) {
    await init();
    const valid = tenantSchema.safeParse(meta);
    if (!valid.success) {
        throw new Error('Invalid meta data: ' + valid.error.message);
    }
    try {
        const createdTenant = await tenants.insertOne(meta, { session });
        if (!createdTenant.acknowledged) {
            throw new Error('Failed to create tenant metadata');
        }
        return createdTenant;
    } catch (error) {
        throw new Error('Failed to create tenant: ' + error);
    }
}

async function getSubdomains() {
    await init();
    const subdomains = await tenants.distinct('subdomain');
    return subdomains;
}

async function getDomains() {
    await init();
    const domains = await tenants.distinct('domain');
    return domains;
}

async function getTenantName(domain: string): Promise<string | null> {
    await init();
    const tenant = await tenants.findOne({ domain }, { projection: { name: 1 } });
    return tenant ? tenant.name : null;
}

async function getTenantIdByDomain(domain: string): Promise<string | null> {
    await init();
    const tenant = await tenants.findOne({ domain }, { projection: { tenantId: 1 } });
    return tenant ? tenant.tenantId : null;
}

async function getTenantDatabase(domain: string): Promise<string | null> {
    await init();
    const tenant = await tenants.findOne({ domain }, { projection: { database: 1 } });
    return tenant ? tenant.database : null;
}

async function getTenantCheckoutKey(domain: string): Promise<string | null> {
    await init();
    const tenant = await tenants.findOne({ domain }, { projection: { checkoutKey: 1 } });
    return tenant ? tenant.checkoutKey : null;
}

async function getTenantDeliveryZones(domain: string): Promise<Record<string, number> | null> {
    await init();
    const tenant = await tenants.findOne({ domain }, { projection: { deliveryZones: 1 } });
    return tenant?.deliveryZones ?? null;
}

export { createTenantMetadata, getDomains, getSubdomains, getTenantCheckoutKey, getTenantDatabase, getTenantDeliveryZones, getTenantIdByDomain, getTenantName };

