FROM node:latest

RUN mkdir -p /web
WORKDIR /web

COPY ./web/package.json /web
COPY ./web/tsconfig.json /web
COPY ./web/webpack.config.js /web
COPY ./web/devServer.js /web

RUN npm install

