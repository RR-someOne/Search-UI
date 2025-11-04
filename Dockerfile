# Production build for Node.js application
FROM node:25-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application source code
COPY --chown=nodejs:nodejs server.js ./
COPY --chown=nodejs:nodejs public/ ./public/

# Create any necessary directories
RUN mkdir -p ./public && chown -R nodejs:nodejs ./public

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]