import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

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
        await ctx.runMutation(internal.vets.setCoordinates, {
          id: vet._id,
          lat: location.lat,
          lng: location.lng,
        });
        geocoded++;
      } else {
        console.error(
          `Geocoding failed for ${vet.name} (${address}): ${data.status}`,
        );
        failed++;
      }
      // Stay well under Google's rate limits.
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return { geocoded, failed, total: vets.length };
  },
});
