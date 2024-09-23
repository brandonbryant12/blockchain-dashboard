# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and lock files
COPY package.json package-lock.json* ./

# Install dependencies based on the preferred package manager
RUN if [ -f package-lock.json ]; then \
      npm ci; \
      npm update; \
      npm audit fix --force; \
    else \
      echo "Lockfile not found." && exit 1; \
    fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass build-time environment variables
ARG BUILDTIME_ENV_VARS
ENV BUILDTIME_ENV_VARS=${BUILDTIME_ENV_VARS}

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy standalone output if it exists, otherwise copy the entire .next folder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./standalone
RUN if [ -d "./standalone" ]; then \
      cp -R ./standalone/* ./; \
      rm -rf ./standalone; \
    else \
      echo "Standalone output not found. Using default Next.js output."; \
    fi

# Pass runtime environment variables
ARG DASHBOARD_ENV_VARS
ENV DASHBOARD_ENV_VARS=${DASHBOARD_ENV_VARS}

USER nextjs

# Expose port 3000
EXPOSE 3000

# Set the host to 0.0.0.0 to make the server accessible externally
ENV HOSTNAME "0.0.0.0"

# Set the port to 3000
ENV PORT 3000

# Start the application
CMD ["node", "server.js"]