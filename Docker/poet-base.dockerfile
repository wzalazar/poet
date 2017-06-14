FROM node:8.1.0

RUN mkdir -p /poet
WORKDIR /poet

COPY ./node/package.json /poet
COPY ./node/tsconfig.json /poet
RUN npm install
