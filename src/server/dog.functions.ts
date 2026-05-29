import { createServerFn } from "@tanstack/react-start";
import { api } from "../../convex/_generated/api";
import { getConvexServerClient } from "./convex";
import { Id } from "convex/_generated/dataModel";
import z from "zod";

export const saveDogAction = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }
    return data;
  })
  .handler(async ({ data }: { data: FormData }) => {
    const convex = getConvexServerClient();
    const dogId = data.get("dogId") as string | null;
    const imageFile = data.get("image") as File;
    const name = data.get("name") as string;
    const gender = z.enum(["Male", "Female"]).parse(data.get("gender"));
    const hdbApproved = z.enum(["Yes", "No"]).parse(data.get("hdbApproved"));
    const birthday = data.get("birthday") as string;
    const status = z.enum(["Active", "Inactive"]).parse(data.get("status"));
    const welfareGroupId = data.get("welfareGroupId") as Id<"welfareGroups">;

    let storageId = data.get("existingStorageId") as Id<"_storage"> | undefined;

    // 1. Handle Image Upload if a new file exists
    if (imageFile && imageFile.size > 0) {
      const postUrl = await convex.action(api.dogs.generateUploadUrl);
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": imageFile.type },
        body: imageFile,
      });
      const json = await result.json();
      storageId = json.storageId as Id<"_storage">;
    }

    // 2. Decide Mutation
    const payload = {
      name,
      gender,
      hdbApproved,
      birthday,
      welfareGroupId,
      imageStorageId: storageId,
      status,
    };

    if (dogId) {
      await convex.mutation(api.dogs.update, {
        id: dogId as Id<"dogs">,
        ...payload,
      });
    } else {
      await convex.mutation(api.dogs.add, payload);
    }

    return { success: true };
  });

export const deleteDogAction = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: dogId }) => {
    const convex = getConvexServerClient();
    console.log(dogId);
    await convex.mutation(api.dogs.remove, { id: dogId as Id<"dogs"> });
    return { success: true };
  });
