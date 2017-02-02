FROM node:latest

RUN mkdir -p /poet
WORKDIR /poet

COPY ./node/package.json /poet
COPY ./node/tsconfig.json /poet
RUN npm install

VOLUME /poet/src

EXPOSE 5000
CMD [ "npm", "run", "mock-signer" ]
