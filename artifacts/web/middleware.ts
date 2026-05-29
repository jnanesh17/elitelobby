import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const isClerkConfigured = Boolean(
  process.env.CLERK_SECRET_KEY &&
  (process.env.CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
);

const middlewareHandler = isClerkConfigured
  ? clerkMiddleware()
  : (request: NextRequest) => NextResponse.next();

export default middlewareHandler;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
