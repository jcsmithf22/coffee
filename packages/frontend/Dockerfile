FROM oven/bun:1 as builder

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

# Use nginx to serve the static files
FROM nginx:alpine

# Copy the built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80
# EXPOSE 80

# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]
