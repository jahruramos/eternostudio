import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const COOKIE_NAME = "eternostd_admin_token";

function isAuthenticated(request: NextRequest): boolean {
  if (!ADMIN_TOKEN) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) return true;

  const url = new URL(request.url);
  const tokenParam = url.searchParams.get("token");
  if (tokenParam === ADMIN_TOKEN) return true;

  const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken === ADMIN_TOKEN) return true;

  return false;
}

function setAuthCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, ADMIN_TOKEN!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin-eternostd")) {
    if (isAuthenticated(request)) {
      const response = NextResponse.next();
      if (!request.cookies.get(COOKIE_NAME)?.value) {
        setAuthCookie(response);
      }
      return response;
    }

    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Bearer realm="admin"' },
    });
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
