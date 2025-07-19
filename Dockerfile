FROM oven/bun:1-alpine AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

COPY . .
RUN bun run build

FROM busybox:stable
COPY --from=builder /app/dist /www
WORKDIR /www
EXPOSE 8080
CMD ["httpd", "-f", "-p", "8080"]
