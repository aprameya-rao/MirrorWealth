# Frontend/Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start the dev server and expose it to the Docker network
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]