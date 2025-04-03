# Use a Node.js base image
FROM node:22-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies, including Playwright and Chromium
RUN npm install && \
    npx playwright install chrome

# Copy the rest of your application code
COPY . .

# Expose the port your application listens on
EXPOSE 3000

# Start your application
CMD ["node", "server.js"]