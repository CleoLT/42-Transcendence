FROM node:20.19.6-alpine

WORKDIR /app
COPY package*.json ./
#RUN npm cache clean --force
RUN npm ci

COPY . .

COPY ./tools/start.sh /tools/start.sh

RUN chmod 700 /tools/start.sh

EXPOSE 3000

ENTRYPOINT ["/tools/start.sh"]

