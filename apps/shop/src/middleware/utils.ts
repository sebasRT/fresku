import { NextRequest } from "next/server";


function constructRewrittenUrl(hostname: string, path: string, req: NextRequest): URL {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

    if (!rootDomain) {
        throw new Error("Please add your root domain to.env");
    }

    if (hostname === rootDomain) {
        return new URL(path, req.url);
    }

    if (hostname.startsWith("www.")) {
        return new URL(req.url);
    }

    if (isSubdomainOfRoot(hostname, rootDomain)) {
        const subdomain = extractSubdomain(hostname, rootDomain);

        switch (path) {
            case "/login":
                const url = new URL("/login", req.url);
                url.searchParams.set("tenant", subdomain);
                return url;
            case "/signup":
                const logoutUrl = new URL("/signup", req.url);
                logoutUrl.searchParams.set("tenant", subdomain);
                return logoutUrl;
            default:
                break;
        }

        return new URL(`/${subdomain}${path}`, req.url);
    }

    return new URL(`/${hostname}${path}`, req.url);
}

function isSubdomainOfRoot(hostname: string, rootDomain: string): boolean {
    return hostname.endsWith(`.${rootDomain}`);
}

function extractSubdomain(hostname: string, rootDomain: string): string {
    if (!hostname.endsWith(`.${rootDomain}`)) {
        return hostname;
    }

    const subdomain = hostname.replace(`.${rootDomain}`, '');
    return subdomain;
}

const getValuesFromRequest = (req: NextRequest) => {
    const url = req.nextUrl;
    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
    const hostname = decodeURIComponent(req.headers.get("host")!);

    const subdomain = hostname.split(".")[0];

    return { hostname, path, subdomain };
}

export { constructRewrittenUrl, getValuesFromRequest };

