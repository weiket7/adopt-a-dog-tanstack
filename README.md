## Tech stack

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
   - Export
     `npx convex run vets:listAll --prod > vets-prod.json`

6. [Resend](https://resend.com/)  
   `npm install resend @react-email/components`
7. [Zod](https://zod.dev/)
8. Google Maps Platform API

- https://visgl.github.io/react-google-maps/

9. [Random images of dogs](https://placedog.net/)
10. Hosted in Cloudflare  
    https://tanstack.com/start/latest/docs/framework/react/guide/hosting  
    `npm add -D @cloudflare/vite-plugin wrangler`

## Run in local

`nvm install 23 --lts`

`nvm use 23`

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

Deploy  
`npx wrangler login`

`npm run deploy`

Logs  
`npx wrangler tail`

Add secret  
`npx wrangler secret put <SECRET_NAME>`

## Resources

6 file context
https://github.com/adrianhajdin/ghost-ai/tree/main/context

https://github.com/jeremymorgan/claude-code-reviewing-prompts
