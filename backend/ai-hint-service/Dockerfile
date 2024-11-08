# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript (if using TypeScript)
RUN npm run build

# Expose the port
EXPOSE 3006

# Start the application
CMD ["npm", "start"]
