FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json .
COPY bun.lock .

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Expose the port (assuming default Hono port)
EXPOSE 4000

# Start the server
CMD ["bun", "run", "src/index.ts"]
