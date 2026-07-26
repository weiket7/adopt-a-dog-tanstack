# Events add link

for convex/events, remove cta and in admin.events.index.tsx

in admin.events.index.tsx, above description, add a textbox for link

---

# SEO

are the pages index.tsx, events.tsx, dog-runs.tsx, services.tsx, vets.tsx, welfare-groups.tsx server side rendered for seo optimisation

---

# Refactor Icon

for all files in routes, extract icons to components/Icon.tsx, re-use existing icon in Icon.tsx if it's present

---

# Cloudflare R2

existing admin.services.index.tsx uploads image to convex

change it to upload to cloudflare r2 bucket adopt-a-dog-dev for local and  adopt-a-dog-prod for production

in convex, add a field called image and save image url to it and remove services.imageStorageId

---

# Dog images

following admin.services.tsx, make events upload to cloudflare r2 instead into a folder events

following admin.services.tsx, make admin.dog-runs.index.ts upload to cloudflare r2 into a folder called dog-runs
