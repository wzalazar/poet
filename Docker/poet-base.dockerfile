FROM node:latest

RUN mkdir -p /poet
WORKDIR /poet

COPY ./node/package.json /poet
COPY ./node/tsconfig.json /poet
RUN npm install

COPY ../poet-js /poet-js
WORKDIR /poet-js
RUN npm install
RUN npm link

WORKDIR /poet
RUN npm link poet-js
