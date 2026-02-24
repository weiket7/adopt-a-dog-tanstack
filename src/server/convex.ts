import { ConvexHttpClient } from "convex/browser";
import { getRequest } from "@tanstack/react-start/server";

let client: ConvexHttpClient | undefined;

export function getConvexServerClient() {
  if (client) return client;

  // 1. Grab the current request object
  const request = getRequest();

  // 2. Access the Cloudflare context from the request
  // In 2026, Cloudflare bindings are attached to request.context
  const env = (request as any).context?.cloudflare?.env;

  // 3. Fallback logic: check Context -> check process.env -> check Build-time env
  const CONVEX_URL =
    env?.VITE_CONVEX_URL ||
    process.env.VITE_CONVEX_URL ||
    (import.meta as any).env.VITE_CONVEX_URL;

  if (!CONVEX_URL) {
    throw new Error(
      "Convex Server Error: VITE_CONVEX_URL is missing from all environments."
    );
  }
  console.log("convexAction.ts using CONVEX_URL ", CONVEX_URL);

  // Pass the actual variable CONVEX_URL
  client = new ConvexHttpClient(CONVEX_URL);
  return client;
}
