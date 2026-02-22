import { ConvexHttpClient } from "convex/browser";
const convex = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);
export { convex };
