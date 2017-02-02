FROM node:latest

RUN mkdir -p /web
WORKDIR /web

COPY ./web/package.json /web
COPY ./web/tsconfig.json /web
RUN npm install

RUN npm build
