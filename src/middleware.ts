import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/server/auth";

const protectedRoutes = [
  "/dashboard",
  "/reports/new",
  "/reports",
  "/admin",
  "/profile",
  "/notifications",
];

const adminRoutes = ["/admin"];
const officerRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session) {
    const isAdminRoute = adminRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );
    const isOfficerRoute = officerRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );

    const userRole = session.user.role as string;

    if (isAdminRoute && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isOfficerRoute && !["OFFICER", "SUPER_ADMIN"].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|$).*)",
  ],
};
