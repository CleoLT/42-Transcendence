FROM node:20.19.6-alpine

WORKDIR /app
COPY package*.json ./
#RUN npm cache clean --force
RUN npm ci

COPY . .
EXPOSE 3000

CMD ["node", "index.js"]

