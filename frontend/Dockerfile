# frontend/Dockerfile

# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# If using yarn, copy yarn.lock and use yarn install
# COPY yarn.lock ./
# RUN yarn install --frozen-lockfile

# Install dependencies using npm
RUN npm install

# Copy the rest of the application code into the container
# Ensure this includes the src directory containing index.html
COPY . .

# Set the API URL during build time (can be overridden by docker-compose)
# This environment variable will be available during the build process
ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=$VITE_API_URL

# Run the build command.
# Vite automatically detects index.html in the root or src.
# If it still fails, explicitly point to the entry point:
# RUN npm run build -- --outDir dist src/index.html
RUN npm run build

# Stage 2: Serve the static files using a lightweight web server (Nginx)
FROM nginx:stable-alpine

# Copy the built static files from the 'build' stage to the Nginx html directory
# The default output directory for Vite build is 'dist'
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Copy a custom Nginx configuration file if needed
# This default config usually works for Single Page Applications (SPAs)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# Example nginx.conf to handle SPA routing:
# server {
#   listen 80;
#   server_name localhost;

#   location / {
#     root /usr/share/nginx/html;
#     index index.html;
#     try_files $uri $uri/ /index.html; # Important for SPA routing
#   }
# }

# Expose port 80 (Nginx default port)
EXPOSE 80

# Command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]