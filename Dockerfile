# Step 1: Use Node image to build the app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build the Next.js app
COPY . .
RUN npm run build

# Step 2: Use a lightweight Node image to serve the app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install a simple HTTP server to serve your Next.js app
RUN npm install -g next

# Copy built app from builder
COPY --from=builder /app ./

# Expose the port Next.js runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
