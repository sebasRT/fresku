interface Metadata {
    openGraph: {
        opImage: string;
        title: string;
        description: string;
    };
    logo: string;
    title: string;
}

interface Delivery {
    pushTokens: string[];
    units: {
        name: string;
        fee: number;
    }[];
}

interface TenantConfig {
    subdomain: string;
    metadata: Metadata;
    delivery: Delivery;
}

export type { Metadata, Delivery, TenantConfig };