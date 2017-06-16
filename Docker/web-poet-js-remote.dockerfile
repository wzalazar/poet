FROM poet-typescript

RUN mkdir -p /web
WORKDIR /web

COPY ./web/package.json /web
COPY ./web/tsconfig.json /web
COPY ./web/webpack.config.js /web
COPY ./web/devServer.js /web

RUN npm i

# poet-js is installed from the github repo, which contains the sources but not the build
WORKDIR /web/node_modules/poet-js
RUN tsc

WORKDIR /web

CMD [ "npm", "start" ]
