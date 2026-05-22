import { createServerFn } from "@tanstack/react-start";
import { api } from "../../convex/_generated/api";
import { getConvexServerClient } from "./convex";
import { Id } from "convex/_generated/dataModel";
import z from "zod";

export const saveEventAction = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Invalid form data");
    return data;
  })
  .handler(async ({ data }: { data: FormData }) => {
    const convex = getConvexServerClient();
    const eventId = data.get("eventId") as string | null;
    const name = data.get("name") as string;
    const location = data.get("location") as string;
    const image = (data.get("image") as string) || undefined;
    const dateTime = data.get("dateTime") as string;
    const link = (data.get("link") as string) || undefined;

    const payload = { name, location, image, dateTime, link };

    if (eventId) {
      await convex.mutation(api.events.update, {
        id: eventId as Id<"events">,
        ...payload,
      });
    } else {
      await convex.mutation(api.events.create, payload);
    }

    return { success: true };
  });

export const deleteEventAction = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: eventId }) => {
    const convex = getConvexServerClient();
    await convex.mutation(api.events.remove, { id: eventId as Id<"events"> });
    return { success: true };
  });
