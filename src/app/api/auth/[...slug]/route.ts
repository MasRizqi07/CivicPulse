import { auth } from "@/server/auth";
import { checkRateLimit, getRateLimitHeaders } from "@/server/rate-limiter";
import { NextResponse } from "next/server";

const handler = async (req: Request) => {
  // Get client IP for rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || 
             req.headers.get("x-real-ip") || 
             "unknown";

  // Check rate limit for auth endpoints
  const rateLimitResult = await checkRateLimit(ip, "auth");

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { 
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult)
      }
    );
  }

  const response = await auth.handler(req);

  // Add rate limit headers to successful responses
  if (response instanceof Response) {
    const newHeaders = new Headers(response.headers);
    Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });
    
    // Create new Response with updated headers
    const clonedResponse = response.clone();
    return new Response(clonedResponse.body, {
      status: clonedResponse.status,
      headers: newHeaders,
    });
  }

  return response;
};

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
