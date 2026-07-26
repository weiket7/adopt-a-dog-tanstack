import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

export const uploadServiceImage = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Missing file");
    const name = data.get("name");
    return { file, name: typeof name === "string" ? name : "" };
  })
  .handler(async ({ data: { file, name } }) => {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const base = slug || crypto.randomUUID();
    const key = `services/${base}-${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

    await env.ADOPT_A_DOG_BUCKET.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });

    return { url: `${env.R2_PUBLIC_URL}/${key}` };
  });

export const uploadDogRunImage = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Missing file");
    const name = data.get("name");
    return { file, name: typeof name === "string" ? name : "" };
  })
  .handler(async ({ data: { file, name } }) => {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const base = slug || crypto.randomUUID();
    const key = `dog-runs/${base}-${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

    await env.ADOPT_A_DOG_BUCKET.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });

    return { url: `${env.R2_PUBLIC_URL}/${key}` };
  });

export const uploadEventImage = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Missing file");
    const name = data.get("name");
    return { file, name: typeof name === "string" ? name : "" };
  })
  .handler(async ({ data: { file, name } }) => {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const base = slug || crypto.randomUUID();
    const key = `events/${base}-${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

    await env.ADOPT_A_DOG_BUCKET.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });

    return { url: `${env.R2_PUBLIC_URL}/${key}` };
  });

export const uploadDogImage = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Missing file");
    return file;
  })
  .handler(async ({ data: file }) => {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
    const key = `dogs/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

    await env.ADOPT_A_DOG_BUCKET.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });

    return { url: `${env.R2_PUBLIC_URL}/${key}` };
  });
