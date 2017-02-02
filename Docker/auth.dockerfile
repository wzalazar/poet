FROM node:latest

RUN mkdir -p /poet
WORKDIR /poet

COPY ./package.json /poet
COPY ./tsconfig.json /poet
RUN npm install

VOLUME /poet/src

EXPOSE 5000
CMD [ "npm", "run", "authserver" ]
