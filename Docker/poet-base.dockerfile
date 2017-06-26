FROM poet-typescript

RUN mkdir -p /poet
WORKDIR /poet

COPY ./node/package.json /poet
COPY ./node/tsconfig.json /poet
RUN npm install

WORKDIR /poet