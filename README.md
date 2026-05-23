## Built using

1. TanStack Start
   - TanStack Router
   - TanStack Query
   - TanStack Table
2. [dayjs](https://github.com/iamkun/dayjs)
3. [Convex](https://docs.convex.dev/quickstart/tanstack-start)
   - Auth
4. Resend
5. Zod
6. vis.gl/react-google-maps

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

## To do

[] Restrict Google Map
[] Convex Firecrawl to get dogs
[] Whether console.log is being logged twice
[] Services like artists
[] Email when local mail to myself
[] Recommended products
[] Posts about pyrometra, prostate cancer, sterilisation, skin, costs, home
[] Partners like Kenny for washing pet stuff
[] Boarding
[] Handle all errors like convex
[] Swimming https://www.facebook.com/fortcaninesg
[] Change view dog to slug and welfare group name
[] Secure admin pages and APIs
[] Multiple pictures
[] Pagination
[] Migrate convex dev to prod
[] Create log in for welfare group to update
[] View welfare groups' dogs
[] Google ads / patreon / buy coffee to earn some money back
