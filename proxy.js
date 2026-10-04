import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

function getVerifiedRole(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) return null;
  try {
    const payload = jwt.verify(token, secret);
    return typeof payload === "object" && payload ? payload.role : null;
  } catch {
    return null;
  }
}

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && getVerifiedRole(token) !== "admin") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (token) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/account/:path*", "/cart/:path*", "/checkout/:path*", "/orders/:path*", "/admin/:path*"],
};
