# Use node:alpine for a smaller base image
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy all the source code
COPY --chown=nginx:nginx . .

# Install dependencies
RUN npm install

# Build the app
# RUN npm run build || { echo "Build failed"; exit 1; } && \
#     echo "Build complete" && \
#     ls -alh build/


CMD [ "npm", "run", "build" ]
# Production stage: Use nginx to serve the build files
FROM nginx:alpine

# Copy build files to nginx directory
# COPY --from=builder /app/build /usr/share/nginx/html

# Expose the port Nginx will run on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
