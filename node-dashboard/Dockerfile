FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and serve
RUN npm ci && npm install -g serve

# Copy the rest of the application code
COPY . .

# Set build-time argument for VITE_API_BASE_URL
ARG VITE_API_BASE_URL

# Ensure the environment variable is available during build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "dist", "-l", "3000"]
