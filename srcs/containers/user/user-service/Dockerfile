FROM node:20-alpine

#RUN apk add --no-cache python3 make g++ sqlite-dev

WORKDIR /app

COPY package*.json ./

RUN npm install 

RUN mkdir -p data

COPY *.js ./
COPY public ./public

EXPOSE 3000

CMD ["node", "server.js"]
