FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all project files
COPY . .

# Build the React app
RUN npm run build

# Install serve to serve the build folder
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Serve the build
CMD ["serve", "-s", "build", "-l", "3000"]
