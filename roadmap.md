# Roadmap: Upload & display images with Cloudflare R2

This is the step-by-step path this project followed to let an admin form upload an
image file and have it show up on the public site, using a Cloudflare R2 bucket as
storage. Adapt the bucket/folder names for whatever feature you're adding.

## 1. Create the R2 bucket(s)

You need one bucket per environment so local dev never touches production data.

```bash
npx wrangler r2 bucket create <project>-dev
npx wrangler r2 bucket create <project>-prod
```

Check a bucket exists / inspect it any time with:

```bash
npx wrangler r2 bucket info <bucket-name>
```

## 2. Make the bucket's contents publicly readable

The simplest option is Cloudflare's free `r2.dev` public URL per bucket. (For a real
production domain, map a custom domain to the bucket instead — see Cloudflare's R2
docs on "Custom Domains".)

```bash
npx wrangler r2 bucket dev-url enable <bucket-name>
```

This prints a URL like `https://pub-<hash>.r2.dev` — save it, you'll need it for
both `wrangler.jsonc` (below) and for building the final image URL after upload.

## 3. Bind the bucket in `wrangler.jsonc`

Add an `r2_buckets` binding so your Worker code can reach the bucket. Bindings are
**not inherited** between the top-level config and named environments in Wrangler —
if you split dev/prod, each environment needs its own full `r2_buckets` (and `vars`)
block.

```jsonc
{
  // ...
  "vars": {
    "R2_PUBLIC_URL": "https://pub-<dev-hash>.r2.dev"
  },
  "r2_buckets": [
    {
      "binding": "MY_BUCKET",
      "bucket_name": "<project>-dev",
      // Without this, local dev writes to a Miniflare-simulated bucket on your
      // disk (.wrangler/state/v3/r2/...) instead of the real cloud bucket.
      "remote": true
    }
  ],
  "env": {
    "production": {
      "vars": {
        "R2_PUBLIC_URL": "https://pub-<prod-hash>.r2.dev"
      },
      "r2_buckets": [
        {
          "binding": "MY_BUCKET",
          "bucket_name": "<project>-prod"
        }
      ]
    }
  }
}
```

Update your deploy script to actually use the named environment:

```jsonc
// package.json
"deploy": "npm run build && wrangler deploy --env production"
```

Without `--env production`, a plain `wrangler deploy` would ship with the
**dev** bucket wired in — the top-level config is what non-`--env` commands use.

## 4. Regenerate Cloudflare types

```bash
npm run cf-typegen   # runs `wrangler types`
```

This updates `worker-configuration.d.ts` so `env.MY_BUCKET` (an `R2Bucket`) and
`env.R2_PUBLIC_URL` are properly typed wherever you import `env` from
`"cloudflare:workers"`. Re-run this any time `wrangler.jsonc` changes.

## 5. Write a server function to handle the upload

Uploads must happen server-side — the R2 binding only exists inside the Worker
runtime, never in the browser. A TanStack Start server function that accepts
`FormData` is the simplest bridge:

```ts
// src/server/upload.ts
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

export const uploadImage = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Missing file");
    return file;
  })
  .handler(async ({ data: file }) => {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
    const key = `<folder>/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

    await env.MY_BUCKET.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });

    return { url: `${env.R2_PUBLIC_URL}/${key}` };
  });
```

The `<folder>/` prefix in the key is just a naming convention (R2 has no real
directories) — it's what lets you organize objects by feature, e.g. `services/`,
`dogs/`, `events/`.

## 6. Call it from the client

Build a `FormData` with the selected file and call the server function directly —
no separate presigned-URL step needed, unlike raw S3-style uploads.

```tsx
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.set("file", file);
  const { url } = await uploadImage({ data: formData });
  // `url` is the public image URL — save it to your database
};
```

## 7. Store the URL and render the image

Save the returned URL as a plain string field on your record (e.g. `image:
v.optional(v.string())` in a Convex schema, or the equivalent column elsewhere).
No signed URLs, no resolving a storage ID at read time — just:

```tsx
{service.image && <img src={service.image} alt={service.name} />}
```

## 8. Local development gotcha

Without `"remote": true` on the binding, `vite dev` / `wrangler dev` silently
writes uploads to a local Miniflare-simulated R2 store on disk
(`.wrangler/state/v3/r2/...`) instead of the real bucket. Symptom: your database
has a URL that 404s because the object was never actually written to Cloudflare.
Fix is step 3 above — `"remote": true` makes local dev hit the real dev bucket.

## 9. Deploying

```bash
npm run deploy   # now runs `wrangler deploy --env production`
```

Double check with a dry run first if you want to see what would ship:

```bash
npx wrangler deploy --dry-run --env production
```

## Optional follow-ups

- **Cleanup on delete/replace**: if a record's image is replaced or the record is
  deleted, consider deleting the old R2 object too (`env.MY_BUCKET.delete(key)`)
  to avoid orphaned files accumulating in the bucket.
- **Custom domain instead of r2.dev**: nicer URLs, and doesn't expose the bucket
  at a generic Cloudflare-issued hostname.
- **Migrating away from another storage system**: if records already have images
  stored elsewhere (e.g. a platform's built-in file storage), keep a fallback read
  path until everything's been re-uploaded through the new R2 flow, then remove it.
