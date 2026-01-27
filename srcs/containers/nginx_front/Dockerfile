FROM node:20-alpine AS build

WORKDIR /app

# Install frontend dependencies
COPY front-end/package*.json ./
RUN npm install

# Copy the rest of the frontend source and build it
COPY front-end/ ./
RUN npm run build

FROM nginx:1.25-alpine

RUN apk add --no-cache openssl \
 && mkdir -p /etc/ssl/certs /etc/ssl/private \
 && openssl req -x509 -nodes -days 365 \
    -subj "/CN=transcendence" \
    -newkey rsa:2048 \
    -keyout /etc/ssl/private/transcendence.key \
    -out /etc/ssl/certs/transcendence.crt

COPY containers/nginx_front/conf/nginx.conf /etc/nginx/conf.d/default.conf

# Serve the built React app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 443

# Start NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]
