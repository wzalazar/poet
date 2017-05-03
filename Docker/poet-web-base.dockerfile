FROM node:latest

RUN mkdir -p /web
WORKDIR /web

COPY ./web/package.json /web
COPY ./web/tsconfig.json /web
COPY ./web/webpack.config.js /web
COPY ./web/devServer.js /web

RUN npm install

COPY ../poet-js /poet-js
WORKDIR /poet-js
RUN npm install
RUN npm link

WORKDIR /poet
RUN npm link poet-js
