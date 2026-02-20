import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";

export default defineSchema({
  ...authTables,
  // your other tables (dogs, etc.)
});