import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function isAuthenticated(request: NextRequest): boolean {
  if (!ADMIN_TOKEN) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) return true;

  const url = new URL(request.url);
  const tokenParam = url.searchParams.get("token");
  if (tokenParam === ADMIN_TOKEN) return true;

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin-eternostd")) {
    if (!isAuthenticated(request)) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Bearer realm="admin"' },
      });
    }
  }

  if (pathname.startsWith("/api/")) {
    if (request.method === "GET") {
      return NextResponse.next();
    }

    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-eternostd/:path*", "/api/:path*"],
};
