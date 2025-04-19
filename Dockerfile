# Build Stage
FROM node:23.11.0-slim AS build

WORKDIR /usr/src/app

# Copy only package files to install dependencies
COPY package*.json ./
RUN npm install

# Copy application code to prepare for build
COPY . .

# Development Stage
FROM node:23.11.0-slim AS development

WORKDIR /usr/src/app

# Copy only the necessary files from build stage
COPY --from=build /usr/src/app /usr/src/app

# Set environment variable for development
ENV NODE_ENV=development

# Install development dependencies
RUN npm install --only=development

# Expose port
EXPOSE 8881

# Command to run the app in development mode
CMD ["npm", "run", "dev"]

# Production Stage
FROM node:23.11.0-slim AS production

WORKDIR /usr/src/app

# Copy only necessary files (no need for dev dependencies, config files, etc.)
COPY --from=build /usr/src/app /usr/src/app

# Set environment variable for production
ENV NODE_ENV=production

# Install production dependencies only
RUN npm install --only=production

# Expose port
EXPOSE 8881

# Command to run the app in production mode
CMD ["npm", "run", "start"]

# Testing Stage
FROM node:23.11.0-slim AS testing

WORKDIR /usr/src/app

# Copy only the necessary files from build stage
COPY --from=build /usr/src/app /usr/src/app

# Set environment variable for testing
ENV NODE_ENV=test

# Install testing dependencies
RUN npm install --only=development

# Expose port (optional, depending on test setup)
EXPOSE 8881

# Command to run the tests
CMD ["npm", "run", "test"]
