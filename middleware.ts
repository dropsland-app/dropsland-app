import { NextResponse, type NextRequest } from "next/server";
import { verifyAuthToken } from "@privy-io/node";
import { createRemoteJWKSet } from "jose";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/organizer",
  "/create",
  "/wallet",
  "/profile",
  "/verify",
  "/activity",
];

// Routes that should always be accessible
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/onboarding", "/explore", "/events", "/creator", "/api"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and public routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // Get the Privy auth token from cookies
  const authToken = request.cookies.get("privy-token")?.value;

  if (!authToken) {
    // No token — redirect to home (login)
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    const jwksEndpoint = process.env.NEXT_PUBLIC_PRIVY_JWKS_ENDPOINT;

    if (!appId || !jwksEndpoint) {
      console.error("Missing Privy configuration for middleware");
      return NextResponse.next();
    }

    // Verify the token using the JWKS endpoint
    const verificationKey = createRemoteJWKSet(new URL(jwksEndpoint));

    await verifyAuthToken({
      auth_token: authToken,
      app_id: appId,
      verification_key: verificationKey,
    });

    // Token is valid — allow the request
    return NextResponse.next();
  } catch (error) {
    console.error("Auth token verification failed:", error);

    // Invalid or expired token — redirect to home
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);

    // Clear the invalid token
    response.cookies.delete("privy-token");

    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public).*)",
  ],
};
