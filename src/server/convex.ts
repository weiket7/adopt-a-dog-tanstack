import { ConvexHttpClient } from "convex/browser";
const CONVEX_URL = process.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("convex.ts missing envar VITE_CONVEX_URL");
}
const convex = new ConvexHttpClient("CONVEX_URL");
export { convex };
