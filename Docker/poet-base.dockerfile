FROM poet-typescript

RUN mkdir -p /poet
WORKDIR /poet

COPY ./node/package.json /poet
COPY ./node/tsconfig.json /poet
RUN npm install

# poet-js is installed from the github repo, which contains the sources but not the build
WORKDIR /poet/node_modules/poet-js
RUN tsc

WORKDIR /poet