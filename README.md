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

## Deploy

Ensure there's .env.production

`npx wrangler login`
`npm run build`
`npm run deploy`

Logs
`npx wrangler tail`

Preview
`npx wrangler dev` or `npm run preview`

## To do

[] Crawl welfare group site with agent harness until it can get the exact results
[] Crawl for events
[] Restrict Google Map
[] For each vet, get its opening hours, whether it's open on PH, whether it has emergency number
[] Convex Firecrawl to get dogs
[] Services like artists
[] Admin add filter by welfare group
[] Email when local mail to myself
[] Recommended products
[] Provide accounts to welfare groups to log in and update their dogs
[] Posts about pyrometra, prostate cancer, sterilisation, skin, costs, home
[] Partners like Kenny for washing pet stuff
[] Boarding
[] Swimming https://www.facebook.com/fortcaninesg
[] Secure admin pages and APIs
[] Multiple pictures
[] Migrate convex dev to prod
[] Add chained dog awareness
[] Create log in for welfare group to update and contact them
[] View welfare groups' dogs
[] Add a description informing welfare group to contact us if dog no longer available / make correction
[] Convex queries (useQuery) run client-side via WebSocket, so data fetched from Convex won't be in the initial SSR HTML — the server renders the loading/skeleton state. If SEO on dog listing pages matters, you'd need to either pre-fetch on the server using a Convex HTTP client, or use useSuspenseQuery with proper server-side data loading via TanStack Router's loader. The current setup handles SEO well for static content and metadata, but dynamic dog data is hydrated after page load.
[] Add https://houserabbitsocietysingapore.wordpress.com/, https://www.catwelfare.org/, https://www.hamstersociety.sg/adoptiongallery
[] Add services like pawfresh
[] Add Posthog
