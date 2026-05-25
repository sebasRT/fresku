import { BarcodeProduct, barcodeSchema } from "@fresku/model/products/barcode";
import crypto from 'crypto';

function parseBarcodeProducts(rawProducts: any[]): BarcodeProduct[] {
    return rawProducts.map((product) => {
        const enriched = {
            ...product,
            type: "barcode",
        };
        return barcodeSchema.parse(enriched);
    });
}

const parseTenantName = (tenantName: string) => {
    const parts = tenantName.split("_tenant");
    if (parts.length > 1) {
        return parts[0];
    }
    return tenantName;
}

function decodeDomain(domain: string) {
    const decoded = decodeURIComponent(domain);
    return decoded.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
        ? decoded.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
        : domain;
}

const domainToTenantId = (domain: string) => {
    const key = process.env.FRESKU_SECRET;
    const decodedDomain = decodeDomain(domain);
    if (!key) throw new Error("Please add your FRESKU_SECRET secret to .env");
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(decodedDomain);
    return hmac.digest('base64')
}

export { decodeDomain, domainToTenantId, parseBarcodeProducts, parseTenantName };

