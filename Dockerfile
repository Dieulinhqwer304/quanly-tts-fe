# ================================
# Stage 1: Dependencies
# ================================
FROM node:20-alpine AS deps

# Install dependencies only when needed
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with frozen lockfile
RUN yarn install --frozen-lockfile --production=false

# ================================
# Stage 2: Builder
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build application
RUN yarn build

# ================================
# Stage 3: Runtime (Lightweight)
# ================================
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Install serve globally for serving static files
RUN yarn global add serve

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Serve the built application
CMD ["serve", "-s", "dist", "-l", "3000"]
