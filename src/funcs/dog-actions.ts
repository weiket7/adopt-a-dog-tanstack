import { createServerFn } from "@tanstack/react-start";
import { api } from "../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

export const saveDogAction = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }
    return data;
  })
  .handler(async ({ data }: { data: FormData }) => {
    console.log("Server received dog data for:", data.get("name"));
    const dogId = data.get("dogId") as string | null;
    const imageFile = data.get("image") as File;
    const name = data.get("name") as string;
    const gender = data.get("gender") as string;
    const hdbApproved = data.get("hdb-approved") as string;
    const birthday = data.get("birthday") as string;

    let storageId = data.get("existingStorageId") as string | undefined;

    // 1. Handle Image Upload if a new file exists
    if (imageFile && imageFile.size > 0) {
      const postUrl = await convex.action(api.dogs.generateUploadUrl);
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": imageFile.type },
        body: imageFile,
      });
      const json = await result.json();
      storageId = json.storageId;
    }

    // 2. Decide Mutation
    const payload = {
      name,
      gender,
      hdbApproved,
      birthday,
      imageStorageId: storageId as any,
    };

    if (dogId) {
      await convex.mutation(api.dogs.update, { id: dogId as any, ...payload });
    } else {
      await convex.mutation(api.dogs.add, payload);
    }

    return { success: true };
  });
