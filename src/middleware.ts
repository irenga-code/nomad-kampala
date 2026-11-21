import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

// Basic auth for /admin. ADMIN_USER and ADMIN_PASSWORD (12+ chars) are required, no defaults.
// The admin page checks again on its own, so this is not the only gate.
export function middleware(req: NextRequest) {
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD) {
    return new NextResponse("Admin disabled", { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  if (!isAdmin(req.headers.get("authorization"))) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="NOMAD admin"', "Cache-Control": "no-store" },
    });
  }
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
