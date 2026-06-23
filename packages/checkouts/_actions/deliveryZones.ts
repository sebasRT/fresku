"use server"
import { getTenantDeliveryZones } from "@fresku/redis/tenants";

export async function getDeliveryZones(domain: string): Promise<Record<string, number>> {
    return getTenantDeliveryZones(domain, false);
}
