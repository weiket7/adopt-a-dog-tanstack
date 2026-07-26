import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

async function geocodeAddress(
  address: string,
  apiKey: string,
): Promise<{ lat: number; lng: number } | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address,
  )}&region=sg&key=${apiKey}`;
  const res = await fetch(url);
  const data = (await res.json()) as {
    status: string;
    results: { geometry: { location: { lat: number; lng: number } } }[];
  };
  const location = data.results?.[0]?.geometry?.location;
  if (data.status === "OK" && location) {
    return { lat: location.lat, lng: location.lng };
  }
  console.error(`Geocoding failed for ${address}: ${data.status}`);
  return null;
}

export const geocode = action({
  args: {
    block: v.string(),
    street: v.string(),
    building: v.optional(v.string()),
    postalCode: v.string(),
  },
  handler: async (
    _ctx,
    { block, street, building, postalCode },
  ): Promise<{ lat: number; lng: number } | null> => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is not configured");
    const address = [block, street, building, `Singapore ${postalCode}`]
      .filter(Boolean)
      .join(", ");
    return await geocodeAddress(address, apiKey);
  },
});

export const geocodeMissing = internalAction({
  args: { apiKey: v.string() },
  handler: async (
    ctx,
    { apiKey },
  ): Promise<{ geocoded: number; failed: number; total: number }> => {
    const vets = await ctx.runQuery(internal.vets.listMissingCoordinates, {});
    let geocoded = 0;
    let failed = 0;
    for (const vet of vets) {
      const address = [
        vet.block,
        vet.street,
        vet.building,
        `Singapore ${vet.postalCode}`,
      ]
        .filter(Boolean)
        .join(", ");
      const location = await geocodeAddress(address, apiKey);
      if (location) {
        await ctx.runMutation(internal.vets.setCoordinates, {
          id: vet._id,
          ...location,
        });
        geocoded++;
      } else {
        failed++;
      }
      // Stay well under Google's rate limits.
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return { geocoded, failed, total: vets.length };
  },
});
