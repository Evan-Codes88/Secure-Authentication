# Build Stage
FROM node:23.11.0-slim AS build

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Development Stage
FROM node:23.11.0-slim AS development

WORKDIR /usr/src/app

# Copy only necessary files from build stage
COPY --from=build /usr/src/app /usr/src/app

# Set environment variable for development
ENV NODE_ENV=development

# Install development dependencies (optional if you have dev dependencies)
RUN npm install --only=development

# Expose port
EXPOSE 8881

# Command to run in development
CMD ["npm", "run", "dev"]

# Production Stage
FROM node:23.11.0-slim AS production

WORKDIR /usr/src/app

# Copy only necessary files from build stage
COPY --from=build /usr/src/app /usr/src/app

# Set environment variable for production
ENV NODE_ENV=production

# Install production dependencies
RUN npm install --only=production

# Expose port
EXPOSE 8881

# Command to run in production
CMD ["npm", "run", "start"]
