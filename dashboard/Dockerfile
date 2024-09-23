# Base image
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG BUILDTIME_ENV_VARS
ENV BUILDTIME_ENV_VARS=${BUILDTIME_ENV_VARS}
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 3000

# Runtime environment variables
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV DASHBOARD_ENV_VARS=${DASHBOARD_ENV_VARS}

# Start the application
CMD ["npm", "run", "start"]
