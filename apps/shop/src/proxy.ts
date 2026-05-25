import { NextRequest, NextResponse } from "next/server";
import { constructRewrittenUrl, getValuesFromRequest } from "./middleware/utils";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function proxy(req: NextRequest) {
  const { path, hostname } = getValuesFromRequest(req)

  return NextResponse.rewrite(constructRewrittenUrl(hostname, path, req));
}
