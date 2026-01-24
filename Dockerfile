# Build stage for frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy all files first (needed for postinstall script)
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies (this will also run postinstall which installs server deps)
RUN npm ci

# Copy remaining source files
COPY . .

# Build frontend
RUN npm run build

# Build stage for backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Install production dependencies for server
COPY server/package*.json ./
RUN npm ci --only=production

# Copy built backend
COPY --from=backend-builder /app/server/dist ./dist

# Copy built frontend to be served as static files
COPY --from=frontend-builder /app/dist ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]
