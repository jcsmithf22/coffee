FROM oven/bun

COPY bun.lock .
COPY package.json .

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 4000
CMD ["bun", "index.ts"]
