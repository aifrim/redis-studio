FROM node:16.18.0-alpine3.16 as deps
RUN apk add --no-cache libc6-compat

WORKDIR deps

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile

FROM node:16.18.0-alpine3.16 as builder

WORKDIR builder

COPY --from=deps /deps/node_modules ./node_modules
COPY . .

RUN yarn build

FROM node:16.18.0-alpine3.16

WORKDIR redis-studio

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ENV NODE_ENV production
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /builder/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /builder/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
