import { NextResponse, NextRequest } from "next/server";

const privatePaths = ["/manage"];

const unAuthPaths = ["/login", "/register", "/forgot-password"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const isAuth = Boolean(request.cookies.get("accessToken")?.value);
  if (
    privatePaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    !isAuth
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    unAuthPaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    isAuth
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login", "/register", "/forgot-password"],
};
