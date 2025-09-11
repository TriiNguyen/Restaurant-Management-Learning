import { NextResponse, NextRequest } from "next/server";

const privatePaths = ["/manage"];

const unAuthPaths = ["/login", "/register", "/forgot-password"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Chưa đăng nhập thì không cho vào private paths
  if (
    privatePaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    !refreshToken
  ) {
    return NextResponse.redirect(new URL("/logout", request.url));
  }

  // Đăng nhập rồi thì không cho vào unAuth paths (login nữa)
  if (
    unAuthPaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    refreshToken
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Đăng nhập rồi nhưng accessToken hết hạn
  if (
    privatePaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL("/refresh-token", request.url);

    url.searchParams.set("refreshToken", refreshToken || "");
    url.searchParams.set("redirectUrl", request.nextUrl.pathname || "");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login", "/register", "/forgot-password"],
};
