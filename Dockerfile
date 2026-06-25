# --- Development Stage ---
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Set environment variable to indicate we are running inside Docker
ENV DOCKER=true

CMD ["npm", "run", "dev"]


# --- Build Stage ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Accept build arguments for environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


# --- Production Stage ---
FROM nginx:alpine AS production

# Copy custom Nginx configuration if needed, otherwise copy built assets to default path
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
