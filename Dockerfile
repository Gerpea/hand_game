FROM node:alpine

WORKDIR /usr/app

COPY ./package*.json ./
COPY ./packages ./packages
COPY ./client ./client
COPY ./server ./server

RUN npm i -g pm2
RUN npm ci --include=dev

RUN npm run packages:build
RUN npm run packages:link

RUN npm run client:link
RUN npm run client:build

RUN npm run server:build

EXPOSE 8080
EXPOSE 3000

USER node
CMD [ "sh", "-c" ,"npm run server:start & npm run client:start" ]