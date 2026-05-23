## Built using

1. Claude Design
2. Claude Code
3. TanStack Start
   - TanStack Router
   - TanStack Query
   - TanStack Table
4. [dayjs](https://github.com/iamkun/dayjs)
5. [Convex](https://docs.convex.dev/quickstart/tanstack-start)
   - Auth
6. Resend
7. Zod
8. vis.gl/react-google-maps
9. [Images of dogs](https://placedog.net/)

## Run

`npx convex dev`

`npm run dev`

## Packages

`npm install @tanstack/react-table`

`npm install dayjs --save`

`npm install convex @convex-dev/react-query @tanstack/react-router-with-query @tanstack/react-query`
`npm install @convex-dev/auth`
`npx @convex-dev/auth generate-keys`

`npm install resend @react-email/components`

## Template

Porto 12.1  
As of Feb 2026, latest version is 13  
https://preview.themeforest.net/item/porto-responsive-html5-template/full_screen_preview/4106987

## Hosted in Cloudflare

npm add -D @cloudflare/vite-plugin wrangler

npx wrangler tail my-tanstack-app

https://tanstack.com/start/latest/docs/framework/react/guide/hosting

## Data

## Vets

1. Download PDF from https://avs.nparks.gov.sg/outreach/resources/public-registry-of-avs-licensed-veterinary-centres/
2. Parse it into a table
3. `refer to design/vets.xlsx, go to seeds.ts, replace existing VETS with the data`
4. In Convex, run seedVets function

## Dogs

```
refer to design/admin.jsx

given src/styles/admin.css

implement in src/routes/admin.dogs.index.tsx, ignore admin.dogs.$dogId.tsx
```

## To do

[] Restrict Google Map
[] Convex Firecrawl to get dogs
[] Services like artists
[] Email when local mail to myself
[] Recommended products
[] Posts about pyrometra, prostate cancer, sterilisation, skin, costs, home
[] Partners like Kenny for washing pet stuff
[] Boarding
[] Swimming https://www.facebook.com/fortcaninesg
[] Secure admin pages and APIs
[] Multiple pictures
[] Pagination
[] Migrate convex dev to prod
[] Create log in for welfare group to update
[] View welfare groups' dogs
