# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .
# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/desafios_diarios.json ./desafios_diarios.json
COPY --from=builder /app/books.json ./books.json
COPY src/assets ./dist/src/assets

# Expose the port your app runs on
EXPOSE 80

# Start the application
CMD ["node", "dist/src/main.js"] 