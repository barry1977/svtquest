# ---- Build stage ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage (API + SPA) ----
# Les secrets (OPENAI_API_KEY) sont injectés au runtime via env / env_file.
# Ils ne sont jamais embarqués dans le bundle front.
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

LABEL org.opencontainers.image.title="SVT Quest" \
      org.opencontainers.image.description="Application éducative SVT Collège" \
      org.opencontainers.image.source="https://github.com/local/svtquest"

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server ./server
COPY --from=build /app/dist ./dist

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

USER node

CMD ["node", "server/index.mjs"]
