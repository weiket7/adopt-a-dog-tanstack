## Built using

1. Claude Design
2. Claude Code
3. TanStack Start
   - TanStack Router
   - TanStack Query
   - TanStack Table
4. [dayjs](https://github.com/iamkun/dayjs)  
   `npm install dayjs --save`
5. [Convex](https://docs.convex.dev/quickstart/tanstack-start)  
   `npm install convex @convex-dev/react-query @tanstack/react-router-with-query @tanstack/react-query`
   - Auth
     `npm install @convex-dev/auth`

6. Resend  
   `npm install resend @react-email/components`
7. Zod
8. vis.gl/react-google-maps
9. [Images of dogs](https://placedog.net/)
10. Hosted in Cloudflare  
    https://tanstack.com/start/latest/docs/framework/react/guide/hosting  
    `npm add -D @cloudflare/vite-plugin wrangler`

## Run in local

`npx @convex-dev/auth generate-keys`

`npx convex dev`

`npm run dev`

## Deploy to Cloudflare

In Convex, create environment variables `SITE_URL`, `JWT_PRIVATE_KEY`, `JWKS`  
`npx @convex-dev/auth --prod`

`npx convex deploy`

Ensure there's .env.production

`npm run build`

Preview  
`npx wrangler dev` or `npm run preview`

`npx wrangler login`

`npm run deploy`

Logs  
`npx wrangler tail`
