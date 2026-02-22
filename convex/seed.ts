import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const NAMES = [
  "Buddy",
  "Bella",
  "Charlie",
  "Luna",
  "Max",
  "Daisy",
  "Milo",
  "Ruby",
  "Cooper",
  "Lola",
];
const GENDERS = ["Male", "Female"];

export const seedDogs = internalMutation({
  args: { count: v.number() },
  handler: async (ctx, args) => {
    // 1. Get existing welfare groups to link them
    const groups = await ctx.db.query("welfareGroups").collect();
    if (groups.length === 0) {
      throw new Error(
        "Please add at least one Welfare Group before seeding dogs."
      );
    }

    for (let i = 0; i < args.count; i++) {
      const randomGroup = groups[Math.floor(Math.random() * groups.length)];
      const randomGender = GENDERS[Math.floor(Math.random() * GENDERS.length)];

      // Generate a random birthday between 1 and 10 years ago
      const yearsAgo = Math.floor(Math.random() * 10) + 1;
      const birthday = new Date();
      birthday.setFullYear(birthday.getFullYear() - yearsAgo);

      await ctx.db.insert("dogs", {
        name: `${NAMES[Math.floor(Math.random() * NAMES.length)]} ${i + 1}`,
        gender: randomGender,
        birthday: birthday.toISOString(),
        hdbApproved: Math.random() > 0.5 ? "Yes" : "No",
        welfareGroupId: randomGroup._id,
        status: "active",
        // Using a placeholder image from your logic
        imageStorageId: undefined,
        description:
          "This is a generated dog description for testing purposes.",
      });
    }

    return `Successfully seeded ${args.count} dogs!`;
  },
});
