import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const path = nextUrl.pathname;
  const token = cookies.get("token")?.value || null;

  // Define public routes that don't require authentication
  const publicPaths = new Set(["/login", "/signup", "/verifyemail"]);

  console.log("Middleware Running:");
  console.log("Path:", path);
  console.log("Token:", token);

  if (!token && !publicPaths.has(path)) {
    console.log(
      "User is NOT authenticated and trying to access a protected page. Redirecting to login."
    );
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  console.log("Middleware allows request to proceed.");
  return NextResponse.next();
}

// Define routes to apply middleware
export const config = {
  matcher: ["/", "/profile", "/login", "/signup", "/verifyemail"],
};
