# la-next
Next.js frontend SSR for la-server

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

* Generate and add a new `NEXTAUTH_SECRET` in the __.env__ file.
  + Use `openssl rand -base64 32` to generate one

## Gotchas
* If you get an error 'NextResponse has already been declared int he middleware
  + `yarn upgrade next@^13.4.5`
  + https://github.com/nextauthjs/next-auth/issues/7650#issuecomment-1571768250

* If you get an error regarding `requestAsyncStorage` (ex: https://github.com/vercel/next.js/issues/46356)
  + Use Node 16 instead of Node 18

* If errors where the compiler is unable to identify moved/ changed files (specially layouts)
  + Remove __.next__ folder and restart both the client and server