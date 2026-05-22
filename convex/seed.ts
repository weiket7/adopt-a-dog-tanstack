import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const VETS = [
  { name: "Mount Pleasant Animal Medical Centre",          address: "232 Whitley Rd",                     hours: "Mon–Sat 9am–7pm · Sun 9am–1pm",        phone: "+65 6250 8333", emergency: true,  publicHolidays: false, area: "Central" },
  { name: "Animal Recovery Veterinary Centre",             address: "30 Burn Rd, #01-01",                 hours: "Open 24 hours",                        phone: "+65 6634 1117", emergency: true,  publicHolidays: true,  area: "East"    },
  { name: "Beecroft Animal Specialist & Emergency Hospital", address: "5 Burn Rd, #02-01",                hours: "Open 24 hours",                        phone: "+65 6256 2275", emergency: true,  publicHolidays: true,  area: "East"    },
  { name: "The Animal Doctors",                            address: "6 Greenwood Ave",                    hours: "Mon–Fri 10am–8pm · Sat–Sun 10am–6pm", phone: "+65 6253 1300", emergency: false, publicHolidays: false, area: "North"   },
  { name: "The Joyous Vet",                                address: "240 Pasir Panjang Rd",               hours: "Mon–Sat 10am–8pm · Sun 10am–4pm",     phone: "+65 6873 3622", emergency: false, publicHolidays: true,  area: "West"    },
  { name: "Light of Life Veterinary Clinic",               address: "Blk 153 Serangoon North Ave 1",      hours: "Daily 10am–9pm",                       phone: "+65 6286 0030", emergency: false, publicHolidays: true,  area: "Central" },
  { name: "Animal & Avian Veterinary Clinic",              address: "21 Jalan Tua Kong",                  hours: "Mon–Sat 9am–8pm · Sun 9am–5pm",       phone: "+65 6243 3282", emergency: false, publicHolidays: false, area: "East"    },
  { name: "The Animal Clinic — Frankel",                   address: "21 Jalan Tua Kong",                  hours: "Mon–Fri 9am–9pm · Sat–Sun 9am–5pm",   phone: "+65 6244 8009", emergency: false, publicHolidays: false, area: "East"    },
  { name: "Vet Central",                                   address: "62 Eng Watt St",                     hours: "Mon–Sat 10am–8pm",                     phone: "+65 6224 5754", emergency: false, publicHolidays: false, area: "Central" },
  { name: "Allpets & Aqualife Veterinary Clinic",          address: "151 Serangoon North Ave 2",          hours: "Daily 10am–10pm",                      phone: "+65 6280 3833", emergency: false, publicHolidays: true,  area: "North"   },
  { name: "Companion Animal Surgery",                      address: "162 Bukit Merah Central, #01-3545",  hours: "Mon–Sat 9am–7pm · Sun 9am–1pm",        phone: "+65 6271 8488", emergency: false, publicHolidays: false, area: "South"   },
  { name: "Pet Hospital 24/7 — Tampines",                  address: "1 Tampines North Drive 1",           hours: "Open 24 hours",                        phone: "+65 6260 7080", emergency: true,  publicHolidays: true,  area: "East"    },
];

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
const GENDERS = ["Male", "Female"] as const;

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

const WELFARE_GROUPS = [
  { name: "SOSD — Save Our Street Dogs", blurb: "Singapore Specials. Sanctuary in Jalan Bahar.", image: "https://placedog.net/300/300?id=501", dogsAvailable: 86, website: "https://sosd.org.sg", facebook: "https://facebook.com/sosd.sg", instagram: "https://instagram.com/sosd_sg", tiktok: "https://tiktok.com/@sosd.sg", youtube: "https://youtube.com/@sosdsingapore" },
  { name: "Action for Singapore Dogs", blurb: "Rescue, rehab, rehome. Since 2000.", image: "https://placedog.net/300/300?id=502", dogsAvailable: 52, website: "https://asdsingapore.com", facebook: "https://facebook.com/ActionForSingaporeDogs", instagram: "https://instagram.com/asd_singapore" },
  { name: "Causes for Animals (Singapore)", blurb: "Community cats & rescue dogs.", image: "https://placedog.net/300/300?id=503", dogsAvailable: 34, website: "https://causesforanimals.com", facebook: "https://facebook.com/CausesForAnimalsSG", instagram: "https://instagram.com/causesforanimals", youtube: "https://youtube.com/@causesforanimals" },
  { name: "Voices for Animals", blurb: "Senior dogs & long-stayers.", image: "https://placedog.net/300/300?id=504", dogsAvailable: 41, website: "https://voicesforanimals.com.sg", facebook: "https://facebook.com/voicesforanimalssg", instagram: "https://instagram.com/voicesforanimalssg", tiktok: "https://tiktok.com/@voicesforanimals" },
  { name: "OSCAS — Oasis Second Chance", blurb: "Farmway shelter in Sungei Tengah.", image: "https://placedog.net/300/300?id=505", dogsAvailable: 63, website: "https://oscas.com.sg", facebook: "https://facebook.com/oscas.sg", instagram: "https://instagram.com/oscas_sg" },
  { name: "Exclusively Mongrels Ltd", blurb: "Local mongrels only. Foster-first.", image: "https://placedog.net/300/300?id=506", dogsAvailable: 28, website: "https://exclusivelymongrels.org", facebook: "https://facebook.com/exclusivelymongrels", instagram: "https://instagram.com/exclusivelymongrels" },
  { name: "Mercylight Animal Sanctuary", blurb: "Senior & special-needs animals.", image: "https://placedog.net/300/300?id=507", dogsAvailable: 47, website: "https://mercylight.sg", facebook: "https://facebook.com/MercylightSanctuary", instagram: "https://instagram.com/mercylightsanctuary", youtube: "https://youtube.com/@mercylight" },
  { name: "Purely Adoptions", blurb: "Adopt-don't-shop advocacy.", image: "https://placedog.net/300/300?id=508", dogsAvailable: 19, website: "https://purelyadoptions.com", facebook: "https://facebook.com/purelyadoptions", instagram: "https://instagram.com/purelyadoptions", tiktok: "https://tiktok.com/@purelyadoptions" },
  { name: "Animal Lovers League", blurb: "Cage-free farmway shelter.", image: "https://placedog.net/300/300?id=509", dogsAvailable: 71, website: "https://animalloversleague.com", facebook: "https://facebook.com/AnimalLoversLeague", instagram: "https://instagram.com/animalloversleague" },
  { name: "SPCA Singapore", blurb: "Adoption, inspection, advocacy.", image: "https://placedog.net/300/300?id=510", dogsAvailable: 38, website: "https://spca.org.sg", facebook: "https://facebook.com/spca.singapore", instagram: "https://instagram.com/spcasingapore", tiktok: "https://tiktok.com/@spcasingapore", youtube: "https://youtube.com/@SPCASingapore" },
];

export const seedWelfareGroups = internalMutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("welfareGroups").collect();
    if (existing.length > 0) return "Welfare groups already seeded.";
    for (const g of WELFARE_GROUPS) {
      const slug = g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      await ctx.db.insert("welfareGroups", { ...g, slug, status: "active" });
    }
    return `Seeded ${WELFARE_GROUPS.length} welfare groups.`;
  },
});

export const seedVets = internalMutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("vets").collect();
    if (existing.length > 0) return "Vets already seeded.";
    for (const vet of VETS) {
      await ctx.db.insert("vets", vet);
    }
    return `Seeded ${VETS.length} vets.`;
  },
});
