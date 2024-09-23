# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and lock files
COPY package.json package-lock.json* ./

# Install dependencies
RUN if [ -f package-lock.json ]; then \
      npm ci; \
      npm update; \
      npm audit fix --force; \
    else \
      echo "Lockfile not found." && exit 1; \
    fi

# Build the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Define build arguments
ARG BTC_RPC_USER
ARG BTC_RPC_PASSWORD
ARG BTC_RPC_HOST
ARG BTC_RPC_PORT
ARG FRACTAL_RPC_USER
ARG FRACTAL_RPC_PASSWORD
ARG FRACTAL_RPC_HOST
ARG FRACTAL_RPC_PORT
ARG MASTER_PASSWORD
ARG JWT_SECRET

# Set environment variables
ENV BTC_RPC_USER=$BTC_RPC_USER
ENV BTC_RPC_PASSWORD=$BTC_RPC_PASSWORD
ENV BTC_RPC_HOST=$BTC_RPC_HOST
ENV BTC_RPC_PORT=$BTC_RPC_PORT
ENV FRACTAL_RPC_USER=$FRACTAL_RPC_USER
ENV FRACTAL_RPC_PASSWORD=$FRACTAL_RPC_PASSWORD
ENV FRACTAL_RPC_HOST=$FRACTAL_RPC_HOST
ENV FRACTAL_RPC_PORT=$FRACTAL_RPC_PORT
ENV MASTER_PASSWORD=$MASTER_PASSWORD
ENV JWT_SECRET=$JWT_SECRET

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Set permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Handle standalone output
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

# **Add these lines to make BUILDTIME_ENV_VARS available in the runner stage**
ARG BUILDTIME_ENV_VARS
ENV BUILDTIME_ENV_VARS=${BUILDTIME_ENV_VARS}

USER nextjs

# Expose environment variables
ENV BTC_RPC_USER=$BTC_RPC_USER
ENV BTC_RPC_PASSWORD=$BTC_RPC_PASSWORD
ENV BTC_RPC_HOST=$BTC_RPC_HOST
ENV BTC_RPC_PORT=$BTC_RPC_PORT
ENV FRACTAL_RPC_USER=$FRACTAL_RPC_USER
ENV FRACTAL_RPC_PASSWORD=$FRACTAL_RPC_PASSWORD
ENV FRACTAL_RPC_HOST=$FRACTAL_RPC_HOST
ENV FRACTAL_RPC_PORT=$FRACTAL_RPC_PORT
ENV MASTER_PASSWORD=$MASTER_PASSWORD
ENV JWT_SECRET=$JWT_SECRET

# Expose port 3000
EXPOSE 3000


# Set host and port
ENV HOSTNAME "0.0.0.0"
ENV PORT 3000

# Start the application
CMD ["node", "server.js"]
