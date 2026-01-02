FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY src /app/src
COPY package.json /app/package.json
COPY pnpm-lock.yaml /app/pnpm-lock.yaml
COPY test-auth.sh /app/test-auth.sh
COPY tsconfig.json /app/tsconfig.json

WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY healthcheck.js /app/healthcheck.js
COPY startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh
COPY prisma /app/prisma
COPY prisma.config.ts /app/prisma.config.ts
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "/usr/local/bin/node", "/app/healthcheck.js" ]
CMD [ "sh", "/app/startup.sh" ]
